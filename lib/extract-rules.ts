import type { Commitment, CommitmentCategory } from "./types";

/**
 * Deterministic clause parser. Used when Amazon Bedrock is not configured and
 * as a cross-check for model output. It only reads what the text states:
 * missing quantities, deadlines and placements stay null.
 */

export type ExtractedCommitment = Omit<
  Commitment,
  "id" | "agreementId" | "sponsorId" | "eventId" | "reviewStatus" | "reviewedBy" | "reviewedAt"
>;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DATE_RE = new RegExp(`(\\d{1,2})\\s+(${MONTHS.join("|")})\\s+(\\d{4})`, "g");
const CLAUSE_RE = /^\s*([A-Z]\.\d+|\d+\.\d+)\s+(.+)$/;
const UNIT_NOUNS =
  "posts?|announcements?|entries|shirts|booths?|placements?|reports?|newsletters?|advertisements?|bars?|summary|summaries|banners?|tickets?|passes|screens?|mentions?|videos?|stories";
const QTY_RE = new RegExp(`(\\d[\\d,]*)\\s+((?:[\\w-]+\\s){0,3}?)(${UNIT_NOUNS})\\b(?!-)`, "i");

function toIso(d: string, m: string, y: string) {
  const month = String(MONTHS.indexOf(m) + 1).padStart(2, "0");
  return `${y}-${month}-${d.padStart(2, "0")}`;
}

function categorize(title: string, body: string): CommitmentCategory {
  const t = `${title} ${body}`.toLowerCase();
  if (/report|integrity of figures/.test(title.toLowerCase())) return "Reporting";
  if (/signage|logo on the .*arch|banner|arch\b/.test(t)) return "Signage";
  if (/\bpa\b|announcement|broadcast|commentary/.test(t)) return "Broadcast & PA";
  if (/instagram|social|newsletter|email|digital|website|tiktok|linkedin/.test(t)) return "Digital & Social";
  if (/booth|expo|activation|coffee bar|sampling/.test(t)) return "Activation";
  if (/hospitality|entries|tickets|passes|vip/.test(t)) return "Hospitality";
  if (/shirt|apparel|merch|programme|advertisement|print/.test(t)) return "Merchandise";
  if (/report|recorded/.test(t)) return "Reporting";
  return "Other";
}

export function extractCommitmentsByRules(text: string): ExtractedCommitment[] {
  const out: (ExtractedCommitment & { refs: string[] })[] = [];

  for (const rawLine of text.split(/\r?\n/)) {
    const m = rawLine.match(CLAUSE_RE);
    if (!m) continue;
    const clause = m[1];
    const full = m[2].trim();
    const titleMatch = full.match(/^([^.]{2,40})\.\s+(.*)$/);
    const title = titleMatch ? titleMatch[1] : full.split(/[.,]/)[0].slice(0, 60);
    const body = titleMatch ? titleMatch[2] : full;

    const dates = [...body.matchAll(DATE_RE)].map((d) => toIso(d[1], d[2], d[3]));
    const deadline = dates.length ? dates[dates.length - 1] : null;

    const withoutDates = body.replace(DATE_RE, "").replace(/\d+m\s*x\s*\d+m/gi, "").replace(/USD\s*[\d,]+/g, "");
    const q = withoutDates.match(QTY_RE);
    const quantity = q ? Number(q[1].replace(/,/g, "")) : null;
    const unit = q ? `${q[2]}${q[3]}`.trim() : null;

    const p = body.match(/\b(?:on|at|in)\s+the\s+(.+?)(?=\s+(?:for|by|between|during|no later|within)\b|[,.;](?!\d)|$)/i);
    const placement = p ? p[1].trim() : null;

    const category = categorize(title, body);
    const refs = category === "Reporting" ? [...body.matchAll(/\b([A-Z]\.\d+)\b/g)].map((r) => r[1]) : [];

    const confidence: ExtractedCommitment["confidence"] =
      quantity !== null && deadline ? "high" : quantity !== null || deadline ? "medium" : "low";

    out.push({
      clause,
      benefit: `${title}: ${body.replace(/^Organizer shall\s+/i, "").replace(/\.$/, "")}`,
      category,
      quantity,
      unit,
      placement: category === "Reporting" ? null : placement,
      deadline,
      reportingRequirement: category === "Reporting" ? body : null,
      sourceText: `${clause} ${full}`,
      confidence,
      critical: (quantity !== null && deadline !== null) || category === "Reporting",
      refs,
    });
  }

  // Reporting clauses that reference other clauses ("posts under A.2") attach
  // their requirement to those clauses so it shows up where the work happens.
  for (const r of out.filter((c) => c.refs.length)) {
    for (const ref of r.refs) {
      const target = out.find((c) => c.clause === ref);
      if (target && !target.reportingRequirement) {
        target.reportingRequirement = `Per ${r.clause}: evidence or recorded metrics required in post-event report.`;
      }
    }
  }

  return out.map(({ refs: _refs, ...c }) => c);
}

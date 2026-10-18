import type { Commitment, Evidence, Metric, Store, Task } from "./types";

export type FulfilmentStatus =
  | "awaiting_review"
  | "fulfilled"
  | "partially_evidenced"
  | "no_evidence"
  | "overdue"
  | "excluded";

export interface CommitmentState {
  commitment: Commitment;
  tasks: Task[];
  evidence: Evidence[];
  metrics: Metric[];
  evidencedQty: number;
  verifiedQty: number;
  status: FulfilmentStatus;
  daysToDeadline: number | null;
  gaps: string[];
}

export const STATUS_LABEL: Record<FulfilmentStatus, string> = {
  awaiting_review: "Awaiting human review",
  fulfilled: "Evidenced",
  partially_evidenced: "Partially evidenced",
  no_evidence: "No evidence yet",
  overdue: "Overdue — unfulfilled",
  excluded: "Rejected at review",
};

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);
}

export function commitmentState(store: Store, c: Commitment, now = today()): CommitmentState {
  const tasks = store.tasks.filter((t) => t.commitmentId === c.id);
  const evidence = store.evidence.filter((e) => e.commitmentId === c.id);
  const metrics = store.metrics.filter((m) => m.commitmentId === c.id);
  const target = c.quantity ?? 1;
  const evidencedQty = evidence.reduce((s, e) => s + e.quantityEvidenced, 0);
  const verifiedQty = evidence.filter((e) => e.verified).reduce((s, e) => s + e.quantityEvidenced, 0);
  const daysToDeadline = c.deadline ? daysBetween(now, c.deadline) : null;
  const gaps: string[] = [];

  let status: FulfilmentStatus;
  if (c.reviewStatus === "rejected") status = "excluded";
  else if (c.reviewStatus === "needs_review") status = "awaiting_review";
  else if (evidencedQty >= target) status = "fulfilled";
  else if (daysToDeadline !== null && daysToDeadline < 0) status = "overdue";
  else if (evidencedQty > 0) status = "partially_evidenced";
  else status = "no_evidence";

  if (c.reviewStatus === "needs_review" && c.critical) gaps.push("Important commitment not yet confirmed by a person.");
  if (c.reviewStatus === "confirmed") {
    if (evidencedQty < target)
      gaps.push(`Evidence covers ${evidencedQty} of ${target}${c.unit ? ` ${c.unit}` : ""}.`);
    if (evidencedQty > verifiedQty) gaps.push(`${evidencedQty - verifiedQty} evidenced unit(s) not yet verified by a person.`);
    if (tasks.length === 0) gaps.push("No fulfilment task assigned.");
    if (c.reportingRequirement && c.category !== "Reporting" && metrics.filter((m) => m.provenance === "recorded").length === 0 && /metric|reach|engagement/i.test(c.reportingRequirement + c.benefit))
      gaps.push("Reporting requires recorded metrics; none recorded.");
    if (c.reportingRequirement && c.category !== "Reporting" && /evidence|photograph/i.test(c.reportingRequirement) && evidence.length === 0)
      gaps.push("Report requires evidence for this clause.");
  }

  return { commitment: c, tasks, evidence, metrics, evidencedQty, verifiedQty, status, daysToDeadline, gaps };
}

export function allStates(store: Store, filter?: (c: Commitment) => boolean) {
  return store.commitments.filter(filter ?? (() => true)).map((c) => commitmentState(store, c));
}

export interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  detail: string;
  commitmentId: string;
}

export function buildAlerts(store: Store): Alert[] {
  const alerts: Alert[] = [];
  for (const s of allStates(store)) {
    const c = s.commitment;
    const sponsor = store.sponsors.find((x) => x.id === c.sponsorId)?.name ?? "";
    if (s.status === "overdue")
      alerts.push({
        id: `od-${c.id}`,
        severity: "critical",
        title: `${c.clause} overdue — ${sponsor}`,
        detail: `${shortBenefit(c)}. Deadline ${fmtDate(c.deadline)}; evidence covers ${s.evidencedQty} of ${c.quantity ?? 1}.`,
        commitmentId: c.id,
      });
    else if (s.status === "awaiting_review" && c.critical)
      alerts.push({
        id: `rv-${c.id}`,
        severity: "warning",
        title: `${c.clause} needs human review — ${sponsor}`,
        detail: `Extracted commitment "${shortBenefit(c)}" is marked important and can't be tracked or reported until confirmed.`,
        commitmentId: c.id,
      });
    else if ((s.status === "no_evidence" || s.status === "partially_evidenced") && s.daysToDeadline !== null && s.daysToDeadline <= 14)
      alerts.push({
        id: `due-${c.id}`,
        severity: s.daysToDeadline <= 3 ? "critical" : "warning",
        title: `${c.clause} due in ${s.daysToDeadline} day${s.daysToDeadline === 1 ? "" : "s"} — ${sponsor}`,
        detail: `${shortBenefit(c)}. Evidence covers ${s.evidencedQty} of ${c.quantity ?? 1}.`,
        commitmentId: c.id,
      });
    else if (s.status === "fulfilled" && s.evidencedQty > s.verifiedQty)
      alerts.push({
        id: `vf-${c.id}`,
        severity: "info",
        title: `${c.clause} evidence awaiting verification — ${sponsor}`,
        detail: `${s.evidencedQty - s.verifiedQty} unit(s) uploaded but not yet checked by a person.`,
        commitmentId: c.id,
      });
  }
  const rank = { critical: 0, warning: 1, info: 2 };
  return alerts.sort((a, b) => rank[a.severity] - rank[b.severity]);
}

export function shortBenefit(c: Commitment) {
  return c.benefit.split(":")[0];
}

export function fmtDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function fmtNum(n: number) {
  return n.toLocaleString("en-US");
}

export function fmtMoney(n: number, cur = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(n);
}

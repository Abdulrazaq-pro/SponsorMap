import { Icon } from "@/components/ui";

export const metadata = { title: "Platform & architecture — SponsorMap" };

const FLOWS = [
  { n: "1", t: "Agreement upload", d: "Browser gets a pre-signed URL and uploads the PDF straight to the S3 agreements bucket (SSE-KMS). The object key is stored on the agreement row in PostgreSQL." },
  { n: "2", t: "Commitment extraction", d: "The API sends the agreement text to Claude on Amazon Bedrock with a strict JSON schema. The deterministic clause parser cross-checks quantities and dates; disagreements lower confidence." },
  { n: "3", t: "Human review gate", d: "Commitments land as needs_review. Important ones (quantities, deadlines, reporting duties) cannot generate tasks or appear in reports until a reviewer confirms them. Decisions are written to an audit table." },
  { n: "4", t: "Evidence intake", d: "Photos, documents and exports go to the S3 evidence bucket. Bedrock suggests a category and a likely commitment; a person links and verifies. Metric values are only ever read from uploaded exports or typed by staff." },
  { n: "5", t: "Reminders", d: "An EventBridge schedule runs the reminders Lambda hourly. It queries due-soon and overdue commitments without sufficient evidence and notifies owners (SES / Slack webhook)." },
  { n: "6", t: "Report generation", d: "The report Lambda assembles confirmed commitments, verified evidence and labelled metrics from PostgreSQL. Bedrock drafts narrative from those records only; figures are inserted from the database, never from model output." },
];

const HUBSPOT = [
  { seg: "Event organizers", flow: "Demo request → Contact + Company (type = Organizer) → Deal in 'SponsorMap New Business' pipeline → sequence: agreement-upload onboarding." },
  { seg: "Associations", flow: "Lifecycle lead → task for association specialist → Deal with 'Member-partner packages' property → nurture with association case study." },
  { seg: "Sports clubs", flow: "Lead with 'Season start' date property → deal close date set 8 weeks before season → workflow triggers matchday evidence playbook email." },
  { seg: "Sponsorship agencies", flow: "Company flagged Agency → associate child Companies for each rights holder → Enterprise pipeline → partner manager assigned." },
  { seg: "Sales opportunities (expansion)", flow: "SponsorMap pushes 'commitments fulfilled %' and 'outstanding obligations' to the sponsor's Deal → renewal deal auto-created 90 days before agreement end; risk flag if outstanding > 0." },
];

export default function Platform() {
  return (
    <>
      <section className="hero">
        <div className="container stack" style={{ padding: "72px 24px 56px", maxWidth: 880 }}>
          <span className="eyebrow">Platform</span>
          <h1 className="display" style={{ fontSize: "clamp(34px,5vw,56px)" }}>AWS-native, evidence-first architecture.</h1>
          <p className="lead">Amazon S3 for agreements and evidence. Amazon Bedrock for extraction and report drafting. PostgreSQL as the system of record. AWS Lambda for reminders and report generation.</p>
        </div>
      </section>

      <section className="section">
        <div className="container stack-lg">
          <div className="card card-pad" style={{ overflowX: "auto" }}>
            <ArchitectureDiagram />
          </div>
          <div className="grid-3">
            {FLOWS.map((f) => (
              <div key={f.n} className="feature-card">
                <div className="row" style={{ marginBottom: 10 }}>
                  <span className="badge plain b-purple">{f.n}</span><strong>{f.t}</strong>
                </div>
                <p className="small muted">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container stack-lg">
          <div className="stack" style={{ maxWidth: 720 }}>
            <span className="eyebrow">HubSpot integration</span>
            <h2 className="display">CRM workflows for every segment we serve.</h2>
            <p className="lead">Demo requests create HubSpot contacts and deals today. Delivery status syncs back to sponsor deals so renewal conversations start from facts.</p>
          </div>
          <div className="card">
            <div className="table-wrap">
              <table className="t">
                <thead><tr><th>Segment</th><th>Workflow</th></tr></thead>
                <tbody>
                  {HUBSPOT.map((h) => (
                    <tr key={h.seg}><td style={{ whiteSpace: "nowrap" }}><strong>{h.seg}</strong></td><td className="small">{h.flow}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="small muted row"><Icon name="file" size={16} /> Full workflow specification, properties and pipelines: <span className="mono">docs/hubspot-workflows.md</span></p>
        </div>
      </section>
    </>
  );
}

function ArchitectureDiagram() {
  const box = (x: number, y: number, w: number, h: number, title: string, sub: string, tone: "navy" | "purple" | "gold" | "white") => {
    const fill = { navy: "#0b1230", purple: "#6d4aff", gold: "#f7efdd", white: "#ffffff" }[tone];
    const text = tone === "navy" || tone === "purple" ? "#ffffff" : "#0d1330";
    const subc = tone === "navy" || tone === "purple" ? "rgba(255,255,255,0.7)" : "#6b7190";
    return (
      <g>
        <rect x={x} y={y} width={w} height={h} rx={12} fill={fill} stroke={tone === "white" ? "#e4e6f0" : tone === "gold" ? "#e5d3a8" : "none"} />
        <text x={x + w / 2} y={y + h / 2 - 4} textAnchor="middle" fontSize="14" fontWeight="650" fill={text}>{title}</text>
        <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fontSize="11.5" fill={subc}>{sub}</text>
      </g>
    );
  };
  const arrow = (d: string, label?: string, lx?: number, ly?: number) => (
    <g>
      <path d={d} fill="none" stroke="#8f74ff" strokeWidth="1.6" markerEnd="url(#ah)" />
      {label && <text x={lx} y={ly} fontSize="11" fill="#6b7190" textAnchor="middle">{label}</text>}
    </g>
  );
  return (
    <svg viewBox="0 0 1100 420" width="100%" style={{ minWidth: 820 }} role="img" aria-label="SponsorMap AWS architecture">
      <defs>
        <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 10 5 0 10z" fill="#8f74ff" />
        </marker>
      </defs>
      {box(20, 170, 170, 70, "Web app", "Next.js · organizers & sponsors", "white")}
      {box(270, 170, 190, 70, "SponsorMap API", "Next.js route handlers", "navy")}
      {box(560, 40, 200, 70, "Amazon S3", "agreements · evidence (KMS)", "gold")}
      {box(560, 170, 200, 70, "Amazon Bedrock", "Claude · extraction & drafting", "purple")}
      {box(560, 300, 200, 70, "PostgreSQL (RDS)", "sponsorship records · audit", "gold")}
      {box(860, 110, 210, 70, "Lambda: reminders", "EventBridge hourly schedule", "navy")}
      {box(860, 240, 210, 70, "Lambda: report generator", "on demand + weekly digest", "navy")}
      {box(270, 320, 190, 60, "HubSpot", "contacts · deals · workflows", "white")}
      {arrow("M190 205 H266", "HTTPS", 228, 196)}
      {arrow("M460 190 C510 190 510 75 556 75", "pre-signed upload", 492, 120)}
      {arrow("M460 205 H556", "extract / classify", 508, 196)}
      {arrow("M460 220 C510 220 510 335 556 335", "SQL", 498, 290)}
      {arrow("M365 240 V316", "deal sync", 400, 285)}
      {arrow("M760 335 C810 335 810 145 856 145", "due & overdue", 830, 230)}
      {arrow("M760 335 C820 335 820 275 856 275")}
      {arrow("M856 290 C820 290 800 215 764 210", "narrative only", 815, 260)}
      {arrow("M960 240 V184")}
      <text x="20" y="30" fontSize="12" fill="#6b7190">Figures in reports always come from PostgreSQL rows — never from model output.</text>
    </svg>
  );
}

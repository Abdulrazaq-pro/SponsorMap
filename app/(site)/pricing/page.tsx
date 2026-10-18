import Link from "next/link";

export const metadata = { title: "Pricing — SponsorMap" };

const PLANS = [
  {
    name: "Starter",
    price: "$249",
    per: "per month, billed annually",
    for: "Single events and small partner rosters",
    features: ["Up to 15 active sponsors", "AI commitment extraction (40 agreements / yr)", "Commitment register & task board", "Evidence uploads (50 GB)", "Sponsor reports (PDF)"],
    cta: "Start with Starter",
  },
  {
    name: "Growth",
    price: "$790",
    per: "per month, billed annually",
    for: "Organizers running multiple events and campaigns",
    features: ["Up to 75 active sponsors", "Unlimited agreement extraction", "AI evidence review & gap detection", "Deadline reminders & alerts", "Sponsor performance intelligence", "HubSpot CRM sync"],
    cta: "Talk to sales",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    per: "annual agreement",
    for: "Leagues, associations and agencies with portfolios",
    features: ["Unlimited sponsors & properties", "Dedicated AWS region & data residency", "SSO, audit log & custom review policies", "Agency multi-property workspaces", "Implementation & reporting templates"],
    cta: "Contact us",
  },
];

export default function Pricing() {
  return (
    <>
      <section className="hero">
        <div className="container stack" style={{ padding: "72px 24px 56px", textAlign: "center", alignItems: "center" }}>
          <span className="eyebrow">Pricing</span>
          <h1 className="display" style={{ fontSize: "clamp(34px,5vw,56px)" }}>Priced by sponsor portfolio, not by seat.</h1>
          <p className="lead" style={{ margin: "0 auto" }}>Invite your whole delivery team — production, marketing, operations — at no extra cost.</p>
        </div>
      </section>
      <section className="section section-tint" style={{ paddingTop: 56 }}>
        <div className="container stack-lg">
          <div className="grid-3" style={{ alignItems: "stretch" }}>
            {PLANS.map((p) => (
              <div key={p.name} className={`price-card ${p.featured ? "featured" : ""}`}>
                {p.featured && <span className="badge b-purple plain" style={{ position: "absolute", top: -12, left: 30 }}>Most popular</span>}
                <div>
                  <h3 style={{ fontSize: 20 }}>{p.name}</h3>
                  <p className="muted small" style={{ marginTop: 4 }}>{p.for}</p>
                </div>
                <div>
                  <span className="display" style={{ fontSize: 42 }}>{p.price}</span>
                  <p className="tiny muted">{p.per}</p>
                </div>
                <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                <Link href="/request-demo" className={`btn ${p.featured ? "btn-primary" : "btn-ghost"}`} style={{ marginTop: "auto" }}>{p.cta}</Link>
              </div>
            ))}
          </div>
          <div className="card card-pad grid-3">
            <div><strong>Every plan includes</strong><p className="small muted">Human review workflow, recorded/estimate labelling, audit trail of reviewer decisions.</p></div>
            <div><strong>Your data stays yours</strong><p className="small muted">Agreements and evidence stored in Amazon S3 with encryption at rest; export any time.</p></div>
            <div><strong>Non-profit & association rates</strong><p className="small muted">Ask us about discounted pricing for community sports and member associations.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}

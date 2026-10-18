import Link from "next/link";
import { Icon } from "@/components/ui";

export const metadata = { title: "Use cases — SponsorMap" };

const ORGANIZER = [
  {
    who: "Event organizers",
    pain: "Benefits are scattered across contracts, run sheets and inboxes. Post-event reports take weeks.",
    how: ["Commitment register built straight from signed agreements", "Task board that maps every benefit to an owner and date", "Reports drafted from evidence already on file"],
  },
  {
    who: "Associations & conferences",
    pain: "Dozens of exhibitor and partner packages with small but numerous deliverables — logos, sessions, delegate passes.",
    how: ["Package templates for repeated benefit types", "Evidence requests sent to session and booth leads", "Member-partner reports in one consistent format"],
  },
  {
    who: "Sports clubs",
    pain: "Season-long inventory across matchdays: LED minutes, kit placements, hospitality, digital content.",
    how: ["Commitments tracked per fixture and per campaign", "Matchday photo uploads auto-sorted by placement", "Mid-season delivery checks before renewal talks"],
  },
  {
    who: "Sponsorship agencies",
    pain: "Managing rights across multiple properties for brand clients, each reporting differently.",
    how: ["Portfolio view across rights holders", "Recorded vs estimated metrics consistent across properties", "HubSpot pipeline linked to delivery status"],
  },
];

const SPONSOR = [
  { t: "Clause-level accountability", d: "See each promised benefit with its original contract wording, status and proof." },
  { t: "Numbers you can take to finance", d: "Recorded metrics link to their source export. Estimates are labelled and explained." },
  { t: "Honest gaps", d: "Outstanding obligations are listed, not buried — the basis for make-goods or renegotiation." },
];

export default function UseCases() {
  return (
    <>
      <section className="hero">
        <div className="container stack" style={{ padding: "72px 24px 64px", maxWidth: 880 }}>
          <span className="eyebrow">Use cases</span>
          <h1 className="display" style={{ fontSize: "clamp(34px,5vw,56px)" }}>Built for the people who deliver sponsorship — and the people who pay for it.</h1>
        </div>
      </section>

      <section className="section">
        <div className="container stack-lg">
          <div className="stack" style={{ maxWidth: 700 }}>
            <span className="eyebrow">For rights holders</span>
            <h2 className="display">Organizer use cases</h2>
          </div>
          <div className="grid-2">
            {ORGANIZER.map((u) => (
              <div key={u.who} className="feature-card stack">
                <h3 style={{ fontSize: 20 }}>{u.who}</h3>
                <p className="muted small"><strong style={{ color: "var(--ink-2)" }}>The problem: </strong>{u.pain}</p>
                <div className="stack" style={{ gap: 8 }}>
                  {u.how.map((h) => (
                    <div key={h} className="row small" style={{ alignItems: "flex-start" }}>
                      <span style={{ color: "var(--purple-500)" }}><Icon name="check" size={16} /></span>{h}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container stack-lg">
          <div className="stack" style={{ maxWidth: 700 }}>
            <span className="eyebrow">For brands</span>
            <h2 className="display">What sponsors get</h2>
            <p className="lead">Sponsors receive a report that ties every dollar of rights fee to the benefit it bought — and whether it was delivered.</p>
          </div>
          <div className="grid-3">
            {SPONSOR.map((s) => (
              <div key={s.t} className="feature-card">
                <div className="icon"><Icon name="award" /></div>
                <h3 style={{ fontSize: 17, marginBottom: 8 }}>{s.t}</h3>
                <p className="small">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="row wrap">
            <Link href="/demo" className="btn btn-gold">Try the demo</Link>
            <Link href="/request-demo" className="btn btn-ghost-dark">Request a demo</Link>
          </div>
        </div>
      </section>
    </>
  );
}

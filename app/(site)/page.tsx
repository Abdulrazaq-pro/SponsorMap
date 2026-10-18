import Link from "next/link";
import FulfilmentDemo from "@/components/FulfilmentDemo";
import { Icon } from "@/components/ui";

const FEATURES = [
  { icon: "sparkle", title: "Commitment extraction", body: "Upload a signed agreement. SponsorMap pulls every promised benefit — quantity, placement, deadline and reporting duty — and keeps the source clause beside it." },
  { icon: "kanban", title: "Fulfilment tracking", body: "Each confirmed commitment becomes an owned task with a due date. Your production, marketing and partnerships teams see exactly what they owe." },
  { icon: "camera", title: "Evidence review assistance", body: "Photos, documents and campaign records are categorized and suggested against commitments. A person confirms every link." },
  { icon: "chart", title: "Sponsorship reporting", body: "Reports connect each promised benefit to recorded proof and available metrics — and say plainly what's outstanding." },
  { icon: "award", title: "Sponsor performance intelligence", body: "A portfolio view of recorded reach, engagement, deliverables and open obligations across every sponsor and event." },
  { icon: "bell", title: "Outstanding commitment alerts", body: "Deadlines approaching without evidence, unreviewed clauses and unverified uploads surface before the sponsor asks." },
];

const PRINCIPLES = [
  { title: "Recorded or estimated — always labelled", body: "Every figure carries its provenance. Recorded metrics link to the export they came from. Estimates show their method in gold." },
  { title: "No invented numbers", body: "SponsorMap's AI never generates audience reach, impressions or engagement. If nothing was recorded, the report says so." },
  { title: "Human review on what matters", body: "Extracted commitments with quantities, deadlines or reporting duties can't be tracked or reported until a person confirms them." },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container" style={{ padding: "96px 24px 110px" }}>
          <div className="grid-2" style={{ alignItems: "center", gap: 56 }}>
            <div className="stack-lg">
              <span className="eyebrow">Sponsorship operations platform</span>
              <h1 className="display">Every promise to a sponsor, <em>delivered and proven.</em></h1>
              <p className="lead">
                SponsorMap turns sponsorship agreements into tracked commitments, assigned tasks and verified evidence — then
                builds sponsor-ready reports that separate what was recorded from what was estimated.
              </p>
              <div className="row wrap">
                <Link href="/demo" className="btn btn-gold">Try the interactive demo <Icon name="arrow" size={16} /></Link>
                <Link href="/request-demo" className="btn btn-ghost-dark">Request a demo</Link>
              </div>
              <div className="row wrap small" style={{ color: "rgba(255,255,255,0.6)", gap: 18 }}>
                <span className="row" style={{ gap: 6 }}><Icon name="shield" size={16} /> Human review built in</span>
                <span className="row" style={{ gap: 6 }}><Icon name="cloud" size={16} /> Runs on AWS</span>
                <span className="row" style={{ gap: 6 }}><Icon name="link" size={16} /> HubSpot-ready</span>
              </div>
            </div>
            <HeroPanel />
          </div>
        </div>
      </section>

      <section className="section" id="product">
        <div className="container stack-lg">
          <div className="stack" style={{ maxWidth: 760 }}>
            <span className="eyebrow">What SponsorMap does</span>
            <h2 className="display">From signed contract to sponsor report, without the spreadsheet chase.</h2>
            <p className="lead">Partnerships teams lose weeks reconciling what was promised against what was delivered. SponsorMap keeps that link from day one.</p>
          </div>
          <div className="grid-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="icon"><Icon name={f.icon} /></div>
                <h3 style={{ fontSize: 17, marginBottom: 8 }}>{f.title}</h3>
                <p className="muted small">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container stack-lg">
          <div className="row between wrap" style={{ alignItems: "flex-end" }}>
            <div className="stack" style={{ maxWidth: 700 }}>
              <span className="eyebrow">Interactive demonstration</span>
              <h2 className="display">Watch one agreement move through SponsorMap.</h2>
              <p className="lead">A fictional marathon sponsorship with eight clauses. Extract, review, assign, record — and see the clause that was never delivered.</p>
            </div>
            <Link href="/demo" className="btn btn-ghost">Open full-screen demo</Link>
          </div>
          <FulfilmentDemo compact />
        </div>
      </section>

      <section className="section section-dark">
        <div className="container stack-lg">
          <div className="stack" style={{ maxWidth: 720 }}>
            <span className="eyebrow">Reporting you can stand behind</span>
            <h2 className="display">Sponsors renew when they trust the numbers.</h2>
            <p className="lead">SponsorMap is designed around evidence integrity. The AI assists with reading and sorting; people confirm what counts.</p>
          </div>
          <div className="grid-3">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="feature-card">
                <div className="icon"><Icon name="shield" /></div>
                <h3 style={{ fontSize: 17, marginBottom: 8 }}>{p.title}</h3>
                <p className="small">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2" style={{ alignItems: "center", gap: 48 }}>
          <div className="stack-lg">
            <span className="eyebrow">Built for both sides of the partnership</span>
            <h2 className="display">For organizers who deliver. For sponsors who need to see it.</h2>
            <div className="stack">
              {[
                ["Event organizers", "One register of every obligation across events and campaigns."],
                ["Associations & conferences", "Exhibitor and member-partner benefits tracked to proof."],
                ["Sports clubs", "Season-long inventory — kit, LED, matchday, digital — reconciled per partner."],
                ["Sponsorship agencies", "Portfolio reporting across rights holders, in one consistent format."],
              ].map(([t, d]) => (
                <div key={t} className="row" style={{ alignItems: "flex-start" }}>
                  <span style={{ color: "var(--purple-500)", marginTop: 2 }}><Icon name="check" /></span>
                  <div><strong>{t}</strong><p className="muted small">{d}</p></div>
                </div>
              ))}
            </div>
            <div><Link href="/use-cases" className="btn btn-ghost">Explore use cases <Icon name="arrow" size={16} /></Link></div>
          </div>
          <div className="card card-pad stack" style={{ background: "linear-gradient(180deg,#fff,#faf9ff)" }}>
            <span className="eyebrow">Sample report excerpt · fictional</span>
            <div className="quote">“A.5 — 6 PA announcements: <strong>outstanding</strong>. No announcement log was recorded. We have not counted this benefit as delivered.”</div>
            <div className="divider" />
            <div className="row between small"><span>A.2 Instagram posts</span><span><strong>3 of 4</strong> evidenced</span></div>
            <div className="row between small"><span>Post reach, posts 1–3</span><span className="row" style={{ gap: 6 }}><strong>56,405</strong><span className="badge b-green">Recorded</span></span></div>
            <div className="row between small"><span>Expo booth visitors</span><span className="row" style={{ gap: 6 }}><strong>~600</strong><span className="badge b-gold">Estimate</span></span></div>
            <p className="tiny muted">Estimate method: staff hand tally across 3 sampled hours, scaled to 14 opening hours.</p>
          </div>
        </div>
      </section>

      <section className="section hero" style={{ padding: "84px 0" }}>
        <div className="container stack-lg" style={{ alignItems: "center", textAlign: "center" }}>
          <h2 className="display" style={{ fontSize: "clamp(30px,4vw,44px)" }}>See your own agreements in SponsorMap.</h2>
          <p className="lead" style={{ margin: "0 auto" }}>Bring one signed sponsorship agreement. We'll walk through extraction, fulfilment and reporting on it with your team.</p>
          <div className="row wrap" style={{ justifyContent: "center" }}>
            <Link href="/request-demo" className="btn btn-gold">Request a demo</Link>
            <Link href="/pricing" className="btn btn-ghost-dark">View pricing</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function HeroPanel() {
  const rows = [
    { c: "A.1", t: "Finish-line arch logo", s: "Evidenced", tone: "b-green", p: 100 },
    { c: "A.2", t: "4 Instagram posts", s: "3 of 4", tone: "b-amber", p: 75 },
    { c: "A.4", t: "20 staff race entries", s: "Evidenced", tone: "b-green", p: 100 },
    { c: "A.5", t: "6 PA announcements", s: "Unfulfilled", tone: "b-red", p: 0 },
    { c: "A.6", t: "5,000 sleeve-print shirts", s: "Evidenced", tone: "b-green", p: 100 },
  ];
  return (
    <div className="glass" style={{ padding: 22 }}>
      <div className="row between" style={{ marginBottom: 14 }}>
        <div>
          <div className="tiny" style={{ color: "rgba(255,255,255,0.55)" }}>Commitment register · fictional</div>
          <strong>Harbourline × Northshore Marathon</strong>
        </div>
        <span className="badge b-gold plain">Presenting</span>
      </div>
      <div className="stack" style={{ gap: 10 }}>
        {rows.map((r) => (
          <div key={r.c} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "10px 12px" }}>
            <div className="row between small">
              <span className="row"><span className="mono" style={{ color: "var(--gold-400)" }}>{r.c}</span>{r.t}</span>
              <span className={`badge ${r.tone}`}>{r.s}</span>
            </div>
            <div className={`progress ${r.p === 100 ? "green" : r.p ? "amber" : "red"}`} style={{ marginTop: 8, background: "rgba(255,255,255,0.1)" }}>
              <span style={{ width: `${Math.max(r.p, 3)}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="notice" style={{ marginTop: 14, background: "rgba(180,35,44,0.15)", borderColor: "rgba(180,35,44,0.35)", color: "rgba(255,255,255,0.85)" }}>
        <Icon name="alert" />
        <span className="small"><strong style={{ color: "white" }}>A.5 overdue.</strong> No PA log recorded for race day. Partnerships lead notified.</span>
      </div>
    </div>
  );
}

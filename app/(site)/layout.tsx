import Link from "next/link";
import { BrandMark } from "@/components/ui";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-nav">
        <div className="inner">
          <Link href="/" className="brand">
            <BrandMark /> SponsorMap
          </Link>
          <nav>
            <Link href="/#product">Product</Link>
            <Link href="/use-cases">Use cases</Link>
            <Link href="/demo">Live demo</Link>
            <Link href="/platform">Platform</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
          <div className="row" style={{ marginLeft: "auto" }}>
            <Link href="/app" className="btn btn-ghost-dark btn-sm">Open workspace</Link>
            <Link href="/request-demo" className="btn btn-gold btn-sm">Request a demo</Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="container">
          <div className="grid-4">
            <div className="stack">
              <div className="brand" style={{ color: "white" }}><BrandMark /> SponsorMap</div>
              <p className="small">Sponsorship operations and performance reporting for event organizers.</p>
            </div>
            <div className="stack small">
              <strong style={{ color: "white" }}>Product</strong>
              <Link href="/#product">Commitment extraction</Link>
              <Link href="/#product">Fulfilment tracking</Link>
              <Link href="/#product">Evidence review</Link>
              <Link href="/#product">Sponsor reporting</Link>
            </div>
            <div className="stack small">
              <strong style={{ color: "white" }}>Explore</strong>
              <Link href="/use-cases">Use cases</Link>
              <Link href="/demo">Interactive demo</Link>
              <Link href="/platform">Architecture</Link>
              <Link href="/pricing">Pricing</Link>
            </div>
            <div className="stack small">
              <strong style={{ color: "white" }}>Our reporting principles</strong>
              <span>We never generate reach, impressions or engagement figures.</span>
              <span>Estimates are always labelled with their method.</span>
              <span>Important commitments require human review.</span>
            </div>
          </div>
          <div className="divider" style={{ background: "rgba(255,255,255,0.08)", margin: "36px 0 18px" }} />
          <p className="tiny">© {new Date().getFullYear()} SponsorMap. Organizations and figures shown in demos are fictional.</p>
        </div>
      </footer>
    </>
  );
}

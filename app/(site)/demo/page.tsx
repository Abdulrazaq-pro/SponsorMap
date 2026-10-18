import FulfilmentDemo from "@/components/FulfilmentDemo";

export const metadata = { title: "Interactive demo — SponsorMap" };

export default function DemoPage() {
  return (
    <>
      <section className="hero">
        <div className="container stack" style={{ padding: "64px 24px 56px", maxWidth: 900 }}>
          <span className="eyebrow">Interactive demonstration</span>
          <h1 className="display" style={{ fontSize: "clamp(34px,5vw,56px)" }}>One agreement, start to finish.</h1>
          <p className="lead">
            Harbourline Credit Union and the Northshore Harbour Marathon are fictional. Walk through extracting their commitments,
            reviewing them, assigning owners, recording evidence — and finding the benefit that was never delivered.
          </p>
        </div>
      </section>
      <section className="section section-tint" style={{ paddingTop: 40 }}>
        <div className="container stack-lg">
          <FulfilmentDemo />
          <div className="notice">
            <span>
              <strong>About this demo.</strong> Extraction here runs SponsorMap's deterministic clause parser in your browser so you can
              try it without an account. In production, Amazon Bedrock reads the uploaded PDF, the parser cross-checks its output, and
              every important commitment waits for a person to confirm it. Metric values shown are sample data in a fictional export.
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

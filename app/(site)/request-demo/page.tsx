"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";

const ORG_TYPES = ["Event organizer", "Association / conference", "Sports club or league", "Sponsorship agency", "Brand / sponsor", "Other"];

export default function RequestDemo() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [result, setResult] = useState<{ crm: string } | null>(null);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/demo-request", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong");
      setResult(json);
      setState("sent");
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  }

  return (
    <section className="hero" style={{ minHeight: "calc(100vh - 60px)" }}>
      <div className="container grid-2" style={{ padding: "72px 24px", gap: 56, alignItems: "flex-start" }}>
        <div className="stack-lg">
          <span className="eyebrow">Request a demo</span>
          <h1 className="display" style={{ fontSize: "clamp(34px,5vw,54px)" }}>Bring one agreement. Leave with a fulfilment plan.</h1>
          <p className="lead">In 30 minutes we'll extract the commitments from one of your sponsorship agreements, show the task board and evidence flow, and walk through a sponsor report.</p>
          <div className="stack" style={{ color: "rgba(255,255,255,0.8)" }}>
            {["Commitment extraction on your own contract", "How human review and evidence verification work", "HubSpot pipeline integration for your partnerships team"].map((t) => (
              <div key={t} className="row"><span style={{ color: "var(--gold-400)" }}><Icon name="check" /></span>{t}</div>
            ))}
          </div>
        </div>

        <div className="card card-pad" style={{ color: "var(--ink)" }}>
          {state === "sent" ? (
            <div className="stack" style={{ padding: "24px 0" }}>
              <span style={{ color: "var(--green)" }}><Icon name="check" size={32} /></span>
              <h3 style={{ fontSize: 22 }}>Thanks — we'll be in touch within one business day.</h3>
              <p className="muted small">{result?.crm === "hubspot" ? "Your request was added to our CRM." : "Your request was received."}</p>
              <Link href="/demo" className="btn btn-ghost" style={{ alignSelf: "flex-start" }}>Explore the demo meanwhile</Link>
            </div>
          ) : (
            <form className="stack" onSubmit={submit}>
              <div className="grid-2" style={{ gap: 12 }}>
                <div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" className="input" required /></div>
                <div className="field"><label htmlFor="email">Work email</label><input id="email" name="email" type="email" className="input" required /></div>
              </div>
              <div className="field"><label htmlFor="organization">Organization</label><input id="organization" name="organization" className="input" required /></div>
              <div className="grid-2" style={{ gap: 12 }}>
                <div className="field">
                  <label htmlFor="orgType">Organization type</label>
                  <select id="orgType" name="orgType" className="select" required defaultValue="">
                    <option value="" disabled>Select…</option>
                    {ORG_TYPES.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="sponsorsPerYear">Active sponsors per year</label>
                  <select id="sponsorsPerYear" name="sponsorsPerYear" className="select" required defaultValue="">
                    <option value="" disabled>Select…</option>
                    {["1–10", "11–30", "31–75", "76–200", "200+"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="field"><label htmlFor="message">What would you like to see? <span className="muted">(optional)</span></label><textarea id="message" name="message" className="input" rows={4} /></div>
              {state === "error" && <div className="notice red small">{error}</div>}
              <button className="btn btn-primary" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Request my demo"}</button>
              <p className="tiny muted">We use your details only to arrange the demo. No marketing lists.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

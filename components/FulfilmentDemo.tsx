"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DEMO_AGREEMENT_TEXT } from "@/lib/demo-agreement";
import { extractCommitmentsByRules, type ExtractedCommitment } from "@/lib/extract-rules";
import { fmtDate, fmtNum } from "@/lib/fulfilment";
import { ConfidenceBadge, Icon, Progress } from "./ui";

/**
 * Self-contained walkthrough of the SponsorMap workflow on a fictional
 * agreement: extract → human review → assign → evidence → gap report.
 * Runs entirely in the browser using the rule-based extractor.
 */

type Step = 0 | 1 | 2 | 3 | 4;
const STEPS = ["Agreement", "Extract & review", "Assign tasks", "Record evidence", "Gaps & report"];

const TEAM = ["Marcus O. · Production", "Tom A. · Marketing", "Lena K. · Partnerships", "Priya N. · Event ops"];
const DEFAULT_OWNER: Record<string, number> = {
  Signage: 0, "Digital & Social": 1, Activation: 2, Hospitality: 2, "Broadcast & PA": 3, Merchandise: 0, Reporting: 2, Other: 2,
};

interface DemoEvidence {
  clause: string;
  file: string;
  aiKind: string;
  aiNote: string;
  qty: number;
  verified: boolean;
}

const EVIDENCE_LIBRARY: DemoEvidence[] = [
  { clause: "A.1", file: "finish-arch-raceday.jpg", aiKind: "Photograph", aiNote: "Image of an arch with a logo panel. Suggested link: A.1 signage.", qty: 1, verified: false },
  { clause: "A.2", file: "ig-post-1.png", aiKind: "Campaign record", aiNote: "Screenshot of a social post. Suggested link: A.2.", qty: 1, verified: false },
  { clause: "A.2", file: "ig-post-2.png", aiKind: "Campaign record", aiNote: "Screenshot of a social post. Suggested link: A.2.", qty: 1, verified: false },
  { clause: "A.2", file: "ig-post-3.png", aiKind: "Campaign record", aiNote: "Screenshot of a social post. Suggested link: A.2.", qty: 1, verified: false },
  { clause: "A.2", file: "instagram-insights-export.csv", aiKind: "Metrics export", aiNote: "Platform export with reach and engagement columns for 3 posts. Figures are read from the file, not generated.", qty: 0, verified: false },
  { clause: "A.3", file: "expo-booth.jpg", aiKind: "Photograph", aiNote: "Image of an exhibitor booth. Suggested link: A.3.", qty: 1, verified: false },
  { clause: "A.4", file: "entry-codes-issued.xlsx", aiKind: "Document", aiNote: "Spreadsheet listing 20 registration codes. Suggested link: A.4.", qty: 20, verified: false },
  { clause: "A.6", file: "shirt-delivery-note.pdf", aiKind: "Document", aiNote: "Supplier delivery note referencing 5,000 printed shirts. Suggested link: A.6.", qty: 5000, verified: false },
];

const RECORDED = [
  { label: "Post 1 reach", value: 18420, unit: "accounts" },
  { label: "Post 2 reach", value: 22105, unit: "accounts" },
  { label: "Post 3 reach", value: 15880, unit: "accounts" },
];

export default function FulfilmentDemo({ compact = false }: { compact?: boolean }) {
  const [step, setStep] = useState<Step>(0);
  const [extracted, setExtracted] = useState<ExtractedCommitment[]>([]);
  const [revealed, setRevealed] = useState(0);
  const [confirmed, setConfirmed] = useState<Record<string, "confirmed" | "rejected">>({});
  const [owners, setOwners] = useState<Record<string, number>>({});
  const [evidence, setEvidence] = useState<DemoEvidence[]>([]);

  const all = useMemo(() => extractCommitmentsByRules(DEMO_AGREEMENT_TEXT), []);

  useEffect(() => {
    if (step !== 1 || revealed >= all.length) return;
    const t = setTimeout(() => {
      setExtracted(all.slice(0, revealed + 1));
      setRevealed((r) => r + 1);
    }, 380);
    return () => clearTimeout(t);
  }, [step, revealed, all]);

  const active = extracted.filter((c) => confirmed[c.clause] === "confirmed");
  const pendingCritical = extracted.filter((c) => c.critical && !confirmed[c.clause]);
  const extractionDone = revealed >= all.length;
  const litClause = step === 1 && !extractionDone ? all[revealed]?.clause : null;

  function addAllEvidence() {
    setEvidence(EVIDENCE_LIBRARY.map((e) => ({ ...e })));
  }

  function evidencedQty(clause: string) {
    return evidence.filter((e) => e.clause === clause).reduce((s, e) => s + e.qty, 0);
  }

  const agreementLines = DEMO_AGREEMENT_TEXT.split("\n");
  const deliverables = active.filter((c) => c.category !== "Reporting");
  const unfulfilled = deliverables.filter((c) => evidencedQty(c.clause) === 0);
  const partial = deliverables.filter((c) => {
    const got = evidencedQty(c.clause);
    return got > 0 && got < (c.quantity ?? 1);
  });

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div className="card-head" style={{ flexWrap: "wrap" }}>
        <div className="stepper">
          {STEPS.map((label, i) => (
            <button
              key={label}
              className={`step-pill ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
              onClick={() => i <= step && setStep(i as Step)}
              disabled={i > step}
            >
              <span className="n">{i < step ? "✓" : i + 1}</span>
              {label}
            </button>
          ))}
        </div>
        <span className="badge b-gold plain">Fictional agreement · demo data</span>
      </div>

      <div className="card-pad" style={{ display: "grid", gridTemplateColumns: step <= 1 ? "minmax(0,1fr) minmax(0,1.1fr)" : "1fr", gap: 22 }}>
        {step <= 1 && (
          <div className="stack">
            <div className="row between">
              <div className="row small"><Icon name="file" size={16} /> <strong>harbourline-marathon-2026-signed.pdf</strong></div>
              <span className="muted tiny">8 clauses · 2 schedules</span>
            </div>
            <div className="agreement-doc" style={{ maxHeight: compact ? 420 : 520 }}>
              {agreementLines.map((line, i) => {
                const clause = line.match(/^([A-Z]\.\d+)\s/)?.[1];
                const lit = clause && (clause === litClause || (step === 1 && extractionDone && confirmed[clause] === "confirmed"));
                return (
                  <span key={i} className={clause ? `clause ${lit ? "lit" : ""}` : undefined}>
                    {line || " "}
                    {"\n"}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {step === 0 && (
          <div className="stack" style={{ justifyContent: "center" }}>
            <span className="eyebrow">Step 1</span>
            <h3 className="display" style={{ fontSize: 28 }}>A signed agreement, full of promises.</h3>
            <p className="muted">
              Harbourline Credit Union is presenting partner of the Northshore Harbour Marathon. The agreement promises signage,
              social posts, an expo booth, staff entries, PA announcements, branded shirts and a post-event report — each with
              its own quantity and deadline.
            </p>
            <div className="notice">
              <Icon name="sparkle" />
              <span>SponsorMap reads each clause and pulls out <strong>what was promised, how many, where, by when, and what must be reported</strong> — keeping the original wording beside every item.</span>
            </div>
            <div><button className="btn btn-primary" onClick={() => setStep(1)}>Extract commitments <Icon name="arrow" size={16} /></button></div>
          </div>
        )}

        {step === 1 && (
          <div className="stack">
            <div className="row between">
              <strong>{extractionDone ? `${extracted.length} commitments extracted` : `Reading clause ${all[revealed]?.clause ?? ""}…`}</strong>
              {extractionDone && (
                <button className="btn btn-ghost btn-sm" onClick={() => setConfirmed(Object.fromEntries(extracted.map((c) => [c.clause, "confirmed" as const])))}>
                  I've checked all against the text — confirm all
                </button>
              )}
            </div>
            <div className="stack" style={{ maxHeight: compact ? 420 : 520, overflow: "auto", paddingRight: 4 }}>
              {extracted.map((c) => (
                <div key={c.clause} className="fade-up" style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 12 }}>
                  <div className="row between" style={{ alignItems: "flex-start" }}>
                    <div className="grow">
                      <div className="row wrap" style={{ gap: 6 }}>
                        <span className="mono" style={{ color: "var(--purple-600)", fontWeight: 700 }}>{c.clause}</span>
                        <strong className="small">{c.benefit.split(":")[0]}</strong>
                        <span className="badge plain b-grey">{c.category}</span>
                        {c.critical && <span className="badge plain b-gold">Important</span>}
                      </div>
                      <div className="row wrap small muted" style={{ gap: 14, marginTop: 6 }}>
                        <span>Qty: <strong style={{ color: "var(--ink)" }}>{c.quantity !== null ? `${fmtNum(c.quantity)} ${c.unit ?? ""}` : "not stated"}</strong></span>
                        <span>Due: <strong style={{ color: "var(--ink)" }}>{c.deadline ? fmtDate(c.deadline) : "not stated"}</strong></span>
                        {c.placement && <span>Placement: <strong style={{ color: "var(--ink)" }}>{c.placement}</strong></span>}
                      </div>
                      {c.reportingRequirement && c.category !== "Reporting" && (
                        <div className="tiny" style={{ marginTop: 4, color: "var(--purple-600)" }}>↳ {c.reportingRequirement}</div>
                      )}
                    </div>
                    <ConfidenceBadge level={c.confidence} />
                  </div>
                  <div className="row" style={{ marginTop: 10, gap: 6 }}>
                    {confirmed[c.clause] === "confirmed" ? (
                      <span className="badge b-green">Confirmed by you</span>
                    ) : confirmed[c.clause] === "rejected" ? (
                      <span className="badge b-outline">Rejected — excluded from tracking</span>
                    ) : (
                      <>
                        <span className="badge b-amber">Needs human review</span>
                        <button className="btn btn-success btn-sm" onClick={() => setConfirmed((s) => ({ ...s, [c.clause]: "confirmed" }))}>Confirm</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setConfirmed((s) => ({ ...s, [c.clause]: "rejected" }))}>Reject</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {extractionDone && (
              <div className="row between wrap">
                <span className="small muted">
                  {pendingCritical.length > 0
                    ? `${pendingCritical.length} important commitment${pendingCritical.length > 1 ? "s" : ""} still need your review.`
                    : "All important commitments reviewed."}
                </span>
                <button className="btn btn-primary" disabled={pendingCritical.length > 0 || active.length === 0} onClick={() => {
                  setOwners(Object.fromEntries(active.map((c) => [c.clause, DEFAULT_OWNER[c.category] ?? 2])));
                  setStep(2);
                }}>
                  Create fulfilment tasks <Icon name="arrow" size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="stack">
            <div className="row between wrap">
              <div>
                <span className="eyebrow">Step 3</span>
                <h3 style={{ fontSize: 20, marginTop: 4 }}>Every confirmed commitment becomes an owned task</h3>
              </div>
              <button className="btn btn-primary" onClick={() => setStep(3)}>Assign & continue <Icon name="arrow" size={16} /></button>
            </div>
            <div className="table-wrap">
              <table className="t">
                <thead><tr><th>Clause</th><th>Task</th><th>Owner</th><th>Due</th></tr></thead>
                <tbody>
                  {active.map((c) => (
                    <tr key={c.clause}>
                      <td className="mono">{c.clause}</td>
                      <td>{taskTitle(c)}</td>
                      <td>
                        <select className="select" style={{ padding: "6px 8px" }} value={owners[c.clause]} onChange={(e) => setOwners((o) => ({ ...o, [c.clause]: Number(e.target.value) }))}>
                          {TEAM.map((t, i) => <option key={t} value={i}>{t}</option>)}
                        </select>
                      </td>
                      <td className="tnum">{fmtDate(c.deadline)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="tiny muted">Owners are suggested from the commitment category; you can reassign any task. Reminders are sent by AWS Lambda as deadlines approach.</p>
          </div>
        )}

        {step === 3 && (
          <div className="stack">
            <div className="row between wrap">
              <div>
                <span className="eyebrow">Step 4</span>
                <h3 style={{ fontSize: 20, marginTop: 4 }}>Your team uploads proof as they deliver</h3>
              </div>
              <div className="row">
                {evidence.length === 0 && <button className="btn btn-ghost" onClick={addAllEvidence}><Icon name="upload" size={16} /> Simulate team uploads</button>}
                <button className="btn btn-primary" disabled={evidence.length === 0} onClick={() => setStep(4)}>Check for gaps <Icon name="arrow" size={16} /></button>
              </div>
            </div>
            {evidence.length === 0 ? (
              <div className="dropzone" onClick={addAllEvidence}>
                <Icon name="upload" size={26} />
                <p style={{ marginTop: 8 }}><strong>Simulate the uploads your team made during the event</strong></p>
                <p className="small muted">Photographs, campaign screenshots, supplier documents and a platform metrics export.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="t">
                  <thead><tr><th>File</th><th>AI categorization (suggestion)</th><th>Linked to</th><th>Units</th><th>Human check</th></tr></thead>
                  <tbody>
                    {evidence.map((e, i) => (
                      <tr key={e.file} className="fade-up">
                        <td className="mono">{e.file}</td>
                        <td><span className="badge plain b-purple">{e.aiKind}</span><div className="tiny muted" style={{ marginTop: 4, maxWidth: 340 }}>{e.aiNote}</div></td>
                        <td className="mono">{e.clause}</td>
                        <td className="tnum">{e.qty ? fmtNum(e.qty) : "—"}</td>
                        <td>
                          {e.verified ? <span className="badge b-green">Verified</span> : (
                            <button className="btn btn-ghost btn-sm" onClick={() => setEvidence((ev) => ev.map((x, j) => (j === i ? { ...x, verified: true } : x)))}>Mark verified</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="notice gold">
              <Icon name="eye" />
              <span>Notice what's <strong>not</strong> here: nothing for clause A.5 (PA announcements), and only three of four Instagram posts. SponsorMap doesn't fill gaps with guesses — it reports them.</span>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="stack-lg">
            <div>
              <span className="eyebrow">Step 5</span>
              <h3 style={{ fontSize: 20, marginTop: 4 }}>Fulfilment status, clause by clause</h3>
            </div>
            <div className="stack">
              {active.map((c) => {
                const target = c.quantity ?? 1;
                const got = evidencedQty(c.clause);
                const isReport = c.category === "Reporting";
                const unverified = evidence.filter((e) => e.clause === c.clause && !e.verified && e.qty > 0).length;
                const tone = got >= target ? "green" : got > 0 ? "amber" : "red";
                return (
                  <div key={c.clause} className="row" style={{ gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                    <span className="mono" style={{ width: 34, fontWeight: 700 }}>{c.clause}</span>
                    <span style={{ width: 220 }} className="small"><strong>{c.benefit.split(":")[0]}</strong></span>
                    <div className="grow" style={{ minWidth: 140 }}>
                      {isReport ? <span className="small muted">{c.clause === "B.1" ? "Draft generated from records below — due " + fmtDate(c.deadline) : "Applied to every figure in the report"}</span> : <Progress value={got} max={target} tone={tone} />}
                    </div>
                    {!isReport && <span className="small tnum" style={{ width: 120 }}>{fmtNum(got)} / {fmtNum(target)} evidenced</span>}
                    {!isReport && (got >= target
                      ? <span className={`badge ${unverified ? "b-blue" : "b-green"}`}>{unverified ? "Evidenced · verify" : "Evidenced"}</span>
                      : got > 0 ? <span className="badge b-amber">Partial</span> : <span className="badge b-red">Unfulfilled</span>)}
                  </div>
                );
              })}
            </div>

            {unfulfilled.length + partial.length > 0 ? (
              <div className="notice red">
                <Icon name="alert" />
                <div>
                  {unfulfilled.length > 0 && (
                    <>
                      <strong>Unfulfilled: {unfulfilled.map((c) => `${c.clause} — ${c.benefit.split(":")[0]}`).join("; ")}.</strong> No evidence was uploaded.
                      SponsorMap flags this to the partnerships lead and lists it as outstanding in the sponsor report rather than implying it happened.
                    </>
                  )}
                  {partial.length > 0 && (
                    <div className={unfulfilled.length ? "small" : undefined} style={{ marginTop: unfulfilled.length ? 4 : 0 }}>
                      {unfulfilled.length ? "Also outstanding: " : "Outstanding: "}
                      {partial.map((c) => `${c.clause} has evidence for ${fmtNum(evidencedQty(c.clause))} of ${fmtNum(c.quantity ?? 1)}${c.unit ? ` ${c.unit}` : ""}`).join("; ")}.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="notice">
                <Icon name="check" />
                <span>Every confirmed deliverable has evidence on file.</span>
              </div>
            )}

            <div className="grid-2">
              <div className="card card-pad">
                <div className="row between"><strong>Recorded metrics</strong><span className="badge b-green">Recorded</span></div>
                <p className="tiny muted" style={{ marginTop: 4 }}>Read from instagram-insights-export.csv. Sample figures for this fictional demo.</p>
                <div className="stack" style={{ marginTop: 12, gap: 8 }}>
                  {RECORDED.map((m) => (
                    <div key={m.label} className="row between small"><span>{m.label}</span><strong className="tnum">{fmtNum(m.value)} {m.unit}</strong></div>
                  ))}
                  <div className="row between small"><span>Post 4 reach</span><span className="muted">Not recorded — post not evidenced</span></div>
                </div>
              </div>
              <div className="card card-pad">
                <div className="row between"><strong>What we won't show</strong><span className="badge b-grey plain">Not recorded</span></div>
                <div className="stack small" style={{ marginTop: 12, gap: 8 }}>
                  <span>Finish-arch impressions — no measurement source was uploaded.</span>
                  <span>Spectator audience for PA — no count exists.</span>
                  <span>If your team adds an estimate, it appears with a gold <span className="badge b-gold">Estimate</span> label and its method, never as a recorded figure.</span>
                </div>
              </div>
            </div>

            <div className="row wrap">
              <Link href="/app/reports/ag-harbourline" className="btn btn-primary">See the full sponsor report <Icon name="arrow" size={16} /></Link>
              <Link href="/request-demo" className="btn btn-ghost">Talk to us about your sponsors</Link>
              <button className="btn btn-ghost" onClick={() => { setStep(0); setExtracted([]); setRevealed(0); setConfirmed({}); setEvidence([]); }}>Restart demo</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function taskTitle(c: ExtractedCommitment) {
  const qty = c.quantity !== null ? `${fmtNum(c.quantity)} ${c.unit ?? ""}`.trim() : "";
  switch (c.category) {
    case "Signage": return `Install and photograph ${qty}${c.placement ? ` — ${c.placement}` : ""}`;
    case "Digital & Social": return `Publish and screenshot ${qty}`;
    case "Activation": return `Deliver and photograph ${qty}`;
    case "Hospitality": return `Issue ${qty} and export confirmation`;
    case "Broadcast & PA": return `Script, deliver and log ${qty}`;
    case "Merchandise": return `Produce ${qty}; keep supplier delivery note`;
    case "Reporting": return c.clause === "B.1" ? "Compile sponsor report from recorded evidence" : "Label every estimate and its method";
    default: return c.benefit;
  }
}

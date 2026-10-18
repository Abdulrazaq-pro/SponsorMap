import { allStates, fmtNum, shortBenefit, type CommitmentState } from "./fulfilment";
import type { Metric, Sponsor, Store } from "./types";

/**
 * Sponsor performance intelligence, computed only from stored records.
 * Sums only add metrics with the same provenance and unit; estimates are
 * never folded into recorded totals.
 */
export interface SponsorIntel {
  sponsor: Sponsor;
  states: CommitmentState[];
  confirmed: number;
  awaitingReview: number;
  fulfilled: number;
  outstanding: CommitmentState[];
  overdue: number;
  recordedReach: number | null;
  recordedEngagement: number | null;
  estimates: Metric[];
  recorded: Metric[];
  value: number;
  summary: string[];
}

export function sponsorIntel(store: Store, sponsorId: string): SponsorIntel {
  const sponsor = store.sponsors.find((s) => s.id === sponsorId)!;
  const states = allStates(store, (c) => c.sponsorId === sponsorId);
  const tracked = states.filter((s) => s.commitment.reviewStatus === "confirmed" && s.commitment.category !== "Reporting" || s.commitment.reviewStatus === "confirmed" && s.commitment.quantity !== null);
  const confirmed = states.filter((s) => s.commitment.reviewStatus === "confirmed").length;
  const awaitingReview = states.filter((s) => s.status === "awaiting_review").length;
  const fulfilled = tracked.filter((s) => s.status === "fulfilled").length;
  const outstanding = tracked.filter((s) => s.status !== "fulfilled" && s.status !== "excluded");
  const overdue = states.filter((s) => s.status === "overdue").length;
  const metrics = states.flatMap((s) => s.metrics);
  const recorded = metrics.filter((m) => m.provenance === "recorded");
  const estimates = metrics.filter((m) => m.provenance === "estimate");
  const reachRows = recorded.filter((m) => /reach/i.test(m.label));
  const engRows = recorded.filter((m) => /engage/i.test(m.label));
  const value = store.agreements.filter((a) => a.sponsorId === sponsorId).reduce((s, a) => s + a.value, 0);

  const summary: string[] = [];
  if (tracked.length) summary.push(`${fulfilled} of ${tracked.length} tracked deliverables are fully evidenced.`);
  if (overdue) summary.push(`${overdue} commitment${overdue > 1 ? "s are" : " is"} past deadline without sufficient evidence: ${states.filter((s) => s.status === "overdue").map((s) => `${s.commitment.clause} ${shortBenefit(s.commitment)}`).join(", ")}.`);
  const partial = outstanding.filter((s) => s.status === "partially_evidenced");
  if (partial.length) summary.push(`Partially evidenced: ${partial.map((s) => `${s.commitment.clause} (${s.evidencedQty} of ${s.commitment.quantity ?? 1})`).join(", ")}.`);
  if (reachRows.length) summary.push(`Recorded reach across ${reachRows.length} measured item${reachRows.length > 1 ? "s" : ""}: ${fmtNum(sum(reachRows))} (sum of per-item platform reach; not de-duplicated).`);
  else if (confirmed) summary.push("No reach figures have been recorded for this sponsor.");
  if (engRows.length) summary.push(`Recorded engagements: ${fmtNum(sum(engRows))}.`);
  if (estimates.length) summary.push(`${estimates.length} estimate${estimates.length > 1 ? "s" : ""} on file, shown separately with method.`);
  if (awaitingReview) summary.push(`${awaitingReview} extracted commitment${awaitingReview > 1 ? "s" : ""} awaiting human review — not yet tracked.`);

  return {
    sponsor, states, confirmed, awaitingReview, fulfilled, outstanding, overdue,
    recordedReach: reachRows.length ? sum(reachRows) : null,
    recordedEngagement: engRows.length ? sum(engRows) : null,
    estimates, recorded, value, summary,
  };
}

function sum(ms: Metric[]) {
  return ms.reduce((s, m) => s + m.value, 0);
}

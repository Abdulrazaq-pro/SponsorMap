import { DEMO_AGREEMENT_TEXT, SECOND_AGREEMENT_TEXT, THIRD_AGREEMENT_TEXT } from "./demo-agreement";
import { extractCommitmentsByRules } from "./extract-rules";
import type { Commitment, Evidence, Metric, Store, Task } from "./types";

/** Fictional demo workspace for "Meridian Events Co." Every name and figure is invented. */

function commitmentsFor(
  text: string,
  agreementId: string,
  sponsorId: string,
  eventId: string,
  review: Commitment["reviewStatus"],
): Commitment[] {
  return extractCommitmentsByRules(text).map((c) => ({
    ...c,
    id: `${agreementId}-${c.clause}`,
    agreementId,
    sponsorId,
    eventId,
    reviewStatus: review,
    ...(review === "confirmed" ? { reviewedBy: "Lena K.", reviewedAt: "2026-07-14" } : {}),
  }));
}

const H = "ag-harbourline";
const C = "ag-copperleaf";
const F = "ag-fernvale";

const tasks: Task[] = [
  { id: "t1", commitmentId: `${H}-A.1`, title: "Install sponsor logo panel on finish arch", assignee: "Marcus O.", dueDate: "2026-09-19", status: "done" },
  { id: "t2", commitmentId: `${H}-A.2`, title: "Publish 4 sponsor posts on event Instagram", assignee: "Tom A.", dueDate: "2026-09-20", status: "done" },
  { id: "t3", commitmentId: `${H}-A.3`, title: "Allocate and build expo booth, entrance zone", assignee: "Lena K.", dueDate: "2026-09-17", status: "done" },
  { id: "t4", commitmentId: `${H}-A.4`, title: "Issue 20 staff entry codes", assignee: "Lena K.", dueDate: "2026-08-15", status: "done" },
  { id: "t5", commitmentId: `${H}-A.5`, title: "Script and log 6 PA sponsor announcements", assignee: "Priya N.", dueDate: "2026-09-20", status: "todo" },
  { id: "t6", commitmentId: `${H}-A.6`, title: "Approve sleeve artwork and confirm shirt delivery", assignee: "Marcus O.", dueDate: "2026-09-01", status: "done" },
  { id: "t7", commitmentId: `${H}-B.1`, title: "Compile post-event report for Harbourline", assignee: "Lena K.", dueDate: "2026-10-20", status: "in_progress" },
  { id: "t8", commitmentId: `${F}-A.1`, title: "Order 2 stage backdrop banners", assignee: "Marcus O.", dueDate: "2026-11-21", status: "todo" },
  { id: "t9", commitmentId: `${F}-A.2`, title: "Schedule 5 Fernvale posts", assignee: "Tom A.", dueDate: "2026-11-28", status: "in_progress" },
  { id: "t10", commitmentId: `${F}-A.3`, title: "Send 10 VIP ticket allocations", assignee: "Lena K.", dueDate: "2026-11-07", status: "blocked" },
  { id: "t11", commitmentId: `${F}-A.4`, title: "Prepare Fernvale post-event report", assignee: "Lena K.", dueDate: "2026-12-28", status: "todo" },
];

const evidence: Evidence[] = [
  { id: "ev1", commitmentId: `${H}-A.1`, fileName: "finish-arch-raceday-0712.jpg", kind: "Photograph", uploadedBy: "Marcus O.", uploadedAt: "2026-09-20", description: "Finish arch with Harbourline logo panel, race morning.", quantityEvidenced: 1, verified: true },
  { id: "ev2", commitmentId: `${H}-A.2`, fileName: "ig-post-1-2026-08-04.png", kind: "Campaign record", uploadedBy: "Tom A.", uploadedAt: "2026-08-04", description: "Screenshot of sponsor post 1 (live).", quantityEvidenced: 1, verified: true },
  { id: "ev3", commitmentId: `${H}-A.2`, fileName: "ig-post-2-2026-08-22.png", kind: "Campaign record", uploadedBy: "Tom A.", uploadedAt: "2026-08-22", description: "Screenshot of sponsor post 2 (live).", quantityEvidenced: 1, verified: true },
  { id: "ev4", commitmentId: `${H}-A.2`, fileName: "ig-post-3-2026-09-12.png", kind: "Campaign record", uploadedBy: "Tom A.", uploadedAt: "2026-09-12", description: "Screenshot of sponsor post 3 (live).", quantityEvidenced: 1, verified: false },
  { id: "ev5", commitmentId: `${H}-A.2`, fileName: "instagram-insights-export-2026-09-25.csv", kind: "Metrics export", uploadedBy: "Tom A.", uploadedAt: "2026-09-25", description: "Platform insights export covering posts 1–3.", quantityEvidenced: 0, verified: true },
  { id: "ev6", commitmentId: `${H}-A.3`, fileName: "expo-booth-entrance-zone.jpg", kind: "Photograph", uploadedBy: "Lena K.", uploadedAt: "2026-09-18", description: "Harbourline booth in main hall entrance zone.", quantityEvidenced: 1, verified: true },
  { id: "ev7", commitmentId: `${H}-A.4`, fileName: "entry-codes-issued-harbourline.xlsx", kind: "Document", uploadedBy: "Lena K.", uploadedAt: "2026-08-12", description: "Registration system export: 20 codes issued to Harbourline staff.", quantityEvidenced: 20, verified: true },
  { id: "ev8", commitmentId: `${H}-A.6`, fileName: "shirt-supplier-delivery-note.pdf", kind: "Document", uploadedBy: "Marcus O.", uploadedAt: "2026-08-29", description: "Supplier delivery note: 5,000 shirts, sleeve print.", quantityEvidenced: 5000, verified: true },
  { id: "ev9", commitmentId: `${H}-A.6`, fileName: "shirt-sleeve-closeup.jpg", kind: "Photograph", uploadedBy: "Marcus O.", uploadedAt: "2026-08-30", description: "Close-up of printed sleeve logo.", quantityEvidenced: 0, verified: true },
  { id: "ev10", commitmentId: null, fileName: "start-line-wide-0645.jpg", kind: "Photograph", uploadedBy: "Priya N.", uploadedAt: "2026-09-20", description: "Wide shot of start line before gun.", quantityEvidenced: 0, verified: false, aiSuggestion: "Unlinked photograph from race day. It may relate to A.1 (signage) or A.5 (PA at start area), but a photo can't show an announcement was made — a person must link it." },
  { id: "ev11", commitmentId: `${F}-A.2`, fileName: "fernvale-post-1.png", kind: "Campaign record", uploadedBy: "Tom A.", uploadedAt: "2026-10-03", description: "Fernvale post 1 (live).", quantityEvidenced: 1, verified: true },
  { id: "ev12", commitmentId: `${F}-A.2`, fileName: "fernvale-post-2.png", kind: "Campaign record", uploadedBy: "Tom A.", uploadedAt: "2026-10-15", description: "Fernvale post 2 (live).", quantityEvidenced: 1, verified: false },
];

const metrics: Metric[] = [
  { id: "m1", commitmentId: `${H}-A.2`, label: "Post 1 reach", value: 18420, unit: "accounts", provenance: "recorded", source: "Instagram Insights export", evidenceId: "ev5" },
  { id: "m2", commitmentId: `${H}-A.2`, label: "Post 2 reach", value: 22105, unit: "accounts", provenance: "recorded", source: "Instagram Insights export", evidenceId: "ev5" },
  { id: "m3", commitmentId: `${H}-A.2`, label: "Post 3 reach", value: 15880, unit: "accounts", provenance: "recorded", source: "Instagram Insights export", evidenceId: "ev5" },
  { id: "m4", commitmentId: `${H}-A.2`, label: "Engagements, posts 1–3", value: 3753, unit: "interactions", provenance: "recorded", source: "Instagram Insights export", evidenceId: "ev5" },
  { id: "m5", commitmentId: `${H}-A.4`, label: "Entry codes redeemed", value: 17, unit: "entries", provenance: "recorded", source: "Registration system export", evidenceId: "ev7" },
  { id: "m6", commitmentId: `${H}-A.3`, label: "Booth visitors", value: 600, unit: "visitors", provenance: "estimate", source: "Staff hand tally", method: "Staff tallied visitors during 3 sampled hours and scaled to 14 opening hours. Not a recorded count." },
];

export function seedStore(): Store {
  return {
    sponsors: [
      { id: "s-harbourline", name: "Harbourline Credit Union", industry: "Financial services", tier: "Presenting", contactName: "Dana Whitfield", contactEmail: "dana@harbourline.example", crmStage: "Renewal" },
      { id: "s-fernvale", name: "Fernvale Electric", industry: "Energy", tier: "Title", contactName: "Ravi Menon", contactEmail: "ravi@fernvale.example", crmStage: "Contracted" },
      { id: "s-copperleaf", name: "Copperleaf Coffee Roasters", industry: "Food & beverage", tier: "Official Partner", contactName: "June Alvarez", contactEmail: "june@copperleaf.example", crmStage: "Contracted" },
      { id: "s-pinecrest", name: "Pinecrest Nutrition", industry: "Sports nutrition", tier: "Supporter", contactName: "Owen Clarke", contactEmail: "owen@pinecrest.example", crmStage: "Proposal" },
    ],
    events: [
      { id: "e-marathon", name: "Northshore Harbour Marathon 2026", kind: "Event", startDate: "2026-09-18", endDate: "2026-09-20", venue: "Northshore Waterfront" },
      { id: "e-gala", name: "Harbour Lights Winter Gala 2026", kind: "Event", startDate: "2026-11-28", endDate: "2026-11-28", venue: "Customs House Ballroom" },
      { id: "e-runclub", name: "Spring Run Club Series 2027", kind: "Campaign", startDate: "2027-03-01", endDate: "2027-05-31", venue: "Digital + 6 city parks" },
    ],
    agreements: [
      { id: H, sponsorId: "s-harbourline", eventId: "e-marathon", title: "Harbourline × Northshore Marathon 2026", value: 85000, currency: "USD", signedOn: "2026-07-10", fileName: "harbourline-marathon-2026-signed.pdf", text: DEMO_AGREEMENT_TEXT, extraction: "extracted", extractionEngine: "rules" },
      { id: F, sponsorId: "s-fernvale", eventId: "e-gala", title: "Fernvale × Winter Gala 2026 (Title)", value: 120000, currency: "USD", signedOn: "2026-09-02", fileName: "fernvale-gala-2026-title.pdf", text: THIRD_AGREEMENT_TEXT, extraction: "extracted", extractionEngine: "rules" },
      { id: C, sponsorId: "s-copperleaf", eventId: "e-gala", title: "Copperleaf × Winter Gala 2026", value: 18000, currency: "USD", signedOn: "2026-10-14", fileName: "copperleaf-gala-2026.pdf", text: SECOND_AGREEMENT_TEXT, extraction: "extracted", extractionEngine: "rules" },
    ],
    commitments: [
      ...commitmentsFor(DEMO_AGREEMENT_TEXT, H, "s-harbourline", "e-marathon", "confirmed"),
      ...commitmentsFor(THIRD_AGREEMENT_TEXT, F, "s-fernvale", "e-gala", "confirmed"),
      ...commitmentsFor(SECOND_AGREEMENT_TEXT, C, "s-copperleaf", "e-gala", "needs_review"),
    ],
    tasks,
    evidence,
    metrics,
  };
}

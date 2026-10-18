export type Tier = "Title" | "Presenting" | "Official Partner" | "Supporter";

export interface Sponsor {
  id: string;
  name: string;
  industry: string;
  tier: Tier;
  contactName: string;
  contactEmail: string;
  /** HubSpot deal stage, mirrored from CRM when connected. */
  crmStage: "Prospect" | "Proposal" | "Negotiation" | "Contracted" | "Renewal";
}

export interface EventItem {
  id: string;
  name: string;
  kind: "Event" | "Campaign";
  startDate: string;
  endDate: string;
  venue: string;
}

export interface Agreement {
  id: string;
  sponsorId: string;
  eventId: string;
  title: string;
  value: number;
  currency: string;
  signedOn: string;
  fileName: string;
  /** S3 object key when stored in AWS; undefined in demo mode. */
  s3Key?: string;
  text: string;
  extraction: "not_started" | "extracted";
  extractionEngine?: "bedrock" | "rules";
}

export type CommitmentCategory =
  | "Signage"
  | "Digital & Social"
  | "Activation"
  | "Hospitality"
  | "Broadcast & PA"
  | "Merchandise"
  | "Reporting"
  | "Other";

export type ReviewStatus = "needs_review" | "confirmed" | "rejected";

export interface Commitment {
  id: string;
  agreementId: string;
  sponsorId: string;
  eventId: string;
  clause: string;
  benefit: string;
  category: CommitmentCategory;
  quantity: number | null;
  unit: string | null;
  placement: string | null;
  deadline: string | null;
  reportingRequirement: string | null;
  /** Verbatim agreement text the commitment was extracted from. */
  sourceText: string;
  confidence: "high" | "medium" | "low";
  /** Important commitments cannot be reported until a person confirms them. */
  critical: boolean;
  reviewStatus: ReviewStatus;
  reviewedBy?: string;
  reviewedAt?: string;
}

export type TaskStatus = "todo" | "in_progress" | "blocked" | "done";

export interface Task {
  id: string;
  commitmentId: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: TaskStatus;
}

export type EvidenceKind = "Photograph" | "Document" | "Campaign record" | "Metrics export" | "Unclassified";

export interface Evidence {
  id: string;
  commitmentId: string | null;
  fileName: string;
  kind: EvidenceKind;
  uploadedBy: string;
  uploadedAt: string;
  description: string;
  /** Units of the commitment this item documents (e.g. 1 of 4 posts). Entered by a person. */
  quantityEvidenced: number;
  /** A person has checked the file actually shows what it claims. */
  verified: boolean;
  aiSuggestion?: string;
  s3Key?: string;
}

/**
 * Metrics are only ever entered by people or imported from a source system.
 * The platform never generates figures. Estimates must carry their method.
 */
export interface Metric {
  id: string;
  commitmentId: string;
  label: string;
  value: number;
  unit: string;
  provenance: "recorded" | "estimate";
  source: string;
  evidenceId?: string;
  method?: string;
}

export interface DemoRequest {
  name: string;
  email: string;
  organization: string;
  orgType: string;
  sponsorsPerYear: string;
  message?: string;
}

export interface Store {
  sponsors: Sponsor[];
  events: EventItem[];
  agreements: Agreement[];
  commitments: Commitment[];
  tasks: Task[];
  evidence: Evidence[];
  metrics: Metric[];
}

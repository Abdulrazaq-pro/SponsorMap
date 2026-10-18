import type { ReactNode } from "react";
import type { FulfilmentStatus } from "@/lib/fulfilment";
import { STATUS_LABEL } from "@/lib/fulfilment";
import type { Metric, ReviewStatus } from "@/lib/types";

const paths: Record<string, ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.8c1.6.8 2.6 2.5 3 5.2" /></>,
  file: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></>,
  list: <><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  kanban: <><rect x="3" y="4" width="5" height="16" rx="1.5" /><rect x="10" y="4" width="5" height="10" rx="1.5" /><rect x="17" y="4" width="4" height="13" rx="1.5" /></>,
  camera: <><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" /><circle cx="12" cy="13.5" r="3.5" /></>,
  award: <><circle cx="12" cy="9" r="6" /><path d="M8.5 14 7 22l5-3 5 3-1.5-8" /></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  bell: <><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z" /><path d="M10 21h4" /></>,
  plug: <><path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4" /></>,
  sparkle: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z" /></>,
  check: <path d="M5 12.5 10 17 19 7" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  alert: <><path d="M12 3 2 20h20z" /><path d="M12 10v4M12 17v.5" /></>,
  upload: <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></>,
  shield: <><path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z" /><path d="m9 12 2 2 4-4" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
  cloud: <path d="M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8z" />,
  database: <><ellipse cx="12" cy="5.5" rx="7.5" ry="2.5" /><path d="M4.5 5.5v13c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-13M4.5 12c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5" /></>,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
};

export function Icon({ name, size = 18, className }: { name: keyof typeof paths | string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {paths[name] ?? paths.grid}
    </svg>
  );
}

export function BrandMark() {
  return (
    <span className="brand-mark">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="6" cy="17" r="2.6" fill="#d8b977" />
        <circle cx="12" cy="7" r="2.6" fill="#fff" />
        <circle cx="18" cy="15" r="2.6" fill="#8f74ff" />
        <path d="M6 17 12 7l6 8" stroke="#fff" strokeOpacity=".55" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

const statusTone: Record<FulfilmentStatus, string> = {
  awaiting_review: "b-amber",
  fulfilled: "b-green",
  partially_evidenced: "b-blue",
  no_evidence: "b-grey",
  overdue: "b-red",
  excluded: "b-outline",
};

export function StatusBadge({ status }: { status: FulfilmentStatus }) {
  return <span className={`badge ${statusTone[status]}`}>{STATUS_LABEL[status]}</span>;
}

export function ReviewBadge({ status }: { status: ReviewStatus }) {
  if (status === "confirmed") return <span className="badge b-green">Confirmed by reviewer</span>;
  if (status === "rejected") return <span className="badge b-outline">Rejected</span>;
  return <span className="badge b-amber">Needs human review</span>;
}

export function ProvenanceBadge({ m }: { m: Pick<Metric, "provenance"> }) {
  return m.provenance === "recorded" ? (
    <span className="badge b-green">Recorded</span>
  ) : (
    <span className="badge b-gold">Estimate</span>
  );
}

export function ConfidenceBadge({ level }: { level: "high" | "medium" | "low" }) {
  const tone = level === "high" ? "b-purple" : level === "medium" ? "b-blue" : "b-amber";
  return <span className={`badge plain ${tone}`}>{level} confidence</span>;
}

export function Progress({ value, max, tone }: { value: number; max: number; tone?: "green" | "amber" | "red" }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className={`progress ${tone ?? ""}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}

export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="row between wrap" style={{ marginBottom: 22, alignItems: "flex-end" }}>
      <div>
        <h1 className="page-title">{title}</h1>
        {sub && <p className="page-sub">{sub}</p>}
      </div>
      {actions && <div className="row wrap">{actions}</div>}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="muted small" style={{ padding: "28px 0", textAlign: "center" }}>{children}</div>;
}

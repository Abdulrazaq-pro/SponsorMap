"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark, Icon } from "@/components/ui";
import { buildAlerts } from "@/lib/fulfilment";
import { CURRENT_USER, useStore } from "@/lib/store";

const NAV = [
  { group: "Overview", items: [{ href: "/app", label: "Dashboard", icon: "grid" }] },
  {
    group: "Portfolio",
    items: [
      { href: "/app/sponsors", label: "Sponsors", icon: "users" },
      { href: "/app/agreements", label: "Agreement library", icon: "file" },
      { href: "/app/events", label: "Events & campaigns", icon: "calendar" },
    ],
  },
  {
    group: "Delivery",
    items: [
      { href: "/app/commitments", label: "Commitment register", icon: "list", key: "review" },
      { href: "/app/tasks", label: "Fulfilment board", icon: "kanban" },
      { href: "/app/evidence", label: "Evidence", icon: "camera" },
      { href: "/app/benefits", label: "Benefit tracking", icon: "award" },
    ],
  },
  {
    group: "Reporting",
    items: [
      { href: "/app/reports", label: "Performance reports", icon: "chart" },
      { href: "/app/integrations", label: "Integrations", icon: "plug" },
    ],
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { store, dispatch } = useStore();
  const alerts = buildAlerts(store);
  const critical = alerts.filter((a) => a.severity === "critical").length;
  const toReview = store.commitments.filter((c) => c.reviewStatus === "needs_review").length;

  return (
    <div className="app">
      <aside className="sidebar">
        <Link href="/" className="brand"><BrandMark /> SponsorMap</Link>
        {NAV.map((g) => (
          <div key={g.group} className="side-group">
            <span className="side-label">{g.group}</span>
            {g.items.map((i) => {
              const active = i.href === "/app" ? path === "/app" : path.startsWith(i.href);
              return (
                <Link key={i.href} href={i.href} className={`side-link ${active ? "active" : ""}`}>
                  <Icon name={i.icon} size={17} /> {i.label}
                  {i.href === "/app" && critical > 0 && <span className="count alert">{critical}</span>}
                  {"key" in i && toReview > 0 && <span className="count">{toReview}</span>}
                </Link>
              );
            })}
          </div>
        ))}
        <div className="side-foot" style={{ marginTop: "auto", fontSize: 12, padding: "0 10px", color: "rgba(255,255,255,0.45)" }}>
          <p>Demo workspace · Meridian Events Co. (fictional). Data is stored in this browser.</p>
          <button className="btn btn-ghost-dark btn-sm" style={{ marginTop: 10 }} onClick={() => confirm("Reset the demo workspace to its original data?") && dispatch({ type: "reset" })}>
            Reset demo data
          </button>
        </div>
      </aside>
      <div className="main">
        <div className="topbar no-print">
          <div className="row small muted"><Icon name="sparkle" size={16} /> AI suggestions are drafts — confirmed by people before they count.</div>
          <div className="row">
            <Link href="/app" className="btn btn-ghost btn-sm"><Icon name="bell" size={15} /> {alerts.length} alerts</Link>
            <Link href="/app/agreements/new" className="btn btn-primary btn-sm"><Icon name="upload" size={15} /> Upload agreement</Link>
            <span className="avatar" title={CURRENT_USER}>LK</span>
          </div>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

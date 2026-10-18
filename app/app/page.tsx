"use client";

import Link from "next/link";
import { Icon, PageHeader } from "@/components/ui";
import { allStates, buildAlerts, fmtMoney } from "@/lib/fulfilment";
import { sponsorIntel } from "@/lib/intel";
import { useStore } from "@/lib/store";

export default function Dashboard() {
  const { store } = useStore();
  const states = allStates(store);
  const alerts = buildAlerts(store);
  const confirmed = states.filter((s) => s.commitment.reviewStatus === "confirmed");
  const fulfilled = confirmed.filter((s) => s.status === "fulfilled").length;
  const review = states.filter((s) => s.status === "awaiting_review").length;
  const overdue = states.filter((s) => s.status === "overdue").length;
  const value = store.agreements.reduce((s, a) => s + a.value, 0);
  const tone = { critical: "red", warning: "gold", info: "" } as const;

  return (
    <div className="stack-lg">
      <PageHeader title="Sponsorship operations" sub="Meridian Events Co. · fictional demo workspace" />
      <div className="grid-4">
        <div className="card card-pad kpi"><div className="label">Contracted value</div><div className="value">{fmtMoney(value)}</div><div className="sub">{store.agreements.length} agreements</div></div>
        <div className="card card-pad kpi"><div className="label">Confirmed commitments evidenced</div><div className="value">{fulfilled} / {confirmed.length}</div><div className="sub">from uploaded evidence</div></div>
        <div className="card card-pad kpi"><div className="label">Awaiting human review</div><div className="value">{review}</div><div className="sub">not tracked until confirmed</div></div>
        <div className="card card-pad kpi"><div className="label">Overdue, unfulfilled</div><div className="value" style={{ color: overdue ? "var(--red)" : undefined }}>{overdue}</div><div className="sub">past deadline without evidence</div></div>
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="card">
          <div className="card-head"><h3>Outstanding commitment alerts</h3><span className="badge plain b-grey">{alerts.length}</span></div>
          <div className="card-pad stack">
            {alerts.length === 0 && <p className="muted small">No alerts.</p>}
            {alerts.map((a) => (
              <div key={a.id} className={`notice ${tone[a.severity]}`}>
                <Icon name={a.severity === "info" ? "eye" : "alert"} />
                <div><strong>{a.title}</strong><div className="small">{a.detail}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Sponsor performance intelligence</h3><span className="tiny muted">Computed from records only</span></div>
          <div className="card-pad stack-lg">
            {store.sponsors.filter((s) => store.agreements.some((a) => a.sponsorId === s.id)).map((s) => {
              const intel = sponsorIntel(store, s.id);
              return (
                <div key={s.id} className="stack" style={{ gap: 6 }}>
                  <div className="row between"><strong>{s.name}</strong><span className="badge plain b-gold">{s.tier}</span></div>
                  <ul className="small muted" style={{ margin: 0, paddingLeft: 18 }}>
                    {intel.summary.map((line) => <li key={line}>{line}</li>)}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <p className="tiny muted">Sample figures belong to fictional organizations. <Link href="/demo" style={{ textDecoration: "underline" }}>Open the interactive demo</Link></p>
    </div>
  );
}

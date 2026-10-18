"use client";

import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from "react";
import { seedStore } from "./seed";
import type { Agreement, Commitment, Evidence, Metric, Store, Task, TaskStatus } from "./types";

/**
 * Demo-mode workspace state. Persists to localStorage so changes survive a
 * reload. In a deployed environment the same actions map to the /api routes
 * backed by PostgreSQL (see db/schema.sql).
 */

type Action =
  | { type: "reset" }
  | { type: "hydrate"; store: Store }
  | { type: "reviewCommitment"; id: string; status: Commitment["reviewStatus"]; reviewer: string }
  | { type: "updateCommitment"; id: string; patch: Partial<Commitment> }
  | { type: "addAgreement"; agreement: Agreement; commitments: Commitment[] }
  | { type: "addTask"; task: Task }
  | { type: "moveTask"; id: string; status: TaskStatus }
  | { type: "addEvidence"; evidence: Evidence }
  | { type: "updateEvidence"; id: string; patch: Partial<Evidence> }
  | { type: "addMetric"; metric: Metric };

function reducer(s: Store, a: Action): Store {
  switch (a.type) {
    case "reset":
      return seedStore();
    case "hydrate":
      return a.store;
    case "reviewCommitment":
      return {
        ...s,
        commitments: s.commitments.map((c) =>
          c.id === a.id ? { ...c, reviewStatus: a.status, reviewedBy: a.reviewer, reviewedAt: new Date().toISOString().slice(0, 10) } : c,
        ),
      };
    case "updateCommitment":
      return { ...s, commitments: s.commitments.map((c) => (c.id === a.id ? { ...c, ...a.patch } : c)) };
    case "addAgreement":
      return {
        ...s,
        agreements: [a.agreement, ...s.agreements.filter((x) => x.id !== a.agreement.id)],
        commitments: [...s.commitments.filter((c) => c.agreementId !== a.agreement.id), ...a.commitments],
      };
    case "addTask":
      return { ...s, tasks: [...s.tasks, a.task] };
    case "moveTask":
      return { ...s, tasks: s.tasks.map((t) => (t.id === a.id ? { ...t, status: a.status } : t)) };
    case "addEvidence":
      return { ...s, evidence: [a.evidence, ...s.evidence] };
    case "updateEvidence":
      return { ...s, evidence: s.evidence.map((e) => (e.id === a.id ? { ...e, ...a.patch } : e)) };
    case "addMetric":
      return { ...s, metrics: [...s.metrics, a.metric] };
  }
}

const KEY = "sponsormap.workspace.v1";
const Ctx = createContext<{ store: Store; dispatch: (a: Action) => void; ready: boolean } | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, dispatch] = useReducer(reducer, undefined, seedStore);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) dispatch({ type: "hydrate", store: JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(store));
    } catch {}
  }, [store, ready]);

  return <Ctx.Provider value={{ store, dispatch, ready }}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore outside StoreProvider");
  return v;
}

export const CURRENT_USER = "Lena K.";

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

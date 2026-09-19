"use client";

import { createContext, useCallback, useContext, useState } from "react";
import {
  initialState,
  MockupLogic,
  type LogicProps,
  type MockupState,
  type SetState,
  type Vals,
} from "./logic";

const MockupContext = createContext<{ state: MockupState; setState: SetState } | null>(null);

// Houdt de demo-state (gekozen klant, kit-editor, instellingen-tab, …) vast tussen pagina's.
export function MockupProvider({ children }: { children: React.ReactNode }) {
  const [state, set] = useState(initialState);
  const setState = useCallback<SetState>(
    (patch) => set((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) })),
    [],
  );
  return <MockupContext.Provider value={{ state, setState }}>{children}</MockupContext.Provider>;
}

export function useMockupVals(props: LogicProps): Vals {
  const ctx = useContext(MockupContext);
  if (!ctx) throw new Error("useMockupVals moet binnen <MockupProvider> staan");
  return new MockupLogic(ctx.state, ctx.setState, props).renderVals();
}

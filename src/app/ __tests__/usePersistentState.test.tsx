import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePersistentState } from "../../hooks/usePersistentState";
import { ServicesCtx } from "../contexts/services-context";
import type { Clock, Latency, LeadRepository, OpportunityRepository } from "../../features/ports";

const kv = {
  get<T>(key: string): T | null {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  },
  set<T>(key: string, value: T): void {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
};

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
  <ServicesCtx.Provider value={{
    kv,
    leads: {} as LeadRepository,
    opps: {} as OpportunityRepository,
    clock: {} as Clock,
    latency: {} as Latency,
  }}>
    {children}
  </ServicesCtx.Provider>
);

describe("usePersistentState", () => {
  it("initializes from KV and writes back on change", () => {
    window.localStorage.clear();
    window.localStorage.setItem("leads:status", JSON.stringify("qualified"));

    const { result } = renderHook(() => usePersistentState<string>("leads:status", "new"), { wrapper });

    expect(result.current[0]).toBe("qualified");

    act(() => result.current[1]("contacted"));
    expect(JSON.parse(window.localStorage.getItem("leads:status")!)).toBe("contacted");
  });
});

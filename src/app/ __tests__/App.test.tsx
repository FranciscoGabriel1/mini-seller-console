import { render, screen } from "@testing-library/react"
import App from "../../App"
import { ServicesCtx } from "../../app/contexts/services-context"
import type { Services } from "../../features/ports"

const servicesMock: Services = {
  leads: {
    list: async () => [],
    update: async (l) => l,
  },
  opps: {
    add: async (o) => ({ ...o, id: o.id || "opp_test" }),
    list: async () => [],
    delete: async () => { /* noop for test */ }, 
  },
  kv: {
    get: () => null,
    set: () => void 0,
  },
  clock: { now: () => Date.now() },
  latency: { wait: async () => void 0 },
}

describe("App", () => {
  it("renders header", () => {
    render(
      <ServicesCtx.Provider value={servicesMock}>
        <App />
      </ServicesCtx.Provider>
    )
    expect(screen.getByText(/Mini Seller Console/i)).toBeInTheDocument()
  })
})

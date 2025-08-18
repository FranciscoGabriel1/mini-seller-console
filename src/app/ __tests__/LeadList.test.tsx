import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, fireEvent, within } from "@testing-library/react"
import { ServicesCtx } from "../../app/contexts/services-context"
import type { Services } from "../../features/ports"
import type { Lead } from "../../features/leads/types"

vi.mock("../../features/leads/hooks/useLeads", () => ({
  useLeads: vi.fn(),
}))

vi.mock("../../features/opportunities/hooks/useOpportunities", () => ({
  useOpportunities: vi.fn(() => ({ addOpportunity: vi.fn() })),
}))

import { useLeads } from "../../features/leads/hooks/useLeads"
import { LeadList } from "../../components/LeadList"

const servicesMock: Services = {
  leads: { list: async () => [], update: async l => l },
  opps: { add: async o => ({ ...o, id: o.id || "opp_test" }), list: async () => [], delete: async () => { /* noop for test */ }, },
  kv: { get: () => null, set: () => void 0 },
  clock: { now: () => Date.now() },
  latency: { wait: async () => void 0 },
}

const sampleLeads: Lead[] = [
  { id: "1", name: "Alice Johnson", company: "Acme Inc.", email: "a@acme.com", source: "web", score: 90, status: "new" },
  { id: "2", name: "Bruno Lima", company: "Beta Corp", email: "b@beta.com", source: "referral", score: 65, status: "contacted" },
  { id: "3", name: "Carla Souza", company: "Gamma LLC", email: "c@gamma.com", source: "event", score: 82, status: "qualified" },
]

describe("<LeadList />", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the leads table with rows", () => {
    vi.mocked(useLeads).mockReturnValue({
      data: sampleLeads,
      isLoading: false,
      errorMessage: null,
      updateLead: vi.fn(),
      reload: vi.fn(),
      dismissError: vi.fn(),
    })

    render(
      <ServicesCtx.Provider value={servicesMock}>
        <LeadList />
      </ServicesCtx.Provider>
    )

    const table = screen.getByRole("table")
    const t = within(table)

    expect(t.getByText("Name")).toBeInTheDocument()
    expect(t.getByText("Company")).toBeInTheDocument()
    expect(t.getByText("Status")).toBeInTheDocument()
    expect(t.getByText("Score")).toBeInTheDocument()

    expect(t.getByText("Alice Johnson")).toBeInTheDocument()
    expect(t.getByText("Bruno Lima")).toBeInTheDocument()
    expect(t.getByText("Carla Souza")).toBeInTheDocument()
  })

  it("filters by search (name/company)", () => {
    vi.mocked(useLeads).mockReturnValue({
      data: sampleLeads,
      isLoading: false,
      errorMessage: null,
      updateLead: vi.fn(),
      reload: vi.fn(),
      dismissError: vi.fn(),
    })

    render(
      <ServicesCtx.Provider value={servicesMock}>
        <LeadList />
      </ServicesCtx.Provider>
    )

    const table = screen.getByRole("table")
    const t = within(table)

    const searchInput = screen.getByPlaceholderText(/search by name\/company/i)
    fireEvent.change(searchInput, { target: { value: "acme" } })

    expect(t.getByText("Alice Johnson")).toBeInTheDocument()
    expect(t.queryByText("Bruno Lima")).not.toBeInTheDocument()
    expect(t.queryByText("Carla Souza")).not.toBeInTheDocument()
  })

  it("allows inline score edit and calls updateLead with new score", async () => {
    const updateLead = vi.fn()

    vi.mocked(useLeads).mockReturnValue({
      data: sampleLeads,
      isLoading: false,
      errorMessage: null,
      updateLead,
      reload: vi.fn(),
      dismissError: vi.fn(),
    })

    render(
      <ServicesCtx.Provider value={servicesMock}>
        <LeadList />
      </ServicesCtx.Provider>
    )

    const table = screen.getByRole("table")
    const t = within(table)

    const aliceCell = t.getByText("Alice Johnson")
    const aliceRow = aliceCell.closest("tr")!
    const row = within(aliceRow)

    const scoreButton = row.getByRole("button", { name: /edit score/i })
    fireEvent.click(scoreButton)

    const scoreInput = row.getByRole("textbox", { name: /edit score/i })
    fireEvent.change(scoreInput, { target: { value: "95" } })

    const saveBtn = row.getByRole("button", { name: /^save$/i })
    fireEvent.click(saveBtn)

    expect(updateLead).toHaveBeenCalledTimes(1)
    const arg = updateLead.mock.calls[0][0] as Lead
    expect(arg.id).toBe("1")
    expect(arg.score).toBe(95)
  })
})

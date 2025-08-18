import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { LeadDetailPanel } from "../../components/LeadDetailPanel"
import type { Lead } from "../../features/leads/types"

const baseLead: Lead = {
  id: "l1",
  name: "Jane Doe",
  company: "Acme Inc.",
  email: "jane@acme.com",
  source: "web",
  score: 80,
  status: "new",
}

describe("<LeadDetailPanel />", () => {
  it("shows validation error for invalid email and does not call onSave", () => {
    const onSave = vi.fn()
    render(
      <LeadDetailPanel
        lead={baseLead}
        onClose={() => {}}
        onSave={onSave}
        onConvert={() => {}}
      />
    )

    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: "invalid" } })

    fireEvent.submit(emailInput.closest("form")!)
    expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  it("calls onSave with updated email and status when valid", () => {
    const onSave = vi.fn()
    render(
      <LeadDetailPanel
        lead={baseLead}
        onClose={() => {}}
        onSave={onSave}
        onConvert={() => {}}
      />
    )

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "jane.doe@acme.com" },
    })
    fireEvent.change(screen.getByLabelText(/status/i), {
      target: { value: "qualified" },
    })

    fireEvent.click(screen.getByRole("button", { name: /save/i }))

    expect(onSave).toHaveBeenCalledTimes(1)
    const arg = onSave.mock.calls[0][0] as Lead
    expect(arg.email).toBe("jane.doe@acme.com")
    expect(arg.status).toBe("qualified")
  })

  it("calls onConvert with stage and numeric amount", () => {
    const onConvert = vi.fn()
    render(
      <LeadDetailPanel
        lead={baseLead}
        onClose={() => {}}
        onSave={() => {}}
        onConvert={onConvert}
      />
    )

    fireEvent.change(screen.getByLabelText(/stage/i), {
      target: { value: "Proposal" },
    })
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: "12500" },
    })

    fireEvent.click(screen.getByRole("button", { name: /convert lead/i }))

    expect(onConvert).toHaveBeenCalledTimes(1)
    expect(onConvert).toHaveBeenCalledWith({ stage: "Proposal", amount: 12500 })
  })

  it("calls onConvert with undefined amount when input is empty", () => {
    const onConvert = vi.fn()
    render(
      <LeadDetailPanel
        lead={baseLead}
        onClose={() => {}}
        onSave={() => {}}
        onConvert={onConvert}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: /convert lead/i }))

    expect(onConvert).toHaveBeenCalledTimes(1)
    expect(onConvert).toHaveBeenCalledWith({ stage: "Prospecting", amount: undefined })
  })
})

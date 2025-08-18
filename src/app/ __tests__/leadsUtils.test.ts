import { describe, it, expect } from "vitest"
import { searchLeads, filterByStatus, sortByScore } from "../../features/leads/utils"
import type { Lead } from "../../features/leads/types"

const leads: Lead[] = [
  { id: "1", name: "Alice", company: "Acme", email: "a@acme.com", source: "web", score: 90, status: "new" },
  { id: "2", name: "Bruno", company: "Beta", email: "b@beta.com", source: "referral", score: 65, status: "contacted" },
  { id: "3", name: "Carla", company: "Gamma", email: "c@gamma.com", source: "event", score: 82, status: "qualified" },
]

describe("leads utils", () => {
  it("searchLeads filters by name or company", () => {
    const result = searchLeads(leads, "acme")
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe("Alice")
  })

  it("filterByStatus returns only leads with given status", () => {
    const result = filterByStatus(leads, "contacted")
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe("Bruno")
  })

  it("sortByScore orders leads by descending score", () => {
    const result = sortByScore(leads, "desc")
    expect(result[0].score).toBe(90)
    expect(result[1].score).toBe(82)
    expect(result[2].score).toBe(65)
  })
})

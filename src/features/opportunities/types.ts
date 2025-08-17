export type Opportunity = {
  id: string
  name: string
  stage: "Prospecting" | "Qualification" | "Proposal" | "Closed Won" | "Closed Lost"
  amount?: number
  accountName: string
}

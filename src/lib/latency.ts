export const simulatedLatency = () => ({
  async wait(ms = 400, failRate = 0) {
    await new Promise(r => setTimeout(r, ms))
    if (failRate > 0 && Math.random() < failRate) throw new Error("Simulated failure")
  },
})

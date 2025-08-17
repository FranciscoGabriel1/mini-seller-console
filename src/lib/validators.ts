export function isValidEmail(value: string): boolean {
  // simple RFC5322-ish check, good enough for UI validation
  return /\S+@\S+\.\S+/.test(value)
}

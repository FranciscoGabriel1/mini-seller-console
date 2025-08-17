export const localStorageKV = {
  get<T>(key: string): T | null {
    try { return JSON.parse(localStorage.getItem(key) ?? "null") } catch { return null }
  },
  set<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value))
  },
}

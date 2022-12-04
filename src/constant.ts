export const FILTER_AVAILABLE = "Filter is ON"
export const FILTER_UNAVAILABLE = "Filter is OFF"

export interface Configuration {
  available: boolean
  filters: string[]
}

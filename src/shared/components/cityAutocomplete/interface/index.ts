export interface ICitySuggestion {
  data: { city: string; city_kladr_id: string }
  value: string
}

export interface ICityOption {
  id: string
  label: string
  value: string
}

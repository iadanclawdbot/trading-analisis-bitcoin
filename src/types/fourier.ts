export interface FrequencyComponent {
  bin: number
  magnitude: number
  phase: number // radianes
  periodDays: number
  frequencyPerDay: number
  label: string // "Fundamental", "Armónico 1", etc.
  color: string // color asignado para UI
}

export interface FourierResult {
  re: Float64Array
  im: Float64Array
  N: number // longitud con zero-padding (potencia de 2)
  originalN: number // longitud original de residuos
  allComponents: FrequencyComponent[] // todas, ordenadas por magnitud
  topComponents: FrequencyComponent[] // top 8
}

export interface ReconstructedSignal {
  values: Float64Array // senal reconstruida (originalN + 730 dias)
  projectionStartIndex: number // indice desde donde empieza el forecast
  enabledBins: Set<number> // bins activos en UI
}

export interface RegressionResult {
  slope: number // exponente power law (~5.4)
  intercept: number // log10(C)
  C: number // coeficiente: 10^intercept
  rSquared: number // bondad de ajuste (~0.96)
  sigma: number // desv estandar residuos log10 (~0.28)
  filteredCount: number // puntos usados en regresion
}

export interface PowerLawPoint {
  timestamp: number
  dayIndex: number
  date: string
  fairValue: number
  supportValue: number // fair value - 2*sigma en precio
  resistanceValue: number // fair value + 2*sigma en precio
}

export interface PowerLawBands {
  fairValue: PowerLawPoint[]
  support: PowerLawPoint[]
  resistance: PowerLawPoint[]
}

import type { FrequencyComponent, FourierResult, ReconstructedSignal } from '../../types'
import { TOP_FREQUENCIES, PROJECTION_DAYS } from '../../constants/math'
import { HARMONIC_COLORS } from '../../constants/theme'
import { nextPowerOf2 } from './utils'
import { fft } from './fft'

export function analyzeFourier(residuals: number[]): FourierResult {
  const originalN = residuals.length
  const N = nextPowerOf2(originalN)

  const re = new Float64Array(N)
  const im = new Float64Array(N)

  // Copiar residuos (cero-padding automatico al ser Float64Array)
  for (let i = 0; i < originalN; i++) {
    re[i] = residuals[i]
  }

  fft(re, im)

  // Extraer componentes: bins 1 a N/2-1 (skip DC component en bin 0)
  const allComponents: FrequencyComponent[] = []
  const half = Math.floor(N / 2)

  for (let bin = 1; bin < half; bin++) {
    const magnitude = Math.sqrt(re[bin] * re[bin] + im[bin] * im[bin])
    const phase = Math.atan2(im[bin], re[bin])
    const periodDays = N / bin
    const frequencyPerDay = bin / N

    allComponents.push({ bin, magnitude, phase, periodDays, frequencyPerDay, label: '', color: '' })
  }

  // Ordenar por magnitud descendente
  allComponents.sort((a, b) => b.magnitude - a.magnitude)

  // Top K con etiquetas y colores
  const topComponents = allComponents.slice(0, TOP_FREQUENCIES).map((c, i) => ({
    ...c,
    label: i === 0 ? 'Fundamental' : `Armónico ${i}`,
    color: HARMONIC_COLORS[i] ?? '#ffffff',
  }))

  return { re, im, N, originalN, allComponents, topComponents }
}

export function reconstructSignal(
  components: FrequencyComponent[],
  N: number,
  outputLength: number,
): Float64Array {
  const signal = new Float64Array(outputLength)

  for (const c of components) {
    const amplitude = (2 * c.magnitude) / N
    const freq = c.frequencyPerDay
    const phase = c.phase

    for (let t = 0; t < outputLength; t++) {
      signal[t] += amplitude * Math.cos(2 * Math.PI * freq * t + phase)
    }
  }

  return signal
}

export function buildReconstructedSignal(
  fourierResult: FourierResult,
  enabledBins: Set<number>,
): ReconstructedSignal {
  const { N, originalN, topComponents } = fourierResult
  const outputLength = originalN + PROJECTION_DAYS
  const activeComponents = topComponents.filter((c) => enabledBins.has(c.bin))
  const values = reconstructSignal(activeComponents, N, outputLength)

  return {
    values,
    projectionStartIndex: originalN,
    enabledBins,
  }
}

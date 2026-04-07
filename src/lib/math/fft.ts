/**
 * FFT Cooley-Tukey radix-2 DIT (Decimation In Time)
 * In-place, trabaja sobre Float64Array para re e im.
 * O(N log N), N debe ser potencia de 2.
 */

function bitReverse(x: number, bits: number): number {
  let result = 0
  for (let i = 0; i < bits; i++) {
    result = (result << 1) | (x & 1)
    x >>= 1
  }
  return result >>> 0
}

export function fft(re: Float64Array, im: Float64Array): void {
  const N = re.length
  if (N <= 1) return
  const bits = Math.log2(N)

  // Paso 1: Bit-reversal permutation
  for (let i = 0; i < N; i++) {
    const j = bitReverse(i, bits)
    if (i < j) {
      ;[re[i], re[j]] = [re[j], re[i]]
      ;[im[i], im[j]] = [im[j], im[i]]
    }
  }

  // Paso 2: Butterfly operations
  for (let size = 2; size <= N; size <<= 1) {
    const halfSize = size >> 1
    const angleStep = (-2 * Math.PI) / size

    for (let groupStart = 0; groupStart < N; groupStart += size) {
      for (let k = 0; k < halfSize; k++) {
        const angle = angleStep * k
        const twRe = Math.cos(angle)
        const twIm = Math.sin(angle)

        const evenIdx = groupStart + k
        const oddIdx = groupStart + k + halfSize

        const tRe = twRe * re[oddIdx] - twIm * im[oddIdx]
        const tIm = twRe * im[oddIdx] + twIm * re[oddIdx]

        re[oddIdx] = re[evenIdx] - tRe
        im[oddIdx] = im[evenIdx] - tIm
        re[evenIdx] = re[evenIdx] + tRe
        im[evenIdx] = im[evenIdx] + tIm
      }
    }
  }
}

import { useEffect, useRef } from 'react'
import { createChart, HistogramSeries, LineSeries } from 'lightweight-charts'
import { useDashboard } from '../../context/DashboardContext'
import { CHART_THEME, COLORS } from '../../constants/theme'
import type { ISeriesApi, SeriesType } from 'lightweight-charts'

export function ResidualsChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null)
  const seriesRef = useRef<ISeriesApi<SeriesType>[]>([])
  const { residuals, regression } = useDashboard()

  useEffect(() => {
    if (!containerRef.current) return
    const chart = createChart(containerRef.current, {
      ...CHART_THEME,
      autoSize: true,
      timeScale: { timeVisible: true, secondsVisible: false },
    })
    chartRef.current = chart

    return () => {
      chart.remove()
      chartRef.current = null
      seriesRef.current = []
    }
  }, [])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart || !residuals) return

    // Limpiar series anteriores
    for (const s of seriesRef.current) {
      try { chart.removeSeries(s) } catch { /* ignorar */ }
    }
    seriesRef.current = []

    const sigma = regression?.sigma ?? 0.28

    // Barras de residuos
    const histSeries = chart.addSeries(HistogramSeries, {
      color: COLORS.orange,
      priceScaleId: 'right',
    })
    seriesRef.current.push(histSeries as ISeriesApi<SeriesType>)

    const histData = residuals.values.map((v, i) => {
      const ts = Math.floor(residuals.timestamps[i] / 1000)
      const ratio = sigma > 0 ? Math.abs(v) / sigma : 0
      const intensity = Math.round(Math.min(80 + ratio * 175, 255))
      const hexAlpha = intensity.toString(16).padStart(2, '0')
      return {
        time: ts as number,
        value: v,
        color: v >= 0
          ? COLORS.orange + hexAlpha
          : COLORS.blue + hexAlpha,
      }
    })

    histSeries.setData(histData as never)

    // Linea cero
    const zeroSeries = chart.addSeries(LineSeries, {
      color: COLORS.muted + '40',
      lineWidth: 1 as 1,
      priceScaleId: 'right',
      crosshairMarkerVisible: false,
    })
    seriesRef.current.push(zeroSeries as ISeriesApi<SeriesType>)
    if (histData.length > 0) {
      zeroSeries.setData([
        { time: histData[0].time as never, value: 0 },
        { time: histData[histData.length - 1].time as never, value: 0 },
      ])
    }

    // Lineas +/-2 sigma
    if (sigma > 0 && histData.length > 0) {
      for (const mult of [-2, 2]) {
        const sigmaLine = chart.addSeries(LineSeries, {
          color: (mult > 0 ? COLORS.red : COLORS.blue) + '60',
          lineWidth: 1 as 1,
          lineStyle: 2,
          priceScaleId: 'right',
          crosshairMarkerVisible: false,
        })
        seriesRef.current.push(sigmaLine as ISeriesApi<SeriesType>)
        sigmaLine.setData([
          { time: histData[0].time as never, value: mult },
          { time: histData[histData.length - 1].time as never, value: mult },
        ])
      }
    }
  }, [residuals, regression])

  return <div ref={containerRef} className="w-full h-full" />
}

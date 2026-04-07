import { useEffect, useRef } from 'react'
import { createChart, LineSeries } from 'lightweight-charts'
import { useDashboard } from '../../context/DashboardContext'
import { CHART_THEME, COLORS } from '../../constants/theme'
import { GENESIS_TIMESTAMP, DAY_MS, REGRESSION_MIN_DAY } from '../../constants/bitcoin'
import type { ISeriesApi, SeriesType } from 'lightweight-charts'

export function FourierChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null)
  const seriesRef = useRef<ISeriesApi<SeriesType>[]>([])
  const { residuals, reconstructed, fourierResult } = useDashboard()

  useEffect(() => {
    if (!containerRef.current) return
    const chart = createChart(containerRef.current, {
      ...CHART_THEME,
      autoSize: true,
      timeScale: { timeVisible: false, secondsVisible: false },
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

    const baseDay = REGRESSION_MIN_DAY + 1
    const startTs = Math.floor((GENESIS_TIMESTAMP + baseDay * DAY_MS) / 1000)

    // Serie de residuos reales (gris tenue)
    const realSeries = chart.addSeries(LineSeries, {
      color: COLORS.muted + '40',
      lineWidth: 1 as 1,
      priceScaleId: 'right',
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    })
    seriesRef.current.push(realSeries as ISeriesApi<SeriesType>)

    const realData = residuals.values.map((v, i) => ({
      time: (Math.floor(residuals.timestamps[i] / 1000)) as number,
      value: v,
    }))
    realSeries.setData(realData as never)

    // Serie reconstruida (naranja)
    if (reconstructed && fourierResult) {
      const projIdx = reconstructed.projectionStartIndex
      const reconSeries = chart.addSeries(LineSeries, {
        color: COLORS.orange,
        lineWidth: 2 as 2,
        priceScaleId: 'right',
        lastValueVisible: false,
        priceLineVisible: false,
      })
      seriesRef.current.push(reconSeries as ISeriesApi<SeriesType>)

      const reconData = Array.from(reconstructed.values).slice(0, projIdx).map((v, i) => ({
        time: (startTs + i * 86400) as number,
        value: v,
      }))
      if (reconData.length > 0) reconSeries.setData(reconData as never)

      // Forecast (verde punteado)
      const forecastSeries = chart.addSeries(LineSeries, {
        color: COLORS.green + 'a0',
        lineWidth: 1 as 1,
        lineStyle: 2,
        priceScaleId: 'right',
        lastValueVisible: false,
        priceLineVisible: false,
      })
      seriesRef.current.push(forecastSeries as ISeriesApi<SeriesType>)

      const forecastData = Array.from(reconstructed.values).slice(projIdx - 1).map((v, i) => ({
        time: (startTs + (projIdx - 1 + i) * 86400) as number,
        value: v,
      }))
      if (forecastData.length > 0) forecastSeries.setData(forecastData as never)
    }

    // Linea cero
    if (realData.length > 0) {
      const zeroSeries = chart.addSeries(LineSeries, {
        color: COLORS.border2,
        lineWidth: 1 as 1,
        priceScaleId: 'right',
        crosshairMarkerVisible: false,
        lastValueVisible: false,
        priceLineVisible: false,
      })
      seriesRef.current.push(zeroSeries as ISeriesApi<SeriesType>)
      zeroSeries.setData([
        { time: realData[0].time as never, value: 0 },
        { time: realData[realData.length - 1].time as never, value: 0 },
      ])
    }
  }, [residuals, reconstructed, fourierResult])

  return <div ref={containerRef} className="w-full h-full" />
}

# TASK.md — Bitcoin Power Law Dashboard
> Documento vivo. Leer al inicio de cada sesion. Actualizar al completar tareas.

---

## Estado del sistema

| Componente | Estado | Verificado |
|------------|--------|------------|
| Scaffolding (Vite + React + TS + Tailwind) | ⬜ Pendiente | No |
| Datos bundled (`btc-historical.ts`) | ⬜ Pendiente | No |
| CoinGecko API client | ⬜ Pendiente | No |
| Merge + cache | ⬜ Pendiente | No |
| Regresion OLS (Power Law) | ⬜ Pendiente | No |
| FFT (Cooley-Tukey) | ⬜ Pendiente | No |
| Analisis Fourier (fases + senal) | ⬜ Pendiente | No |
| Canvas chart (log-log Power Law) | ⬜ Pendiente | No |
| lightweight-charts (residuos + Fourier) | ⬜ Pendiente | No |
| Layout + panel swapping | ⬜ Pendiente | No |
| Sidebar + MetricCards | ⬜ Pendiente | No |
| Capa educativa (modales) | ⬜ Pendiente | No |
| `npm run dev` sin errores | ⬜ Pendiente | No |

---

## 🔴 INMEDIATO — Fase 0+1: Base del proyecto

- [ ] Scaffolding: `npm create vite@latest`, instalar deps (lightweight-charts, lucide-react, tailwindcss@3)
- [ ] Configurar `tailwind.config.ts` con tema terminal oscuro custom (colores btc-*)
- [ ] Configurar `index.css` (Tailwind + JetBrains Mono + scrollbar + selection highlight)
- [ ] Crear toda la estructura de directorios (`src/types/`, `src/lib/`, `src/hooks/`, etc.)
- [ ] Crear archivos de tipos (`src/types/*.ts`)
- [ ] Crear constantes (`src/constants/bitcoin.ts`, `theme.ts`, `api.ts`, `math.ts`)
- [ ] Fetch datos de blockchain.info y generar `src/data/btc-historical.ts`
- [ ] Implementar `src/lib/data/coingecko.ts` (fetch365Days + fetchCurrentPrice)
- [ ] Implementar `src/lib/data/cache.ts` (localStorage TTL)
- [ ] Implementar `src/lib/data/merge.ts` (dedup por YYYY-MM-DD, sort, dayIndex)
- [ ] Implementar `src/hooks/useBtcData.ts` (orquestador)
- [ ] Implementar `src/hooks/useCurrentPrice.ts` (polling 60s)
- [ ] Verificar: datos merged con ~5500+ puntos, precio actual live

---

## 🟠 CORTO PLAZO — Fase 2+3: Motor matematico + shell

- [ ] `src/lib/math/utils.ts` (nextPowerOf2, log10, mean, stdDev, lerp, clamp)
- [ ] `src/lib/math/regression.ts` (OLS, filtrado, curvas fair/soporte/resistencia)
- [ ] `src/lib/math/residuals.ts` (residuo, z-score, percentil historico)
- [ ] `src/lib/math/fft.ts` (Cooley-Tukey radix-2, ~60 lineas, Float64Array)
- [ ] `src/lib/math/fourier-analysis.ts` (zero-pad, FFT, top-8, reconstruccion, proyeccion 730d)
- [ ] `src/lib/math/market-phase.ts` (derivada numerica + 4 fases)
- [ ] `src/lib/math/signal.ts` (Buy/Sell/Hold con z-score + fase)
- [ ] Hooks: `usePowerLaw`, `useResiduals`, `useFourier`, `useMarketPhase`
- [ ] Verificar: R²~0.96, exponente~5.4, fundamental Fourier ~1400-1500 dias
- [ ] `src/context/DashboardContext.ts` + `DashboardProvider.tsx`
- [ ] `src/components/shared/ErrorBoundary.tsx`, `LoadingSpinner.tsx`, `Modal.tsx`, `Badge.tsx`
- [ ] `src/components/layout/AppShell.tsx` (CSS Grid header + body + sidebar)
- [ ] `src/components/layout/Header.tsx` (senal, precio, fase)
- [ ] `src/components/layout/Sidebar.tsx` (container MetricCards)
- [ ] `src/components/layout/PanelContainer.tsx` (wrapper con Maximize2 + HelpCircle)
- [ ] `src/hooks/usePanelLayout.ts` + `MainPanel.tsx` + `BottomPanels.tsx`
- [ ] Verificar: `npm run dev` muestra layout con paneles vacios, swap funciona

---

## 🔵 MEDIANO PLAZO — Fase 4+5+6: Charts + Sidebar + Educativo

- [ ] `src/lib/canvas/axis-utils.ts` (ticks log-scale, label formatting)
- [ ] `src/lib/canvas/power-law-renderer.ts` (~300 lineas, Canvas 2D full)
- [ ] `src/lib/canvas/interaction.ts` (zoom, pan, crosshair, tooltip)
- [ ] `src/hooks/useCanvasChart.ts` (ref, ResizeObserver, DPR, rAF)
- [ ] `src/components/charts/PowerLawCanvas.tsx`
- [ ] `src/components/panels/PowerLawPanel.tsx`
- [ ] `src/components/charts/ResidualsChart.tsx` (lightweight-charts HistogramSeries)
- [ ] `src/components/panels/ResidualsPanel.tsx`
- [ ] `src/components/charts/FourierChart.tsx` (toggles + lightweight-charts LineSeries)
- [ ] `src/components/panels/FourierPanel.tsx` (8 botones armonicos)
- [ ] `src/components/charts/CyclesTimeline.tsx` (SVG timeline coloreado)
- [ ] `src/components/panels/MarketCyclesPanel.tsx`
- [ ] `src/components/sidebar/MetricCard.tsx`
- [ ] `src/components/sidebar/SignalGauge.tsx`
- [ ] `src/components/sidebar/PhaseIndicator.tsx`
- [ ] Sidebar completo con todas las metricas
- [ ] `src/components/educational/content.ts` (textos en espanol)
- [ ] `src/components/educational/WhatIsThisButton.tsx`
- [ ] `src/components/educational/EducationalModal.tsx`
- [ ] Integrar botones "Que es esto?" en cada PanelContainer
- [ ] Verificar: todos los paneles, swap, modales, tooltip canvas

---

## 🟢 LIMPIEZA — Baja prioridad

- [ ] Error boundaries en cada panel (no solo el root)
- [ ] Guards NaN/Infinity en calculos matematicos
- [ ] `React.memo` en chart components
- [ ] Debounce del resize del canvas
- [ ] Colapso responsive del sidebar bajo 1200px
- [ ] Optimizar bundle size (check con `npm run build`)
- [ ] Favicon BTC custom
- [ ] Tests unitarios para `regression.ts`, `fft.ts`, `merge.ts`

---

## ✅ COMPLETADO

*(nada aun — proyecto recien iniciado 2026-04-07)*

---

## 🚫 NO REPETIR — Errores documentados

| Error | Que paso | Regla |
|-------|----------|-------|
| *(vacio)* | — | — |

---

*TASK.md v1.0 — 2026-04-07 — Leer al inicio de cada sesion*

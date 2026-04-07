# CHANGELOG — Bitcoin Power Law Dashboard
> Historial de cambios por sesión. Actualizar antes de cada push.

---

## [2026-04-07] — Sesión 3: Zoom interactivo + bugs canvas

### Corregido
- **Canvas lower-left invisible** (`power-law-renderer.ts`): faltaba `ctx.beginPath()` antes de `ctx.rect()` para el clip — el path acumulado de renders anteriores corrompía la región de recorte. Se ve claro al hacer zoom en el browser (Ctrl+=) porque el resize resetea el contexto; en render normal el bug era evidente.
- **Logo TradingView** (`constants/theme.ts`): agregado `attributionLogo: false` en `CHART_THEME` para ocultar el watermark en los charts de lightweight-charts.

### Agregado
- **Zoom interactivo Power Law** (`PowerLawCanvas.tsx`):
  - Scroll wheel: zoom in/out centrado en la posición del mouse, en escala logarítmica
  - Drag (click + arrastrar): pan del gráfico
  - Doble clic: resetear a vista completa
  - Botón "Restablecer" aparece cuando hay zoom activo
- **Ejes adaptativos al zoom** (`axis-utils.ts`):
  - Años (rango > 730 días visibles)
  - Meses — "Ene 24", "Feb 24" (rango 60-730 días)
  - Semanas — "15 Ene", "22 Ene" (rango 14-60 días)
  - Días — "15 Ene 24" (rango < 14 días)
- **Ticks de precio adaptativos** (`axis-utils.ts`): multipliers más finos según nivel de zoom; ticks lineales para rangos estrechos (ej: $67.2K, $67.4K)
- **Anti-overlap de labels** (`power-law-renderer.ts`): labels del eje X/Y se saltan automáticamente si están a menos de 50px/18px entre sí

### Infraestructura
- Repo movido a cuenta `iadanclawdbot/trading-analisis-bitcoin`
- README.md reescrito con información del proyecto real
- CLAUDE.md v2.0 y TASK.md v3.0 actualizados

---

## [2026-04-07] — Sesión 2: QA Report — 6 bugs corregidos

### Corregido
- **Panel swap no revertía** (`usePanelLayout.ts:14`): clic en el panel principal ahora devuelve al layout por defecto (`DEFAULT_LAYOUT`) en lugar de `return prev`
- **Fourier solo mostraba ~6 meses** (`FourierChart.tsx`, `ResidualsChart.tsx`): agregado `chart.timeScale().fitContent()` al final del useEffect de datos
- **"En vivo" mentiroso con caché** (`types/ui.ts`, `useBtcData.ts`, `Header.tsx`): nuevo status `'cached'` que muestra "Caché (5min)" cuando los datos vienen de localStorage
- **Señal HOLD vs Distribución contradictorios** (`signal.ts`): nuevas reglas para el gap — Distribution con z-score levemente positivo (0 < z ≤ 0.5) → SELL 55-60% confianza; Bearish con z levemente negativo → BUY 55-60%
- **Fourier empezaba en 2009** (`FourierChart.tsx`): la reconstrucción usaba `GENESIS + 201*DAY_MS` como timestamp de inicio — corregido a `residuals.timestamps[i]`
- **Fourier se cortaba en 2016** (`FourierChart.tsx`): el forecast usaba índice fijo desde genesis — corregido a `lastRealTs + i * 86400`

### Reglas técnicas establecidas
- `ctx.shadowBlur` NUNCA en paths con 1400+ puntos → freeze por frame. Usar double-stroke (5px+30%opacidad, luego 2px sólido)
- `FourierChart`: timestamps históricos = `residuals.timestamps[i]`, forecast = `lastRealTs + i*86400`
- lightweight-charts v5: `lineWidth` solo acepta `1|2|3|4|5` (no float)

---

## [2026-04-07] — Sesión 1: Implementación inicial

### Agregado
- Scaffolding Vite 6 + React 19 + TypeScript 5 + Tailwind CSS 3
- `src/data/btc-historical.ts`: ~1400 puntos de precio desde agosto 2010
- Motor matemático: regresión OLS log-log, FFT Cooley-Tukey radix-2, análisis de Fourier, señales
- Gráfico Power Law (Canvas 2D custom, escala log-log, DPR, crosshair, tooltip)
- Gráficos lightweight-charts v5: residuos (histograma) y Fourier (reconstrucción + forecast)
- Layout CSS Grid con 4 paneles intercambiables (55%/45%)
- Sidebar con MetricCards en vivo (Z-score, percentil, R², sigma, fase, señal)
- 4 modales educativos en español
- CoinGecko live data + polling 60s + cache localStorage 5min
- Header con precio, señal, fase y estado de conexión
- `npm run build` limpio: 435KB, gzip ~142KB
- Git init + commit inicial

---

*CHANGELOG.md — iniciado 2026-04-07*

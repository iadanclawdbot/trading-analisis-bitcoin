# Bitcoin Power Law Dashboard — CLAUDE.md
> Briefing permanente. Leer antes de cada sesión.

---

## Qué es este proyecto

Dashboard web educativo sobre la **Ley de Potencia (Power Law) de Bitcoin**. Pensado para un canal de YouTube: todo explicado en español simple, sin jerga matemática, con gráficos interactivos. Corre 100% en el browser (sin backend). El usuario final no sabe matemáticas; el modelo matemático es el core, pero la UX es lo que lo hace valioso.

Repo: **https://github.com/iadanclawdbot/trading-analisis-bitcoin**

---

## Decisiones confirmadas (no volver a preguntar)

| Tema | Decisión |
|------|----------|
| Framework | React 19 + TypeScript + Vite 6 |
| Estilos | Tailwind CSS 3 (tema terminal oscuro, rounded-none) |
| Charts | lightweight-charts v5 para residuos y Fourier; Canvas 2D custom para Power Law |
| Icons | lucide-react |
| State | React Context + useMemo (sin zustand/jotai) |
| Datos bundled | TypeScript array en `src/data/btc-historical.ts` |
| Datos live | CoinGecko free API, polling 60s/5min |
| FFT | Cooley-Tukey radix-2 custom en TypeScript (~60 líneas), main thread |
| Routing | Ninguno (single-view, panel swap con estado local) |
| Cache | localStorage con TTL 5min para CoinGecko |
| Backend | NO hay backend, todo client-side |
| Idioma | Todo en español con tildes correctas |
| Font | JetBrains Mono (Google Fonts) |

---

## Stack técnico

```
React 19 + TypeScript 5 + Vite 6
Tailwind CSS 3 (tema terminal)
lightweight-charts v5 (TradingView OSS)
lucide-react
```

---

## Estructura de carpetas

```
trading-analisis-bitcoin/
├── CLAUDE.md
├── TASK.md
├── README.md
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── src/
    ├── types/          # price.ts, regression.ts, fourier.ts, market.ts, ui.ts
    ├── constants/      # theme.ts, bitcoin.ts, api.ts, math.ts
    ├── data/
    │   └── btc-historical.ts   # ~1400 puntos desde 2010
    ├── lib/
    │   ├── math/       # regression.ts, fft.ts, fourier-analysis.ts, signal.ts, utils.ts
    │   ├── data/       # coingecko.ts, merge.ts, cache.ts
    │   └── canvas/     # power-law-renderer.ts, axis-utils.ts, interaction.ts
    ├── hooks/          # useBtcData, usePowerLaw, useResiduals, useFourier, useCanvasChart, usePanelLayout
    ├── context/        # DashboardContext.ts, DashboardProvider.tsx
    └── components/
        ├── layout/     # AppShell, Header, Sidebar, MainPanel, BottomPanels, PanelContainer
        ├── panels/     # PowerLawPanel, ResidualsPanel, FourierPanel, MarketCyclesPanel
        ├── charts/     # PowerLawCanvas, ResidualsChart, FourierChart, CyclesTimeline
        ├── sidebar/    # MetricCard, SignalGauge, PhaseIndicator
        ├── shared/     # Modal, ErrorBoundary, LoadingSpinner, Badge
        └── educational/ # content.ts, WhatIsThisButton, EducationalModal
```

---

## Archivos clave por función

| Si necesito... | Leer... |
|----------------|---------|
| Cambiar la lógica de Buy/Sell/Hold | `src/lib/math/signal.ts` |
| Cambiar la regresión power law | `src/lib/math/regression.ts` |
| Cambiar el FFT | `src/lib/math/fft.ts` + `src/lib/math/fourier-analysis.ts` |
| Editar el gráfico power law (canvas) | `src/lib/canvas/power-law-renderer.ts` |
| Cambiar zoom/pan del canvas | `src/components/charts/PowerLawCanvas.tsx` |
| Cambiar ejes (ticks adaptativos) | `src/lib/canvas/axis-utils.ts` |
| Editar gráfico residuos/fourier | `src/components/charts/ResidualsChart.tsx` / `FourierChart.tsx` |
| Cambiar colores del tema | `src/constants/theme.ts` + `tailwind.config.ts` |
| Agregar métrica en el sidebar | `src/components/sidebar/MetricCard.tsx` + `src/context/DashboardProvider.tsx` |
| Editar textos educativos | `src/components/educational/content.ts` |
| Cambiar fuente de datos históricos | `src/data/btc-historical.ts` + `src/lib/data/merge.ts` |
| Agregar constante de Bitcoin | `src/constants/bitcoin.ts` |

---

## Comandos principales

```bash
npm run dev          # Dev server (http://localhost:5173)
npm run build        # Build producción
npm run preview      # Preview del build
git push             # Push a iadanclawdbot/trading-analisis-bitcoin
```

---

## Colores del tema

| Token | Hex | Uso |
|-------|-----|-----|
| `btc-bg` | `#020617` | Fondo principal |
| `btc-surface` | `#0f172a` | Cards, panels |
| `btc-border` | `#1e293b` | Bordes |
| `btc-text` | `#f8fafc` | Texto principal |
| `btc-muted` | `#94a3b8` | Labels, texto secundario |
| `btc-orange` | `#f97316` | BTC / neutral |
| `btc-green` | `#22c55e` | Positivo / COMPRA |
| `btc-red` | `#ef4444` | Negativo / VENTA |
| `btc-blue` | `#3b82f6` | Soporte / Acumulación |
| `btc-violet` | `#8b5cf6` | Fourier armónicos |

---

## Reglas del proyecto (INVIOLABLES)

1. **Todo el texto visible al usuario va en español con tildes correctas**
2. **Sin bordes redondeados** — `rounded-none` en todos los componentes
3. **Números siempre en `font-mono tabular-nums`**
4. **Error boundaries en cada panel** — un crash no rompe todo el dashboard
5. **El FFT corre en el main thread** — para N=8192 toma <5ms, no usar Web Workers
6. **No agregar dependencias sin justificar** — el bundle ya es grande
7. **No hay backend** — todo client-side, CoinGecko es la única API externa
8. **El toggle de armónicos Fourier NO recorre el FFT** — solo recalcula la reconstrucción
9. **Los datos bundled son el fallback** — si CoinGecko falla, el dashboard igual funciona
10. **Leer TASK.md al inicio de cada sesión** para ver el estado actual
11. **Preguntar qué cuenta de GitHub usar** antes de crear repos o hacer push
12. **Actualizar CHANGELOG.md antes de cada push** — agregar una entrada con la fecha, los cambios realizados y la categoría (Agregado / Corregido / Cambiado / Eliminado)

---

## Errores documentados (NO repetir)

| Error | Solución |
|-------|----------|
| TypeScript `enum` con `erasableSyntaxOnly: true` | Usar `const obj = {} as const` + `type T = ...` |
| lightweight-charts v5 `getSeries()` no existe | Usar `useRef<ISeriesApi[]>` + `chart.removeSeries(s)` |
| `lineWidth: 1.5` en lightweight-charts v5 | Usar `lineWidth: 1 as 1` o `lineWidth: 2 as 2` |
| `crosshair.vertLine.width` en CHART_THEME | Remover `crosshair` del CHART_THEME compartido |
| Canvas DPR: escala acumulada en resize | Chequear si el tamaño cambió antes de re-escalar |
| `ctx.shadowBlur` en path con 1400+ puntos | Freeze por frame — usar double-stroke en su lugar |
| `ctx.clip()` sin `ctx.beginPath()` previo | Path acumulado corrompe el clip — siempre `beginPath()` antes |
| Fourier startTs desde GENESIS+201 días | Usar `residuals.timestamps[i]` para historial, `lastRealTs+i*86400` para forecast |

---

## DataStatus

```ts
type DataStatus = 'loading' | 'partial' | 'cached' | 'ready' | 'error'
// 'cached'  → leyó de localStorage (muestra "Caché (5min)")
// 'ready'   → fetch live exitoso (muestra "En vivo")
// 'partial' → solo datos bundled (muestra "Solo histórico")
```

---

## Zoom interactivo (PowerLawCanvas)

- **Scroll wheel**: zoom in/out centrado en el mouse, en escala logarítmica
- **Drag**: pan (arrastrar para mover)
- **Doble clic**: resetear a vista completa
- **Botón "Restablecer"**: aparece cuando hay zoom activo
- Límites: dayRange [0.0003, 5] en log10, priceRange [0.005, 12] en log10

---

*CLAUDE.md v2.0 — 2026-04-07 — Zoom interactivo + canvas bug fixed + repo iadanclawdbot*

# Bitcoin Power Law Dashboard — CLAUDE.md
> Briefing permanente. Leer antes de cada sesion.

---

## Que es este proyecto

Dashboard web educativo sobre la **Ley de Potencia (Power Law) de Bitcoin**. Pensado para un canal de YouTube: todo explicado en espanol simple, sin jerga matematica, con graficos interactivos. Corre 100% en el browser (sin backend). El usuario final no sabe matematicas; el modelo matematico es el core, pero la UX es lo que lo hace valioso.

---

## Decisiones confirmadas (no volver a preguntar)

| Tema | Decision |
|------|----------|
| Framework | React 18 + TypeScript + Vite |
| Estilos | Tailwind CSS 3 (tema terminal oscuro, rounded-none) |
| Charts | lightweight-charts v5 para residuos y Fourier; Canvas 2D custom para Power Law |
| Icons | lucide-react |
| State | React Context + useMemo (sin zustand/jotai) |
| Datos bundled | TypeScript array en `src/data/btc-historical.ts` |
| Datos live | CoinGecko free API, polling 60s/5min |
| FFT | Cooley-Tukey radix-2 custom en TypeScript (~60 lineas), main thread |
| Routing | Ninguno (single-view, panel swap con estado local) |
| Cache | localStorage con TTL 5min para CoinGecko |
| Backend | NO hay backend, todo client-side |
| Idioma | Todo en espanol con tildes correctas |
| Font | JetBrains Mono (Google Fonts) |

---

## Stack tecnico

```
React 18 + TypeScript 5 + Vite 5
Tailwind CSS 3 (tema terminal)
lightweight-charts v5 (TradingView OSS)
lucide-react
```

**Sin**: routing, state manager externo, backend, autenticacion, base de datos.

---

## Estructura de carpetas

```
trading-analisis-bitcoin/
├── CLAUDE.md                    # Este archivo
├── TASK.md                      # Checklist vivo de tareas
├── index.html                   # lang=es, JetBrains Mono
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── .gitignore
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css                # Tailwind + scrollbar + selection
    ├── vite-env.d.ts
    ├── types/                   # price.ts, regression.ts, fourier.ts, market.ts, ui.ts
    ├── constants/               # theme.ts, bitcoin.ts, api.ts, math.ts
    ├── data/
    │   └── btc-historical.ts    # ~5500 entries [timestamp_ms, price][]
    ├── lib/
    │   ├── math/                # regression.ts, fft.ts, fourier-analysis.ts, ...
    │   ├── data/                # coingecko.ts, merge.ts, cache.ts
    │   └── canvas/              # power-law-renderer.ts, axis-utils.ts, interaction.ts
    ├── hooks/                   # useBtcData, usePowerLaw, useResiduals, useFourier, ...
    ├── context/                 # DashboardContext.ts, DashboardProvider.tsx
    └── components/
        ├── layout/              # AppShell, Header, Sidebar, MainPanel, BottomPanels, PanelContainer
        ├── panels/              # PowerLawPanel, ResidualsPanel, FourierPanel, MarketCyclesPanel
        ├── charts/              # PowerLawCanvas, ResidualsChart, FourierChart, CyclesTimeline
        ├── sidebar/             # MetricCard, SignalGauge, PhaseIndicator
        ├── shared/              # Modal, ErrorBoundary, LoadingSpinner, Badge
        └── educational/         # content.ts, WhatIsThisButton, EducationalModal
```

---

## Archivos clave por funcion

| Si necesito... | Leer... |
|----------------|---------|
| Agregar o cambiar una metrica en el sidebar | `src/components/sidebar/MetricCard.tsx` + `src/context/DashboardProvider.tsx` |
| Cambiar la logica de Buy/Sell/Hold | `src/lib/math/signal.ts` |
| Cambiar la regresion power law | `src/lib/math/regression.ts` |
| Cambiar el FFT | `src/lib/math/fft.ts` + `src/lib/math/fourier-analysis.ts` |
| Agregar un nuevo panel | `src/components/panels/` + `src/hooks/usePanelLayout.ts` + `src/types/ui.ts` |
| Editar textos educativos | `src/components/educational/content.ts` |
| Cambiar colores del tema | `src/constants/theme.ts` + `tailwind.config.ts` |
| Cambiar fuente de datos historicos | `src/data/btc-historical.ts` + `src/lib/data/merge.ts` |
| Editar el grafico power law (canvas) | `src/lib/canvas/power-law-renderer.ts` |
| Editar grafico residuos/fourier | `src/components/charts/ResidualsChart.tsx` / `FourierChart.tsx` |
| Agregar constante de Bitcoin | `src/constants/bitcoin.ts` |
| Cambiar intervalos de polling | `src/constants/api.ts` |

---

## Comandos principales

```bash
npm run dev          # Dev server (http://localhost:5173)
npm run build        # Build produccion
npm run preview      # Preview del build
```

---

## Colores del tema (hardcoded en tailwind.config.ts)

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
| `btc-blue` | `#3b82f6` | Soporte / Acumulacion |
| `btc-violet` | `#8b5cf6` | Fourier armonicos |

---

## Reglas del proyecto (INVIOLABLES)

1. **Todo el texto visible al usuario va en espanol con tildes correctas**
2. **Sin bordes redondeados** — `rounded-none` en todos los componentes
3. **Numeros siempre en `font-mono tabular-nums`**
4. **Error boundaries en cada panel** — un crash no rompe todo el dashboard
5. **El FFT corre en el main thread** — para N=8192 toma <5ms, no usar Web Workers
6. **No agregar dependencias sin justificar** — el bundle ya es grande con los datos bundled
7. **No hay backend** — todo client-side, CoinGecko es la unica API externa
8. **El toggle de armonicos Fourier NO recorre el FFT** — solo recalcula la reconstruccion
9. **Los datos bundled son el fallback** — si CoinGecko falla, el dashboard igual funciona
10. **Leer TASK.md al inicio de cada sesion** para ver el estado actual

---

## Constantes hardcodeadas clave

```typescript
GENESIS_DATE = "2009-01-03"
HALVINGS = ["2012-11-28", "2016-07-09", "2020-05-11", "2024-04-20"]
BUBBLE_PEAKS = [{date:"2011-06-08",price:31.9}, {date:"2013-11-29",price:1147},
                {date:"2017-12-17",price:19783}, {date:"2021-11-10",price:69000}]
BEAR_BOTTOMS = [{date:"2011-11-18",price:2.01}, {date:"2015-01-14",price:178},
                {date:"2018-12-15",price:3236}, {date:"2022-11-21",price:15787}]
```

---

## Estado actual

| Componente | Estado | Verificado |
|------------|--------|------------|
| Scaffolding | ⬜ Por hacer | No |
| Datos bundled | ⬜ Por hacer | No |
| Motor matematico | ⬜ Por hacer | No |
| Charts | ⬜ Por hacer | No |
| Layout | ⬜ Por hacer | No |
| Educativo | ⬜ Por hacer | No |

---

*CLAUDE.md v1.0 — 2026-04-07*

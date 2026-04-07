# TASK.md — Bitcoin Power Law Dashboard
> Documento vivo. Leer al inicio de cada sesión. Actualizar al completar tareas.

---

## Estado del sistema

| Componente | Estado | Verificado |
|------------|--------|------------|
| Scaffolding (Vite + React 19 + TS + Tailwind) | ✅ Listo | `npm run build` OK |
| Datos bundled (`btc-historical.ts`) | ✅ Listo | ~1400 puntos (blockchain.info) |
| CoinGecko API client | ✅ Listo | Retry + timeout |
| Merge + cache | ✅ Listo | localStorage 5min TTL |
| Regresión OLS (Power Law) | ✅ Listo | ~R²=0.96, exp~5.4 |
| FFT (Cooley-Tukey) | ✅ Listo | Float64Array in-place |
| Análisis Fourier (fases + señal) | ✅ Listo | Top 8 armónicos + proyección 730d |
| Canvas chart (log-log Power Law) | ✅ Listo | DPR, crosshair, tooltip |
| lightweight-charts (residuos + Fourier) | ✅ Listo | Histograma + línea |
| Layout + panel swapping | ✅ Listo | 55%/45% + expandir |
| Sidebar + MetricCards | ✅ Listo | Z-score, percentil, R², sigma |
| Capa educativa (modales) | ✅ Listo | 4 modales en español |
| `npm run build` sin errores | ✅ Listo | 435KB gzip ~142KB |
| `npm run dev` funciona | ✅ Listo | http://localhost:5173 |

---

## 🔴 BUGS CONOCIDOS / PENDIENTES INMEDIATOS

- [ ] El sidebar calcula fair value usando el último punto de datos — verificar que funciona con precio live
- [ ] El FourierPanel muestra "Ejecutando análisis..." pero el loader no desaparece en algunos casos — revisar dependency del hook
- [ ] Los colores de las barras del histograma de residuos usan string hex + hexAlpha que puede generar colores inválidos — revisar
- [ ] La timeline de fases en MarketCyclesPanel puede quedar muy pequeña si hay muchos segmentos — limitar a últimos 100 segmentos

---

## 🟠 CORTO PLAZO — Mejoras visuales

- [ ] Agregar `.gitignore` con `dist/` y `node_modules/`
- [ ] Verificar que el canvas Power Law se renderiza bien en pantalla completa (swap al panel principal)
- [ ] Agregar tooltip con `dayIndex` en el canvas para debug
- [ ] Agregar animación suave al swap de paneles (transition)
- [ ] Header: el badge de señal debería animarse cuando cambia
- [ ] Panel de ciclos: ordenar eventos históricos por fecha

---

## 🔵 MEDIANO PLAZO — Features

- [ ] Deploy a Coolify (Dockerfile o dist estático)
- [ ] Agregar más datos históricos (CoinGecko history endpoint para pre-2020)
- [ ] Exportar imagen del gráfico Power Law (canvas.toBlob)
- [ ] Compartir URL con estado de panels (query params)
- [ ] Modo dark/light toggle (ya es dark, agregar light)
- [ ] i18n: inglés como opción secundaria

---

## 🟢 LIMPIEZA — Baja prioridad

- [ ] Tests unitarios para `regression.ts`, `fft.ts`, `merge.ts`
- [ ] `React.memo` en componentes pesados
- [ ] Eliminar console.logs de desarrollo
- [ ] ESLint warnings cleanup
- [ ] Storybook para components UI

---

## ✅ COMPLETADO

- [x] CLAUDE.md creado (2026-04-07)
- [x] TASK.md creado (2026-04-07)
- [x] Scaffolding Vite + React 19 + TypeScript + Tailwind 3 (2026-04-07)
- [x] `src/data/btc-historical.ts` con ~1400 puntos desde 2009 (2026-04-07)
- [x] Motor matemático completo: OLS, FFT Cooley-Tukey, fases, señales (2026-04-07)
- [x] 4 paneles: Canvas log-log, Residuos (lightweight-charts), Fourier, Ciclos (2026-04-07)
- [x] Layout CSS Grid con panel swapping (55%/45%) (2026-04-07)
- [x] Sidebar con MetricCards en vivo (2026-04-07)
- [x] Modales educativos en español para 4 secciones (2026-04-07)
- [x] CoinGecko live data + polling 60s + cache localStorage (2026-04-07)
- [x] `npm run build` limpio (435KB, gzip 142KB) (2026-04-07)
- [x] Git init + commit inicial (2026-04-07)

---

## 🚫 NO REPETIR — Errores documentados

| Error | Qué pasó | Regla |
|-------|----------|-------|
| TypeScript `enum` con `erasableSyntaxOnly: true` | Vite 6 + TS 5.8 no permite `enum` — genera error 1294 | Usar `const obj = {} as const` + `type T = (typeof obj)[keyof typeof obj]` |
| lightweight-charts v5 `getSeries()` no existe | API v5 no tiene este método; guardar refs a las series | Usar `useRef<ISeriesApi[]>` y limpiar con `chart.removeSeries(s)` |
| `lineWidth: 1.5` en lightweight-charts v5 | El tipo es `LineWidth = 1 | 2 | 3 | 4 | 5`, no float | Usar `lineWidth: 1 as 1` o `lineWidth: 2 as 2` |
| `crosshair.vertLine.width` en CHART_THEME | Es `LineWidth`, no `number` — incompatible | Remover `crosshair` de CHART_THEME y dejarlo en default |
| Canvas DPR: escala incorrecta después de resize | `ctx.scale(dpr, dpr)` se acumula con cada resize | Chequear si el tamaño cambió antes de re-escalar |

---

*TASK.md v1.1 — 2026-04-07 — Leer al inicio de cada sesión*

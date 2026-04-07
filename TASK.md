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
| Canvas chart (log-log Power Law) | ✅ Listo | Zoom/pan/reset + ejes adaptativos |
| lightweight-charts (residuos + Fourier) | ✅ Listo | fitContent() + sin logo TradingView |
| Layout + panel swapping | ✅ Listo | toggle funciona (clic main = volver default) |
| Sidebar + MetricCards | ✅ Listo | Z-score, percentil, R², sigma |
| Capa educativa (modales) | ✅ Listo | 4 modales en español |
| `npm run build` sin errores | ✅ Listo | ~439KB gzip ~143KB |
| `npm run dev` funciona | ✅ Listo | http://localhost:5173 |
| Git + GitHub | ✅ Listo | repo: iadanclawdbot/trading-analisis-bitcoin |

---

## ✅ BUGS CORREGIDOS — Sesión QA 2026-04-07

| Bug | Archivo | Fix |
|-----|---------|-----|
| Panel swap no revierte | `usePanelLayout.ts:14` | `return DEFAULT_LAYOUT` → toggle |
| Fourier solo muestra 6 meses | `FourierChart.tsx`, `ResidualsChart.tsx` | `fitContent()` al final del useEffect |
| "En vivo" mentiroso con cache | `types/ui.ts`, `useBtcData.ts`, `Header.tsx` | Nuevo status `'cached'` → "Caché (5min)" |
| HOLD vs Distribución contradictorios | `signal.ts:60-79` | Reglas para Distribution(z>0)→SELL y Bearish(z<0)→BUY |
| Fourier empieza en 2009 | `FourierChart.tsx` | Usar `residuals.timestamps[i]` en lugar de `GENESIS+201días` |
| Fourier se corta en 2016 | `FourierChart.tsx` | Forecast desde `lastRealTs+i*86400` |

## ✅ BUGS CORREGIDOS — Sesión 2026-04-07 (cont.)

| Bug | Archivo | Fix |
|-----|---------|-----|
| Canvas lower-left invisible | `power-law-renderer.ts:90` | `ctx.beginPath()` antes de `ctx.rect()` para el clip — path acumulado corrompía la región de recorte |
| Logo TradingView visible | `constants/theme.ts` | `attributionLogo: false` en CHART_THEME |

---

## ✅ FEATURES AGREGADAS — Sesión 2026-04-07

| Feature | Archivos | Descripción |
|---------|----------|-------------|
| Zoom interactivo Power Law | `PowerLawCanvas.tsx` | Scroll = zoom centrado en mouse (log-log), drag = pan, doble clic = reset |
| Ejes adaptativos | `axis-utils.ts` | Años → meses → semanas → días según nivel de zoom |
| Anti-overlap labels | `power-law-renderer.ts` | Labels del eje X/Y se saltan si están a < 50/18px |
| Ticks de precio adaptativos | `axis-utils.ts` | Multipliers finos + ticks lineales para rangos estrechos |

---

## 🟠 PENDIENTES — Mejoras visuales

- [ ] Deploy a Vercel (conectar repo `iadanclawdbot/trading-analisis-bitcoin`)
- [ ] Verificar que el canvas Power Law se renderiza bien en pantalla completa (swap al panel principal)
- [ ] Agregar animación suave al swap de paneles (transition)
- [ ] Header: el badge de señal debería animarse cuando cambia
- [ ] Panel de ciclos: ordenar eventos históricos por fecha
- [ ] Tooltip en canvas: mostrar dayIndex para debug (opcional)

---

## 🔵 MEDIANO PLAZO — Features

- [ ] Exportar imagen del gráfico Power Law (canvas.toBlob)
- [ ] Compartir URL con estado de panels (query params)
- [ ] Agregar más datos históricos (CoinGecko history endpoint para pre-2020)
- [ ] Modo dark/light toggle

---

## 🟢 LIMPIEZA — Baja prioridad

- [ ] Tests unitarios para `regression.ts`, `fft.ts`, `merge.ts`
- [ ] `React.memo` en componentes pesados
- [ ] Eliminar console.logs de desarrollo
- [ ] ESLint warnings cleanup

---

## 🚫 NO REPETIR — Errores documentados

| Error | Qué pasó | Regla |
|-------|----------|-------|
| TypeScript `enum` con `erasableSyntaxOnly: true` | Vite 6 + TS 5.8 no permite `enum` | Usar `const obj = {} as const` + `type T = ...` |
| lightweight-charts v5 `getSeries()` no existe | API v5 no tiene este método | Usar `useRef<ISeriesApi[]>` + `chart.removeSeries(s)` |
| `lineWidth: 1.5` en lightweight-charts v5 | El tipo es `LineWidth = 1\|2\|3\|4\|5` | Usar `lineWidth: 1 as 1` o `lineWidth: 2 as 2` |
| `ctx.shadowBlur` en path complejo (1400+ puntos) | Freeze en cada mouse move | NUNCA usar shadowBlur en paths con muchos puntos; double-stroke |
| Canvas DPR: escala acumulada en resize | `ctx.scale(dpr,dpr)` solo al cambiar tamaño | Ya implementado en `useCanvasChart.ts` |
| `ctx.clip()` sin `ctx.beginPath()` previo | Path acumulado de renders anteriores corrompía el clip | Siempre `ctx.beginPath()` antes de `ctx.rect()` + `ctx.clip()` |
| Fourier startTs desde GENESIS+201 días | Reconstrucción aparecía en 2009 y cortaba en 2016 | Usar `residuals.timestamps[i]` para historial |
| Crear repo sin preguntar la cuenta | Repo creado en cuenta equivocada | Siempre preguntar qué cuenta usar antes de hacer push/crear repo |

---

*TASK.md v3.0 — 2026-04-07 — Zoom interactivo + bugs canvas corregidos + repo en iadanclawdbot*

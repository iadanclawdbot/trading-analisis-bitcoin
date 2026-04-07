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
| Canvas chart (log-log Power Law) | ⚠️ Bug pendiente | lower-left invisible (ver abajo) |
| lightweight-charts (residuos + Fourier) | ✅ Listo | fitContent() corregido |
| Layout + panel swapping | ✅ Listo | toggle funciona (clic main = volver default) |
| Sidebar + MetricCards | ✅ Listo | Z-score, percentil, R², sigma |
| Capa educativa (modales) | ✅ Listo | 4 modales en español |
| `npm run build` sin errores | ✅ Listo | 435KB gzip ~142KB |
| `npm run dev` funciona | ✅ Listo | http://localhost:5173 |

---

## 🔴 BUG CRÍTICO PENDIENTE — Power Law Canvas lower-left

**Síntoma:** En el gráfico Power Law (log-log), la zona inferior izquierda (2010-2013, precios $0.07-$100) no se ve a zoom normal del browser, pero SÍ se ve cuando el browser está zoomeado (Ctrl+=). Las bandas (soporte/resistencia/fair value) y la línea naranja de precio también desaparecen en esa zona.

**Comportamiento exacto verificado:**
- Screenshot normal: datos visibles solo desde ~2013 en adelante
- Screenshot zoomeado: datos visibles desde ~2010 (left edge del chart)
- Afecta tanto a las BANDAS como a la línea de PRECIO → no es solo la línea naranja
- El tooltip/crosshair SÍ funciona en el área → los datos están ahí, solo son invisibles

**Causa raíz NO encontrada todavía.** Lo que se descartó:
- No es un clip issue de Y coordinates (la matemática confirma que y < height-50 para todos los puntos early)
- No es el minDay incorrecto (min(days)=592 > 201, el Math.max era redundante)
- No es el shadowBlur (ya removido, era performance issue separado)
- Podría ser: DPR scale acumulación, canvas state entre renders, o algo en cómo lightweight-charts resiza

**Archivos clave:** `src/lib/canvas/power-law-renderer.ts` (getDefaultTransform, renderPowerLaw) + `src/hooks/useCanvasChart.ts`

**Lo que ya se intentó:**
- Cambiar `minDay = Math.max(201, Math.min(...days))` → `Math.min(...days)` (no cambió nada, min es 592)
- Double-stroke para la línea de precio (lineWidth 5px transparente + 2px sólido) — mejora visibilidad pero no resuelve el corte
- Agregar shadowBlur=4 → removido (causaba lag/freeze en cada mouse move)

**Próximo paso sugerido:** Agregar `console.log` de los valores de transform (minDay, maxDay, minPrice, maxPrice, width, height) en `renderPowerLaw` para ver en runtime qué valores usa el chart en ambos casos (zoom normal vs browser zoom).

---

## ✅ BUGS CORREGIDOS EN SESIÓN 2026-04-07 (QA Report)

| Bug | Archivo | Fix |
|-----|---------|-----|
| Panel swap no revierte | `usePanelLayout.ts:14` | `return DEFAULT_LAYOUT` en vez de `return prev` → toggle |
| Fourier solo muestra 6 meses | `FourierChart.tsx`, `ResidualsChart.tsx` | `chart.timeScale().fitContent()` al final del useEffect de datos |
| "En vivo" mentiroso con cache | `types/ui.ts`, `useBtcData.ts`, `Header.tsx` | Nuevo status `'cached'` → muestra "Caché (5min)" |
| HOLD vs Distribución contradictorios | `signal.ts:60-79` | Nuevas reglas para Distribution(z>0) → SELL y Bearish(z<0) → BUY con confianza baja |
| Fourier empieza en 2009 (antes de BTC) | `FourierChart.tsx` | Usar `residuals.timestamps[i]` en lugar de `GENESIS+201días` |
| Fourier se corta en 2016 | `FourierChart.tsx` | Forecast desde `residuals.timestamps[last]` diariamente → extiende a 2028 |

---

## 🟠 PENDIENTES — Mejoras visuales

- [ ] Agregar `.gitignore` con `dist/` y `node_modules/`
- [ ] Verificar que el canvas Power Law se renderiza bien en pantalla completa (swap al panel principal)
- [ ] Agregar animación suave al swap de paneles (transition)
- [ ] Header: el badge de señal debería animarse cuando cambia
- [ ] Panel de ciclos: ordenar eventos históricos por fecha
- [ ] Tooltip en canvas: mostrar dayIndex para debug

---

## 🔵 MEDIANO PLAZO — Features

- [ ] Deploy a Coolify (Dockerfile o dist estático)
- [ ] Agregar más datos históricos (CoinGecko history endpoint para pre-2020)
- [ ] Exportar imagen del gráfico Power Law (canvas.toBlob)
- [ ] Compartir URL con estado de panels (query params)
- [ ] Modo dark/light toggle (ya es dark, agregar light)

---

## 🟢 LIMPIEZA — Baja prioridad

- [ ] Tests unitarios para `regression.ts`, `fft.ts`, `merge.ts`
- [ ] `React.memo` en componentes pesados
- [ ] Eliminar console.logs de desarrollo
- [ ] ESLint warnings cleanup

---

## ✅ COMPLETADO (histórico)

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
- [x] QA report: 6 bugs corregidos (2026-04-07)

---

## 🚫 NO REPETIR — Errores documentados

| Error | Qué pasó | Regla |
|-------|----------|-------|
| TypeScript `enum` con `erasableSyntaxOnly: true` | Vite 6 + TS 5.8 no permite `enum` — genera error 1294 | Usar `const obj = {} as const` + `type T = (typeof obj)[keyof typeof obj]` |
| lightweight-charts v5 `getSeries()` no existe | API v5 no tiene este método; guardar refs a las series | Usar `useRef<ISeriesApi[]>` y limpiar con `chart.removeSeries(s)` |
| `lineWidth: 1.5` en lightweight-charts v5 | El tipo es `LineWidth = 1 \| 2 \| 3 \| 4 \| 5`, no float | Usar `lineWidth: 1 as 1` o `lineWidth: 2 as 2` |
| `crosshair.vertLine.width` en CHART_THEME | Es `LineWidth`, no `number` — incompatible | Remover `crosshair` de CHART_THEME y dejarlo en default |
| Canvas DPR: escala acumulada en resize | `ctx.scale(dpr, dpr)` se acumula con cada resize | Chequear si el tamaño cambió antes de re-escalar (ya implementado en useCanvasChart.ts) |
| `ctx.shadowBlur` en path complejo (1400+ puntos) | Freeze en cada mouse move — re-render con blur por frame | NUNCA usar shadowBlur en paths con muchos puntos; usar double-stroke en su lugar |
| Fourier startTs desde GENESIS+201 días | La reconstrucción aparecía en 2009 y se cortaba en 2016 | Usar `residuals.timestamps[i]` para historial y `timestamps[last]+i*86400` para forecast |

---

*TASK.md v2.0 — 2026-04-07 — Post sesión QA*

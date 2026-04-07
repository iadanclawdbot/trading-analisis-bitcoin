# Bitcoin Power Law Dashboard

Dashboard web educativo sobre la **Ley de Potencia de Bitcoin**. Muestra el modelo matemático de regresión log-log, análisis de Fourier de ciclos, y señales de trading basadas en z-score.

Pensado para un canal de YouTube: todo en español, sin jerga matemática, con gráficos interactivos.

## Stack

```
React 19 + TypeScript 5 + Vite 6
Tailwind CSS 3 (tema terminal oscuro)
lightweight-charts v5 (residuos y Fourier)
Canvas 2D custom (gráfico Power Law log-log)
```

Sin backend. Todo client-side. CoinGecko free API para datos en vivo.

## Características

- **Gráfico Power Law (log-log)** con zoom interactivo (scroll), pan (drag), reset (doble clic)
- **Ejes adaptativos** al nivel de zoom: años → meses → semanas → días
- **Análisis de Fourier** con reconstrucción de ciclos y proyección a 730 días
- **Señal de trading** en tiempo real (COMPRA / HOLD / VENTA) con z-score y percentil
- **4 paneles** intercambiables: Power Law, Residuos, Fourier, Ciclos históricos
- **Modales educativos** en español para cada sección
- **Cache localStorage** 5 min con indicador de estado (En vivo / Caché / Solo histórico)

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build producción
npm run preview   # preview del build
```

## Deploy

Vercel detecta Vite automáticamente. Conectar el repo y deployar sin configuración adicional.

Repo: https://github.com/iadanclawdbot/trading-analisis-bitcoin

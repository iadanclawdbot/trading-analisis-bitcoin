export interface EducationalContent {
  title: string
  sections: { heading?: string; text: string }[]
  disclaimer?: string
}

export const EDUCATIONAL_CONTENT: Record<string, EducationalContent> = {
  'power-law': {
    title: '¿Qué es la Ley de Potencia?',
    sections: [
      {
        text: 'La Ley de Potencia es un patrón matemático que aparece en la naturaleza y en la economía: el tamaño de las ciudades, la energía de los terremotos, la popularidad de las canciones... todos siguen este patrón.',
      },
      {
        heading: '¿Cómo funciona en Bitcoin?',
        text: 'El precio de Bitcoin ha crecido siguiendo este patrón desde 2009. En el gráfico de la izquierda, ambos ejes son logarítmicos — eso hace que la Ley de Potencia se vea como una línea recta. Si el precio se aleja mucho de esa línea, tiende a volver.',
      },
      {
        heading: 'Las bandas de color',
        text: 'La línea verde es el "precio justo" según el modelo. La banda azul (abajo) es el soporte histórico. La banda roja (arriba) es la resistencia histórica. Cuando el precio está cerca de la banda azul, históricamente ha sido buen momento para acumular.',
      },
      {
        heading: '¿Qué significa R²?',
        text: 'El R² mide qué tan bien el modelo explica el precio. Un valor de 0.96 significa que el 96% de los movimientos de precio histórico están explicados por este simple patrón matemático.',
      },
    ],
    disclaimer:
      'IMPORTANTE: Este es un modelo matemático basado en datos históricos. No predice el futuro con certeza. No es asesoramiento financiero.',
  },

  residuals: {
    title: '¿Qué son los Residuos?',
    sections: [
      {
        text: 'Los residuos son la "distancia" entre el precio real de Bitcoin y el precio que predice el modelo. Si el residuo es positivo, Bitcoin está caro respecto al modelo. Si es negativo, está barato.',
      },
      {
        heading: '¿Qué es el Z-Score?',
        text: 'El Z-Score es una forma de medir qué tan lejos estamos de la media, medido en "desviaciones estándar" (sigma). Un Z-Score de +2 significa que estamos en territorio de burbuja. Un Z-Score de -2 significa que estamos en territorio de oportunidad histórica.',
      },
      {
        heading: 'Las barras del gráfico',
        text: 'Las barras naranjas significan que el precio está por encima del modelo (caro). Las barras azules significan que está por debajo (barato). Las líneas punteadas marcan los límites de ±2 sigma — solo el 5% del tiempo el precio ha estado fuera de esas bandas.',
      },
    ],
    disclaimer:
      'IMPORTANTE: Que el precio esté "barato" según el modelo no garantiza que vaya a subir. Los modelos matemáticos no son bolas de cristal.',
  },

  fourier: {
    title: '¿Qué es el Análisis de Fourier?',
    sections: [
      {
        text: 'El Análisis de Fourier es una técnica matemática que descompone una señal compleja en ondas simples, como descomponer una canción en notas musicales individuales.',
      },
      {
        heading: '¿Cómo se aplica a Bitcoin?',
        text: 'Tomamos los residuos (las desviaciones del modelo) y los descomponemos en ciclos. El ciclo más importante suele ser de aproximadamente 4 años — el famoso ciclo del halving de Bitcoin.',
      },
      {
        heading: 'Los 8 armónicos',
        text: 'El "Fundamental" es el ciclo principal (~4 años). Los armónicos son ciclos más cortos que se superponen. Puedes activar y desactivar cada uno con los botones de colores para ver cómo contribuye a la señal total.',
      },
      {
        heading: 'La línea verde punteada',
        text: 'Es el forecast — una proyección de cómo seguirían estos ciclos en los próximos 2 años si el pasado se repite. Es especulativo pero sirve como referencia.',
      },
    ],
    disclaimer:
      'IMPORTANTE: Los ciclos del pasado no garantizan que se repitan en el futuro. El halving afecta al precio, pero no es el único factor.',
  },

  'market-cycles': {
    title: '¿Cómo funciona el Pronóstico de Ciclos?',
    sections: [
      {
        text: 'El pronóstico combina dos cosas: la tendencia a largo plazo (Ley de Potencia) y los ciclos detectados por Fourier. La idea es que Bitcoin repite patrones cíclicos alrededor de su tendencia de crecimiento.',
      },
      {
        heading: 'Las 4 fases del mercado',
        text: '• ACUMULACIÓN (azul): precio bajo, tendencia que empieza a subir\n• ALCISTA (verde): precio subiendo con momentum positivo\n• DISTRIBUCIÓN (naranja): precio alto, momentum perdiendo fuerza\n• BAJISTA (rojo): precio cayendo',
      },
      {
        heading: '¿Cómo se detectan las fases?',
        text: 'Se analiza la señal reconstruida de Fourier y su derivada (velocidad de cambio). Si la señal es positiva y sube → alcista. Si es positiva y baja → distribución. Si es negativa y baja → bajista. Si es negativa y sube → acumulación.',
      },
      {
        heading: 'El pronóstico del próximo pico',
        text: 'Se extrapolan los ciclos de Fourier hacia adelante y se calcula cuándo la señal reconstruida alcanza su próximo máximo. El precio estimado combina ese momento con el valor justo de la Ley de Potencia.',
      },
    ],
    disclaimer:
      'IMPORTANTE: Este pronóstico es altamente especulativo. Los ciclos pueden cambiar. El mercado puede superar o quedarse muy por debajo de cualquier estimación.',
  },
}

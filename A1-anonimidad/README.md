# A1. Medida de anonimidad de usuarios en OTTs

Este módulo contiene el desarrollo técnico y las métricas diseñadas para cuantificar la anonimidad efectiva de los usuarios en servicios Over-The-Top (OTT).

## Descripción de la Solución
Se implementan metodologías para medir el grado de protección de la identidad del usuario frente a la recopilación de datos en plataformas de streaming y contenido digital. La solución permite evaluar si las señales enviadas por los dispositivos permiten la re-identificación individual.

## Contenido
- `src/`: Algoritmos de cálculo de métricas de anonimidad.
- `datasets/`: Conjuntos de datos utilizados para la validación de las métricas.
- `docs/`: Reporte técnico detallado de la metodología de medición, dividido en:
  - `docs/analysis/`
  - `docs/theory_part/`

## Origen del material integrado
Este módulo se ha integrado desde `probabilistic_k_anonymity_extension_material` con el siguiente mapeo:

- `probabilistic_k_anonymity_extension_material/src` -> `A1-anonimidad/src`
- `probabilistic_k_anonymity_extension_material/data` -> `A1-anonimidad/datasets`
- `probabilistic_k_anonymity_extension_material/analysis` -> `A1-anonimidad/docs/analysis`
- `probabilistic_k_anonymity_extension_material/theory_part` -> `A1-anonimidad/docs/theory_part`

## Reproducibilidad
Las dependencias y comandos de ejecucion dependen de los scripts concretos incluidos en `src/`. Como regla general:

1. Revisar requisitos de cada script en su cabecera o documentacion local.
2. Ejecutar los scripts de `src/` sobre los datos de `datasets/`.
3. Contrastar resultados con la documentacion de `docs/analysis` y `docs/theory_part`.

---
**Financiación:** Proyecto ANTICIPA (UC3M-IBIDAT). Financiado con cargo a los fondos del Plan de Recuperación, Transformación y Resiliencia, financiado por la Unión Europea – NextGenerationEU a través de INCIBE (Convenio C111.23).

# ANTICIPA: Análisis y mitigación de riesgos de seguridad y privacidad asociados a la explotación de datos personales en OTTs

![Financiado por la Unión Europea - NextGenerationEU](https://img.shields.io/badge/Financiado%20por-NextGenerationEU-blue)
![Plan de Recuperación](https://img.shields.io/badge/Plan%20de%20Recuperación-PRTR-green)

Este repositorio contiene las soluciones técnicas desarrolladas por la **Universidad Carlos III de Madrid (UC3M-IBiDat)** en el marco del convenio de colaboración suscrito con el **Instituto Nacional de Ciberseguridad (INCIBE)** (Convenio C111.23).

## 🇪🇺 Marco Institucional y Financiación
El proyecto **ANTICIPA** se integra en el *Programa Global de Innovación en Seguridad* y se alinea con el **Plan de Recuperación, Transformación y Resiliencia (PRTR)**, Componente 15, Inversión 7. El objetivo es el fortalecimiento de las capacidades de ciberseguridad en España y el impulso del sector mediante el desarrollo de soluciones de alto valor añadido.

---

## Descripción del Proyecto
ANTICIPA aborda los riesgos derivados de la explotación intensiva de datos personales en plataformas digitales (servicios OTT). El proyecto investiga problemas de pérdida de anonimidad, unicidad explotable, sobreperfilado y seguimiento no transparente, proporcionando herramientas y métricas para reguladores, empresas y ciudadanía.

### Soluciones Desarrolladas
Este repositorio se organiza en cuatro líneas de trabajo principales:

* **[A1. Medida de anonimidad](./A1-anonimidad):** Métricas y metodologías para cuantificar la anonimidad efectiva en ecosistemas digitales reales.
* **[A2. Unicidad y Ataques Hiper-personalizados](./A2-unicidad):** Estudio de la singularización de usuarios y su explotación en escenarios de segmentación precisa.
* **[A3. Sobreperfilado de usuarios](./A3-sobreperfilado):** Análisis del exceso de atributos e intereses asignados bajo el principio de minimización de datos.
* **[A4. Fingerprinting Avanzado](./A4-fingerprinting):** Evaluación de mecanismos de seguimiento e identificación no transparente.

---

## Estructura del Repositorio
Cada carpeta contiene el código fuente, la documentación técnica y las evidencias correspondientes a su actividad:

```text
ANTICIPA/
├── A1-anonimidad/       # Código y datasets de métricas de anonimidad
├── A2-unicidad/         # Metodología de ataques y análisis de unicidad
├── A3-sobreperfilado/   # Plugin y herramientas de análisis de perfiles
├── A4-fingerprinting/   # Píxel publicitario y add-on de detección
└── docs/                # Reportes técnicos generales del proyecto

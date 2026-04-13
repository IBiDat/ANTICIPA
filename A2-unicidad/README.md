# A2. Unicidad de usuarios y ataques con contenido hiper-personalizado

Investigación y herramientas para analizar cómo la singularización de usuarios en plataformas OTT puede ser explotada mediante segmentación extrema.

## Descripción de la Solución
Esta solución se centra en la unicidad: la propiedad que hace que un usuario sea distinguible entre millones. Se analiza la viabilidad de ataques basados en contenido hiper-personalizado que utilizan atributos específicos para identificar o manipular el comportamiento del usuario.

## Contenido
- `scripts/`: Herramientas de análisis de singularidad de atributos.
  - `scripts/scraper/`: Código del scraper de campañas y perfiles.
- `encuesta-web/`: Aplicación web de encuesta (Node.js, Express, PostgreSQL).
- `campaigns-anonymized/`: Datos de campañas anonimizados para analisis.

## Origen del material integrado
Este módulo se ha integrado a partir de:

- `nanotargeting-scraper` -> `A2-unicidad/scripts/scraper`
- `nanotargeting-web` -> `A2-unicidad/encuesta-web`
- `account_519145969_creative_performance_report.csv` -> `A2-unicidad/campaigns-anonymized/linkedin_campaign_performance_anonymized.csv`

## Anonimizacion aplicada a campañas
El fichero de campañas se ha transformado para permitir su comparticion en este repositorio:

- Eliminacion de identificadores directos:
  - `Nombre de la cuenta`
  - `ID de la campaña`
  - `ID del lote de anuncios`
  - `ID del anuncio`
  - `URL para clics`
- Pseudonimizacion por hash SHA-256 truncado (12 caracteres) de textos de campaña:
  - `Nombre de la campaña` -> `campaign_alias`
  - `Nombre del lote de anuncios` -> `adset_alias`
  - `Nombre del anuncio` -> `ad_alias`
  - `Texto de introducción al anuncio` -> `intro_alias`
  - `Título del anuncio` -> `title_alias`
  - `Línea del anuncio` -> `tagline_alias`
  - `Nombre DSC` -> `dsc_alias`

## Notas de uso
- Antes de despliegue, revisar credenciales y endpoints en todo el contenido de `scripts/` y `encuesta-web/`.

---
**Financiación:** Proyecto ANTICIPA (UC3M-IBIDAT). Financiado con cargo a los fondos del Plan de Recuperación, Transformación y Resiliencia, financiado por la Unión Europea – NextGenerationEU a través de INCIBE (Convenio C111.23).

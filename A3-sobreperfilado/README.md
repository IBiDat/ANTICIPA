# Análisis de Sobreperfilado en Grandes Plataformas de Internet

Este repositorio contiene el código fuente y las herramientas de análisis desarrolladas para el estudio del sobreperfilado (overprofiling) en servicios digitales, enmarcado en la **Actividad A3** del proyecto ANTICIPA.

El código se organiza en las siguientes áreas:
- **Interfaces de la extensión:** (en `./src`) Lógica de la interfaz de usuario.
- **Lógica de Background:** (en `./public`) Implementación del Service Worker para Manifest V3.
- **Notebooks de Análisis:** (en `./analysis`) Scripts en R para el procesamiento y visualización de los datos obtenidos.

## Extensión Disponible
La extensión desarrollada y utilizada para la toma de datos está disponible de forma pública en: 
[Chrome Web Store - Overprofiling](https://chromewebstore.google.com/detail/overprofiling/mnmnepgfknlklcegefknonnpdaafmgcb)

## Scripts Disponibles
En el directorio raíz del proyecto, puedes ejecutar:

- `./convertExtension.bat` o `./convertExtension`: Genera el despliegue de la extensión en el directorio `./dist`, lista para ser cargada en navegadores basados en Chromium.
- `npm start`: Inicia el entorno de desarrollo para la interfaz de usuario (UI) en el directorio `src`.

## Licencia y Publicaciones
Este código se distribuye bajo la licencia **CC BY 4.0**. Los resultados de este desarrollo forman parte del artículo científico *"Overprofiling Analysis on Major Internet Players"*.

---

**Financiación:**
Este trabajo forma parte del proyecto **ANTICIPA (UC3M-IBIDAT)**. Proyecto financiado con cargo a los fondos del Plan de Recuperación, Transformación y Resiliencia, financiado por la Unión Europea – NextGenerationEU a través de **INCIBE** (Convenio C111.23).

# ShieldF: Herramienta de Mitigación de Fingerprinting

**ShieldF** es una extensión de navegador (Manifest V3) desarrollada como parte de la **Actividad A4** del proyecto ANTICIPA. Su objetivo es reducir la superficie de identificación de los usuarios mediante la ofuscación de atributos del sistema, navegador y hardware.

## Funcionalidades Principales
La extensión actúa sobre varios vectores de *fingerprinting* detectados en servicios OTT:
- **Hardware & OS:** Ofuscación de `hardwareConcurrency`, `deviceMemory` y lenguajes del navegador.
- **Canvas Fingerprinting:** Generación de ruido aleatorio en las llamadas a `toDataURL` para evitar identificadores únicos basados en renderizado gráfico.
- **API Privacy:** Limitación de acceso a información de dispositivos de medios y estados de permisos.
- **WebGL:** Ofuscación de parámetros específicos de la tarjeta gráfica y driver.

## Instalación (Modo Desarrollador)
1. Descarga el contenido de esta carpeta.
2. Abre Chrome (o un navegador basado en Chromium) y ve a `chrome://extensions/`.
3. Activa el **"Modo de desarrollador"** (Developer mode).
4. Haz clic en **"Cargar descomprimida"** (Load unpacked) y selecciona esta carpeta.

## Estructura del Módulo
- `manifest.json`: Configuración de permisos y recursos de la extensión.
- `script.js`: Script de inyección que modifica los objetos globales de JavaScript.
- `content.js`: Lógica de inyección en el contexto de la página web.
- `popup.html/css`: Interfaz de usuario para la visualización del estado de protección.

---
**Proyecto ANTICIPA (UC3M-IBIDAT)** | Financiado con cargo a los fondos del Plan de Recuperación, Transformación y Resiliencia, financiado por la Unión Europea – NextGenerationEU a través de INCIBE (Convenio C111.23).

# Píxel de Seguimiento: pixel-adF (adTag_FP)

Este módulo forma parte de la **Actividad A4** y contiene la lógica del píxel publicitario parametrizable diseñado para el análisis de técnicas de fingerprinting.

## ⚙️ Configuración del Script
Este script es **parametrizable** y no incluye valores de producción. La prioridad de configuración (de mayor a menor) es:
1. Variable global `window.__ADNPM_CONFIG__`
2. Atributos `data-*` en la etiqueta `<script>`
3. Query params en el `src` del `<script>`

> **Nota sobre WebSocket:** Se puede pasar `wsHost` como **URL completa** (`wss://host:puerto`) o solo como **host** (`mi-dominio.com`) y combinarlo con `wsPort`. Si se pasa URL completa con puerto, `wsPort` es opcional.

---

## Ejemplos de Implementación

### A) Configuración Global (`window.__ADNPM_CONFIG__`)
```html
<script>
  window.__ADNPM_CONFIG__ = {
    pixelName: 'pixel_name.js',
    pixelVersion: 'pixel_version',
    wsHost: 'wss://mi-ws.mi-dominio.com',
    wsPort: 'numero'
  };
</script>
<script src="/pixel-adF.js"></script>
```

---

## B) Atributos `data-*` en el `<script>`

```html
<script
  src="/pixel-adF.js"
  data-pixel-name="pixel_name.js"
  data-pixel-version="pixel_version"
  data-ws-host="mi-dominio.com"
  data-ws-port="numero"
></script>
```

---

## C) Query params en el `src`

```html
<script src="/pixel-adF.js?pixelName=pixel_name.js&pixelVersion=pixel_version&wsHost=mi-dominio.com&wsPort=numero"></script>
```

---

## Campos disponibles

- `pixelName` (string): nombre del archivo del pixel, usado internamente para leer macros del query del `<script>`.
- `pixelVersion` (string): versión a reportar en los mensajes.
- `wsHost` (string): host del WebSocket. Acepta:
  - URL completa: `wss://host:puerto`
  - Solo host (sin esquema): `mi-dominio.com`
- `wsPort` (string/número): puerto del WebSocket si no lo llevas en `wsHost`.

---

## Troubleshooting

- **No conecta al WS**: verifica `wsHost`/`wsPort`, el esquema (`wss://` en HTTPS), y CORS/WS en el backend o reverse proxy.

---

Proyecto ANTICIPA (UC3M-IBIDAT) | Financiado por la Unión Europea – NextGenerationEU a través de INCIBE.

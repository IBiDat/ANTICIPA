# Despliegue de la aplicación de encuesta

Este proyecto contiene una aplicación web de encuesta desarrollada con `Node.js` (Express) y una base de datos `PostgreSQL`. El despliegue recomendado se realiza con `Docker Compose` y la inicialización del esquema se gestiona con `init.sql`.

## Estructura del repositorio

```
.
├── docker-compose.prod.yml  # Orquestación para despliegue
├── nginx.conf               # Proxy inverso (opcional) para dominios/Host
├── init.sql                 # Esquema inicial de la base de datos
├── Dockerfile.dev           # Imagen de la app en desarrollo (nodemon)
├── Dockerfile.prod          # Imagen de la app en producción
├── package.json             # Dependencias y scripts de Node.js
├── server.js                # Servidor Express (endpoints / y /submit y /oppose)
├── views/                   # HTML/CSS y assets estáticos servidos por Express
└── README.md                # Este documento
```

---

## Requisitos previos

Para ejecutar la aplicación mediante Docker Compose necesitas:

-   **Docker y Docker Compose** instalados en tu máquina. En la mayoría de distribuciones recientes de Debian/Ubuntu puedes instalarlos con:
    ```bash
    sudo apt update
    sudo apt install docker.io docker-compose-plugin
    ```
-   **Conexión a Internet** durante la primera construcción de las imágenes, ya que se descargará la imagen oficial de PostgreSQL y la imagen base de Node.js.

**Nota:** No es necesario tener Node.js ni PostgreSQL instalados en el sistema anfitrión, ya que ambos se ejecutan dentro de contenedores.

---

## Ejecución en modo desarrollo

En este repositorio no hay un `docker-compose.dev.yml` mantenido. Para desarrollo local hay dos opciones habituales:

### Opción A (recomendada): Node.js en local + PostgreSQL en Docker

1.  Arranca **solo** la base de datos:
    ```bash
    docker compose -f docker-compose.prod.yml up -d db
    ```

2.  Instala dependencias y arranca la app con autorrecarga:
    ```bash
    npm install
    export DB_USER=encuesta
    # Usa el mismo valor que POSTGRES_PASSWORD en docker-compose.prod.yml
    export DB_PASSWORD='(ver docker-compose.prod.yml)'
    export DB_NAME=encuesta_db
    export DB_HOST=localhost
    export DB_PORT=5432
    npm run dev
    ```
    Ajusta `DB_PASSWORD` al valor real configurado en `docker-compose.prod.yml`.

3.  Accede a la aplicación en `http://localhost:4000`.

### Opción B: ejecutar la app en contenedor con nodemon

Existe un `Dockerfile.dev` (arranca con `nodemon`). Si quieres esta opción, lo más cómodo es crear un fichero de override de Compose para desarrollo (no incluido por defecto en el repo) que use `Dockerfile.dev` y monte el código del host como volumen.

---

## Ejecución en modo producción

El entorno de producción está pensado para un despliegue más ligero y estable, sin autorrecarga de código. El código fuente se incluye en la imagen.

1.  Levanta los contenedores en segundo plano:
    ```bash
    docker compose -f docker-compose.prod.yml up --build -d
    ```
    Esto arranca:
    -   `encuesta_db_prod` (PostgreSQL) en `5432`.
    -   `encuesta_app_prod` (Express) en `4000`.
    -   `nginx_prod` (opcional) en `80`, configurado mediante `nginx.conf`.

2.  **Inicialización de base de datos**: el esquema se crea automáticamente mediante `init.sql` **la primera vez** que se inicializa el volumen de datos de PostgreSQL. Si ya existía el volumen, `init.sql` no se re-ejecutará.

3.  Accede a la aplicación:
    -   Directamente al backend: `http://localhost:4000`
    -   A través de Nginx (según `Host`/dominio): `http://localhost` **solo** si el `Host` coincide con alguna regla de `nginx.conf` (ver sección “Integración con un servidor web”).

Para detener y eliminar los contenedores de producción, usa:
```bash
docker compose -f docker-compose.prod.yml down
```

Si necesitas reinicializar el esquema desde cero (borrando datos), elimina también el volumen:
```bash
docker compose -f docker-compose.prod.yml down -v
```

---

## Personalización de variables de entorno

`server.js` toma la configuración de base de datos desde variables de entorno (`DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_PORT`).

-   **Con Docker Compose**: los valores están definidos en `docker-compose.prod.yml` (servicios `db` y `app`).
-   **En desarrollo local**: exporta esas variables antes de ejecutar `npm run dev`.

Si cambias credenciales o nombre de base de datos, asegúrate de mantener consistencia entre:
-   La configuración de Postgres (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`).
-   La configuración de la app (`DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_PORT`).
-   El esquema inicial (`init.sql`) si aplica.

---

## Integración con un servidor web

El despliegue incluye un servicio `nginx` que actúa como proxy inverso y enruta por `Host`/dominio, según `nginx.conf`.

-   **Backend de la encuesta**: para `anticipacampaigns.uc3m.es`, Nginx reenvía a `app:4000` (el contenedor de Express).
-   **Frontend externo (opcional)**: para `overprofiling.uc3m.es`, Nginx reenvía a `host.docker.internal:3000`. Esto asume que existe un servicio escuchando en el **host** en el puerto 3000 (por ejemplo, un frontend de Next/React ejecutándose fuera de Docker). En Linux se habilita mediante `extra_hosts: host.docker.internal:host-gateway` en `docker-compose.prod.yml`.

Para probar el ruteo de Nginx en local sin DNS, puedes forzar la cabecera `Host`:
```bash
curl -H 'Host: anticipacampaigns.uc3m.es' http://localhost/
```

En local, si visitas `http://localhost` sin ajustar el `Host`, Nginx puede no enrutar al backend (o devolver `502` si no existe nada en `host:3000`). En ese caso, usa directamente `http://localhost:4000` o ajusta `nginx.conf`.

---

## Exportar respuestas

Para exportar las respuestas a CSV y trabajar con ellas (idealmente en el mismo servidor por protección de datos):
```bash
docker exec -it encuesta_db_prod psql -U encuesta -d encuesta_db
```
```sql
\copy respuestas TO '/tmp/respuestas.csv' WITH CSV HEADER;
\copy oposiciones TO '/tmp/oposiciones.csv' WITH CSV HEADER;
\q
```
```bash
docker cp encuesta_db_prod:/tmp/respuestas.csv ./respuestas.csv
docker cp encuesta_db_prod:/tmp/oposiciones.csv ./oposiciones.csv
```
---

## Troubleshooting

-   **`init.sql` no se aplica tras reiniciar contenedores**: los scripts de `/docker-entrypoint-initdb.d` solo se ejecutan cuando el volumen de PostgreSQL está vacío. Si necesitas reaplicar desde cero:
    ```bash
    docker compose -f docker-compose.prod.yml down -v
    docker compose -f docker-compose.prod.yml up --build -d
    ```

-   **Puerto `5432` o `4000` ocupado**: revisa qué proceso lo está usando y libera el puerto, o cambia el mapeo de puertos en `docker-compose.prod.yml`.

-   **`502 Bad Gateway` en `http://localhost`**: suele ocurrir cuando Nginx intenta enrutar al upstream `host.docker.internal:3000` y no hay servicio en ese puerto, o cuando el `Host` no coincide con `nginx.conf`. Prueba:
    -   Acceder directamente a `http://localhost:4000`.
    -   Probar el host esperado:
        ```bash
        curl -H 'Host: anticipacampaigns.uc3m.es' http://localhost/
        ```
    -   Ajustar `nginx.conf` a tus dominios/entorno local.

-   **Error de conexión de la app a PostgreSQL**: verifica que los valores `DB_*` de la app coinciden con los `POSTGRES_*` de la base de datos y que el contenedor `encuesta_db_prod` está `healthy/running`.

-   **Cambios en `init.sql` no aparecen en una BD ya creada**: aplica una migración manual con `psql` o recrea el volumen si puedes perder datos.
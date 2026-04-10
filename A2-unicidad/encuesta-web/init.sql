-- init.sql

-- Crear la tabla para los resultados de la encuesta (respuestas del formulario)
CREATE TABLE IF NOT EXISTS respuestas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    linkedin VARCHAR(255),
    -- Valoraciones numéricas (0-5) sobre el anuncio
    valoracion_curiosidad SMALLINT,
    valoracion_desconfianza SMALLINT,
    -- Valoración del riesgo percibido (1-5)
    valoracion_riesgo SMALLINT,
    -- Emoción global ante el anuncio (1 muy negativa - 5 muy positiva)
    valoracion_valencia_experiencia SMALLINT,
    -- Sensación de vigilancia / ser observado (1 nada - 5 mucho)
    sensacion_vigilancia SMALLINT,
    -- Probabilidad de evitar anuncios similares en el futuro (1 nada probable - 5 muy probable)
    probabilidad_evitar_anuncios_similares SMALLINT,
    -- Nuevas valoraciones sobre privacidad y aceptación
    valoracion_invasion_privacidad SMALLINT,
    valoracion_control_datos SMALLINT,
    confianza_linkedin SMALLINT,
    aceptacion_personalizacion_generica SMALLINT,
    aceptacion_hiperpersonalizacion SMALLINT,
    riesgo_privacidad_nombre SMALLINT,
    -- Preguntas cualitativas (respuestas tipo "si", "no", "no_recuerdo", etc.)
    incluia_nombre VARCHAR(50),
    suele_clic_anuncios VARCHAR(50),
    conocimiento_previo VARCHAR(50),
    -- Preguntas abiertas
    motivacion_clic TEXT,
    valoracion_conocimiento TEXT,
    cambio_opinion_publicidad_datos TEXT,
    comentarios_adicionales TEXT,
    -- Preguntas de contexto
    formacion_privacidad VARCHAR(50),
    frecuencia_uso_linkedin VARCHAR(50),
    -- Parámetro de campaña (de la URL)
    campaign_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla para los que se oponen
CREATE TABLE IF NOT EXISTS oposiciones (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    linkedin_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const { z } = require("zod");

// Create an Express application
const app = express();

// Use port 4000 by default
const port = process.env.PORT || 4000;

// Configure PostgreSQL connection using environment variables provided by Docker Compose
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the views directory
app.use(express.static("views"));

// Root endpoint to serve the HTML form
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Schemas de validación con Zod
const submitSchema = z.object({
  nombre: z.string().min(1).max(255).trim(),
  email: z.string().email().max(255).trim(),
  linkedin: z
    .string()
    .url()
    .max(255)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  valoracion_curiosidad: z.enum(["0", "1", "2", "3", "4", "5"]),
  valoracion_desconfianza: z.enum(["0", "1", "2", "3", "4", "5"]),
  valoracion_riesgo: z.enum(["1", "2", "3", "4", "5"]),
  valoracion_valencia_experiencia: z.enum(["1", "2", "3", "4", "5"]),
  sensacion_vigilancia: z.enum(["1", "2", "3", "4", "5"]),
  probabilidad_evitar_anuncios_similares: z.enum(["1", "2", "3", "4", "5"]),
  valoracion_invasion_privacidad: z.enum(["1", "2", "3", "4", "5"]),
  valoracion_control_datos: z.enum(["1", "2", "3", "4", "5"]),
  confianza_linkedin: z.enum(["1", "2", "3", "4", "5"]),
  aceptacion_personalizacion_generica: z.enum(["1", "2", "3", "4", "5"]),
  aceptacion_hiperpersonalizacion: z.enum(["1", "2", "3", "4", "5"]),
  riesgo_privacidad_nombre: z.enum(["1", "2", "3", "4", "5"]),
  incluia_nombre: z.enum(["si", "no", "no_recuerdo"]),
  suele_clic_anuncios: z.enum(["si", "no"]),
  conocimiento_previo: z.enum(["si", "no", "dudaba"]),
  motivacion_clic: z.string().min(1).max(1000).trim(),
  valoracion_conocimiento: z.string().min(1).max(2000).trim(),
  cambio_opinion_publicidad_datos: z.string().min(1).max(2000).trim(),
  comentarios_adicionales: z.string().min(1).max(2000).trim(),
  formacion_privacidad: z.enum(["si", "no", "no_recuerdo"]),
  frecuencia_uso_linkedin: z.enum([
    "diario",
    "varias_veces_semana",
    "varias_veces_mes",
    "casi_nunca",
  ]),
  campaign_id: z
    .string()
    .max(255)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
});

const opposeSchema = z.object({
  email: z.string().email().max(255).trim(),
  linkedin_url: z
    .string()
    .url()
    .max(255)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
});

// Endpoint que recibe las respuestas de la encuesta
app.post("/submit", async (req, res) => {
  const parseResult = submitSchema.safeParse(req.body);

  if (!parseResult.success) {
    console.error("Error de validación en /submit:", parseResult.error.flatten());
    return res
      .status(400)
      .send(
        "<h1>Error en el formulario</h1><p>Por favor, revise que todos los campos estén correctamente rellenados.</p>"
      );
  }

  const data = parseResult.data;

  try {
    await pool.query(
      `INSERT INTO respuestas (
        nombre,
        email,
        linkedin,
        valoracion_curiosidad,
        valoracion_desconfianza,
        valoracion_riesgo,
        valoracion_valencia_experiencia,
        sensacion_vigilancia,
        probabilidad_evitar_anuncios_similares,
        valoracion_invasion_privacidad,
        valoracion_control_datos,
        confianza_linkedin,
        aceptacion_personalizacion_generica,
        aceptacion_hiperpersonalizacion,
        riesgo_privacidad_nombre,
        incluia_nombre,
        suele_clic_anuncios,
        conocimiento_previo,
        motivacion_clic,
        valoracion_conocimiento,
        cambio_opinion_publicidad_datos,
        comentarios_adicionales,
        formacion_privacidad,
        frecuencia_uso_linkedin,
        campaign_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)`,
      [
        data.nombre,
        data.email,
        data.linkedin,
        Number(data.valoracion_curiosidad),
        Number(data.valoracion_desconfianza),
        Number(data.valoracion_riesgo),
        Number(data.valoracion_valencia_experiencia),
        Number(data.sensacion_vigilancia),
        Number(data.probabilidad_evitar_anuncios_similares),
        Number(data.valoracion_invasion_privacidad),
        Number(data.valoracion_control_datos),
        Number(data.confianza_linkedin),
        Number(data.aceptacion_personalizacion_generica),
        Number(data.aceptacion_hiperpersonalizacion),
        Number(data.riesgo_privacidad_nombre),
        data.incluia_nombre,
        data.suele_clic_anuncios,
        data.conocimiento_previo,
        data.motivacion_clic,
        data.valoracion_conocimiento,
        data.cambio_opinion_publicidad_datos,
        data.comentarios_adicionales,
        data.formacion_privacidad,
        data.frecuencia_uso_linkedin,
        data.campaign_id,
      ]
    );
    res.send(
      "<h1>¡Gracias por tu respuesta!</h1><p>Sus datos serán tratados conforme al consentimiento otorgado. Recibirá más detalles sobre el experimento en el email proporcionado.</p>"
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al guardar en la base de datos.");
  }
});

// Endpoint que recibe las oposiciones al tratamiento de datos
app.post("/oppose", async (req, res) => {
  const parseResult = opposeSchema.safeParse(req.body);

  if (!parseResult.success) {
    console.error("Error de validación en /oppose:", parseResult.error.flatten());
    return res
      .status(400)
      .send(
        "<h1>Error en el formulario de oposición</h1><p>Por favor, revise que el email y la URL de LinkedIn (si la proporciona) sean correctos.</p>"
      );
  }

  const { email, linkedin_url } = parseResult.data;

  try {
    await pool.query(
      `INSERT INTO oposiciones (email, linkedin_url) VALUES ($1, $2)`,
      [email, linkedin_url || null] // Acepta un linkedin_url nulo si no se proporciona
    );
    res.send("<h1>Solicitud de oposición recibida.</h1><p>Sus datos serán anonimizados totalmente en un plazo inferior a 7 días.</p>");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al guardar la solicitud de oposición.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
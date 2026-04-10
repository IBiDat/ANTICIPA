# config.py
import os
from dotenv import load_dotenv

load_dotenv()

# --- CREDENCIALES Y URLS ---
MAIL = os.getenv("MAIL")
PASSWORD = os.getenv("PASSWORD")
LOGIN_URL = "https://www.linkedin.com/login"
START_PAGE = 6

# --- DIRECTORIOS Y ARCHIVOS DE SALIDA ---
OUTPUT_DIR_HTML = "html_output"
CSV_REACTIONS_ON_POSTS = "Reporte_Reacciones_en_Posts.csv"
CSV_PUBLICATIONS = "Reporte_Publicaciones.csv"
CSV_COMMENTS = "Reporte_Comentarios.csv"
CSV_REACTIONS_GIVEN = "Reporte_Reacciones_dadas.csv"

# --- PARÁMETROS DEL CRAWLER ---
HUMAN_DELAY_SECONDS = 5
TIME_PERIODS = {'last_7_days': 7, 'last_30_days': 30, 'last_90_days': 90}
HIGHLY_ACTIVE_THRESHOLD_DAYS = 10

# --- SELECTORES CSS ---
# Selector para encontrar los perfiles en la página de búsqueda
PROFILE_LINK_SELECTOR = 'div.entity-result__item a.app-aware-link'
# Selector para esperar a que la lista de resultados cargue
SEARCH_RESULTS_CONTAINER_SELECTOR = 'div.search-results-container'
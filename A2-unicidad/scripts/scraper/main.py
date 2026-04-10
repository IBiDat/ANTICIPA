# main.py
import os, time, json, random, traceback, config, profile_seeker, data_extractor
from pathlib import Path
import pandas as pd
from bs4 import BeautifulSoup
from camoufox.sync_api import Camoufox

# Archivos de control
CHECKPOINT_FILE = Path("checkpoint.json")
REPORT_COMPLETE = Path("Reporte_Completo.csv")

# Parámetros
MAX_SESSION_RETRIES = 100        # cuántas veces intentar levantar sesión tras fallos
SAFE_GOTO_RETRIES = 3         # reintentos por navegación
BACKOFF_BASE = 5              # segundos base para backoff exponencial

# -------------------------
# Utilidades
# -------------------------
def human_sleep(a=2.0, b=6.0):
    """Sleep con tiempo aleatorio para simular comportamiento humano."""
    time.sleep(random.uniform(a, b))


def save_checkpoint(page_num: int, profile_idx: int):
    payload = {"page": page_num, "profile_idx": profile_idx}
    CHECKPOINT_FILE.write_text(json.dumps(payload))
    print(f"  💾 Checkpoint guardado: página={page_num}, perfil_idx={profile_idx}")


def load_checkpoint():
    if not CHECKPOINT_FILE.exists():
        return {"page": config.START_PAGE, "profile_idx": 0}
    try:
        data = json.loads(CHECKPOINT_FILE.read_text())
        page = int(data.get("page", config.START_PAGE))
        profile_idx = int(data.get("profile_idx", 0))
        print(f"  ↗️ Checkpoint cargado: página={page}, perfil_idx={profile_idx}")
        return {"page": page, "profile_idx": profile_idx}
    except Exception:
        return {"page": config.START_PAGE, "profile_idx": 0}


def generate_reports(all_results: list):
    """Tu función de generación de CSV, ligeramente protegida."""
    print("\n--- Fase 3: Generando reportes CSV ---")

    if not all_results:
        print("  No se procesaron datos, no se generarán reportes.")
        return

    df_results = pd.DataFrame(all_results)
    cols_base = ['profile_id']

    reactions_cols = [c for c in df_results.columns if 'total_reactions_on_posts' in c]
    if reactions_cols:
        df_results[cols_base + reactions_cols].to_csv(config.CSV_REACTIONS_ON_POSTS, index=False)
        print(f"  ✓ Reporte '{config.CSV_REACTIONS_ON_POSTS}' guardado.")

    publications_cols = [c for c in df_results.columns if 'publications' in c]
    if publications_cols:
        df_results[cols_base + publications_cols].to_csv(config.CSV_PUBLICATIONS, index=False)
        print(f"  ✓ Reporte '{config.CSV_PUBLICATIONS}' guardado.")

    comments_cols = [c for c in df_results.columns if 'comments' in c]
    if comments_cols:
        df_results[cols_base + comments_cols].to_csv(config.CSV_COMMENTS, index=False)
        print(f"  ✓ Reporte '{config.CSV_COMMENTS}' guardado.")

    reactions_given_cols = [c for c in df_results.columns if 'reactions_' in c and 'total' not in c]
    if reactions_given_cols:
        df_results[cols_base + reactions_given_cols].to_csv(config.CSV_REACTIONS_GIVEN, index=False)
        print(f"  ✓ Reporte '{config.CSV_REACTIONS_GIVEN}' guardado.")

    df_results.to_csv(REPORT_COMPLETE, index=False)
    print(f"  ✓ Reporte '{REPORT_COMPLETE}' guardado.")


def safe_goto(page, url, retries=SAFE_GOTO_RETRIES, timeout=60000):
    """
    Intenta ir a `url` con reintentos y backoff. Devuelve True si parece haber cargado bien.
    Detecta carga insuficiente por contenido muy corto.
    """
    for attempt in range(retries):
        try:
            page.goto(url, timeout=timeout)
            human_sleep(2, 5)
            content = page.content()
            # heurística simple: si content demasiado corto, considerar fallo
            if content and len(content) > 2000:
                return True
            else:
                raise RuntimeError("Contenido insuficiente (posible bloqueo)")
        except Exception as ex:
            wait = attempt + random.random()
            print(f"  ❌ safe_goto error: {ex} — reintentando en {wait:.1f}s (intento {attempt+1}/{retries})")
            time.sleep(wait)
    return False


def humanize_page(page):
    """Pequeñas acciones para parecer humano (viewport, scrolls, movimientos)."""
    try:
        # viewport aleatorio
        w = random.randint(1200, 1920)
        h = random.randint(800, 1080)
        try:
            page.set_viewport_size({"width": w, "height": h})
        except Exception:
            pass

        # movimientos y scrolls
        for _ in range(random.randint(1, 3)):
            try:
                page.mouse.move(random.randint(100, 1000), random.randint(100, 600))
            except Exception:
                pass
            try:
                page.mouse.wheel(0, random.randint(200, 800))
            except Exception:
                pass
            human_sleep(0.5, 2.0)
    except Exception:
        pass


# -------------------------
# Login y sesión
# -------------------------
def do_login(page):
    """Realiza el login en LinkedIn (sencillo)."""
    print("➡️  Navegando a página de login...")

    if not safe_goto(page, config.LOGIN_URL):
        raise RuntimeError("No se pudo acceder a la página de login")

    # Usar fill o type según API de Camoufox
    try:
        page.fill("#username", config.MAIL)
        human_sleep(2.5, 5.0)
        page.fill("#password", config.PASSWORD)
        page.click('[data-litms-control-urn="login-submit"]')
    except Exception:
        # Intento alternativo si algunos métodos no funcionan
        try:
            page.type("#username", config.MAIL)
            human_sleep(1, 2)
            page.type("#password", config.PASSWORD)
            page.click('[data-litms-control-urn="login-submit"]')
        except Exception as e:
            print("  ⚠️ No se pudo automatricular el login con los selectores habituales:", e)
            raise


# -------------------------
# Lógica de procesamiento
# -------------------------
def process_search_page(page, page_num, start_profile_idx, all_profile_metrics):
    """
    Procesa una página de resultados (page_num).
    start_profile_idx: índice (0-based) del perfil dentro de la lista para comenzar (resumir).
    Devuelve: tuple(success_bool, last_processed_profile_idx)
    """
    print(f"\n--- Procesando página de resultados número {page_num} (desde perfil #{start_profile_idx}) ---")
    search_url_template = f"https://www.linkedin.com/search/results/people/?geoUrn=%5B%22105646813%22%5D&keywords=periodista&origin=FACETED_SEARCH&page={page_num}&sid=I_Q&spellCorrectionEnabled=false"

    if not safe_goto(page, search_url_template):
        raise RuntimeError(f"No se pudo cargar la página de búsqueda {page_num}")

    humanize_page(page)
    human_sleep(2, 4)

    profile_urls = profile_seeker.get_profile_urls_on_current_page(page)
    profile_count = len(profile_urls)
    print(f"  📊 Se encontraron {profile_count} perfiles en la página {page_num}.")

    # Si no hay perfiles, considerarlo final o bloqueo
    if profile_count == 0:
        raise RuntimeError("No se han encontrado perfiles en la página — posible bloqueo o cambio de layout.")

    # Iterar a partir de start_profile_idx
    for idx in range(start_profile_idx, profile_count):
        profile_url = profile_urls[idx]
        print(f"\n  ▶️ Procesando perfil {idx+1} de {profile_count} (URL: {profile_url})")

        # Guardar checkpoint antes de cada perfil (si hay fallo, reintentaremos ese mismo)
        save_checkpoint(page_num, idx)

        # Ir al perfil con safe_goto
        if not safe_goto(page, profile_url):
            # si fallo al cargar el perfil, levantamos excepción para reiniciar sesión
            raise RuntimeError(f"No se pudo cargar el perfil ({profile_url})")

        # Pequeñas acciones humanas
        human_sleep(3, 7)
        humanize_page(page)

        # Extraer HTML y parsear algunos campos básicos (con tolerancia a errores)
        try:
            profile_html = page.content()
            soup = BeautifulSoup(profile_html, 'html.parser')

            # Extracción defensiva de ubicación y experiencia
            location_elem = soup.find('span', {'class': 'text-body-small inline t-black--light break-words'})
            location = location_elem.get_text().replace('\r\n', '').strip() if location_elem else "unknown_location"

            exp_table = soup.find_all('a', {'data-field': 'experience_company_logo'})
            position, company = "unknown_position", "unknown_company"
            for e in exp_table:
                plain_text = e.find_all('span', {'aria-hidden': 'true'})
                if plain_text and len(plain_text) >= 2:
                    position = plain_text[0].get_text().strip()
                    company = plain_text[1].get_text().strip()
                    break

        except Exception as e:
            print("     ⚠️ Error parseando HTML del perfil (seguiré intentando extraer):", e)
            position, company, location = "unknown_position", "unknown_company", "unknown_location"

        # Llamada principal al extractor (tu módulo)
        try:
            result = data_extractor.extract_profile_data(page, profile_url)
        except Exception as e:
            print("     ⚠️ data_extractor falló para este perfil:", e)
            result = None

        if result:
            profile_data = result.get("profile_metrics", {})
            profile_data["current_or_last_position"] = position
            profile_data["current_or_last_company"] = company
            profile_data["location"] = location
            all_profile_metrics.append(profile_data)
            print("     ✓ Datos del perfil añadidos.")
        else:
            print("     ⚠️ No se pudieron extraer datos estructurados de este perfil")

        # Guardar progreso tras cada perfil
        generate_reports(all_profile_metrics)
        save_checkpoint(page_num, idx + 1)  # la próxima vez empezaremos en el siguiente perfil

    # Si llegamos aquí, procesamos todos los perfiles de la página
    return True, 0


# -------------------------
# Main Orquestador (manejo de reinicios)
# -------------------------
def main():
    print("=== Crawler iniciado ===")
    os.makedirs(config.OUTPUT_DIR_HTML, exist_ok=True)

    # Cargar checkpoint si existe
    ck = load_checkpoint()
    current_page = ck["page"]
    current_profile_idx = ck["profile_idx"]

    all_profile_metrics = []
    # Si ya existe reporte completo, intentamos cargarlo para no perder lo ya procesado
    if REPORT_COMPLETE.exists():
        try:
            df = pd.read_csv(REPORT_COMPLETE)
            # convertir filas del CSV a dicts para append y no duplicar (si quieres dedupe: mejorar aquí)
            all_profile_metrics = df.to_dict(orient="records")
            print(f"  ↗️ Cargados {len(all_profile_metrics)} perfiles desde '{REPORT_COMPLETE}'")
        except Exception:
            all_profile_metrics = []

    session_attempt = 0
    while True:
        session_attempt += 1
        print(f"\n--- Inicio de sesión/ssn intento #{session_attempt} ---")
        try:
            with Camoufox() as camo:
                page = camo.new_page()

                # intentar login y navegar; si falla -> excepción para reiniciar
                do_login(page)

                # Reanudar desde la página y perfil indicados en el checkpoint
                page_num = current_page
                profile_idx = current_profile_idx

                while True:
                    # Procesar la página actual; si devuelve True, avanzamos a la siguiente página
                    success, next_profile_idx = process_search_page(page, page_num, profile_idx, all_profile_metrics)

                    if success:
                        # pasar a la siguiente página
                        page_num += 1
                        profile_idx = 0
                        # actualizar checkpoint
                        save_checkpoint(page_num, profile_idx)
                        # pausa entre páginas
                        human_sleep(5, 10)
                        # continuar bucle para procesar la siguiente pagina
                        continue
                    else:
                        # Si por alguna razón process_search_page devuelve False (no esperado), romper
                        break

        except KeyboardInterrupt:
            print("✋ Interrupción por teclado. Guardando estado y saliendo.")
            generate_reports(all_profile_metrics)
            break

        except Exception as e:
            # Log del problema, backoff y reintento (hasta MAX_SESSION_RETRIES)
            print(f"\n❌ Excepción de sesión: {e}")
            traceback.print_exc()
            generate_reports(all_profile_metrics)

            if session_attempt >= MAX_SESSION_RETRIES:
                print("⚠️ Se alcanzó el número máximo de reintentos de sesión. Abortando.")
                break

            # Backoff exponencial antes de levantar una nueva sesión
            wait = ((session_attempt - 1)) + random.uniform(0, 5)
            print(f"ℹ️ Esperando {wait:.1f}s antes de reintentar levantar otra sesión...")
            time.sleep(wait)

            # Cuando reintentamos, volvemos a leer el checkpoint (por si se actualizó)
            ck2 = load_checkpoint()
            current_page = ck2["page"]
            current_profile_idx = ck2["profile_idx"]
            continue

        else:
            # Si el with Camoufox terminó sin excepciones, es que completó todo
            print("✅ Sesión completada sin excepciones. Terminando proceso.")
            break

    print("\n🏁 Proceso finalizado.")
    print(f"   Total de perfiles procesados guardados: {len(all_profile_metrics)}")
    generate_reports(all_profile_metrics)


if __name__ == "__main__":
    main()

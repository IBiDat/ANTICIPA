# data_extractor.py
import re, random, time
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from playwright.sync_api import Page


def _parse_relative_time(time_str: str) -> datetime | None:
    if not time_str:
        return None

    s = time_str.strip().lower()
    # limpiar caracteres extraños
    s = re.sub(r'[^\w\s]', '', s)

    # casos como "ahora", "just now"
    if re.search(r'\b(ahora|just|justo|now)\b', s):
        return datetime.now()

    m = re.search(r'(\d+)\s*([a-zA-Záéíóúñ]+)', s)
    if not m:
        return None

    value = int(m.group(1))
    unit = m.group(2)

    # normalizar por prefijos para cubrir variantes (días, dia, d, day, days)
    unit = unit.lower()
    if unit.startswith(('m', 'min')) and not unit.startswith('mo'):  # minutes
        unit_type = 'minutes'
    elif unit.startswith(('h', 'hr')):  # hours
        unit_type = 'hours'
    elif unit.startswith(('d', 'dia')):  # days
        unit_type = 'days'
    elif unit.startswith(('w', 'sem', 'wk')):  # weeks
        unit_type = 'weeks'
    elif unit.startswith(('mo', 'mes')):  # months -> aproximar a 30 días
        value *= 30
        unit_type = 'days'
    elif unit.startswith(('a', 'y', 'yr', 'ano', 'año')):  # años -> aproximar a 365 días
        value *= 365
        unit_type = 'days'
    else:
        return None

    return datetime.now() - timedelta(**{unit_type: value})


def _analyze_activity_from_html(html_content: str) -> list:
    """
    Analiza el HTML y extrae las actividades encontradas.
    
    Args:
        html_content: HTML de la página
        activity_type_filter: Tipo de actividad a filtrar ('all', 'comments', 'reactions')
        
    Returns:
        Lista de diccionarios con información de cada actividad
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    activities = []
    
    ul_tag = soup.select_one("ul.display-flex.flex-wrap.list-style-none.justify-center")

    try:
        for li in ul_tag.find_all("li"):
            # Qué post se está viendo
            h2 = li.h2.string if li.h2 else None

            # Resulta que hay opciones "falsas" (que no tienen nada) dentro de las tarjetas,
            # estas opciones no tienen título. Así que, si tienen título, son posts verdaderos.
            if h2:
                # (para debug)
                #print(h2)
                
                # Tipo de post
                label_action = li.find(class_ = 'update-components-header__text-view')
                activity_type = label_action.get_text(strip=True) if label_action else 'publication'
                
                if 'comentado' in activity_type or 'commented' in activity_type or 'respondió' in activity_type or 'replied' in activity_type:
                    activity_type = 'comment'
                elif not 'publication' in activity_type:
                    activity_type = 'reaction'
                    
                # Antigüedad
                time = li.find_all('span', {'aria-hidden':'true'})
                
                # por si el texto es algo así "1w • Edited •", que se quede solo con "1w"
                antiguedad_text = time[3].get_text(strip=True).split(' ')[0]
                date = _parse_relative_time(antiguedad_text)
                
                activities.append({
                    'date': date,
                    'type': activity_type
                })
            else:
                continue

    except Exception as e:
        print(f"        Puede que no haya actividad de este tipo, error {e}")
        return []
    
    return activities


def _calculate_metrics(activities: list) -> dict:
    """
    Calcula las métricas para diferentes períodos de tiempo.
    
    Args:
        activities: Lista de actividades extraídas
        
    Returns:
        Diccionario con métricas calculadas
    """
    metrics = {}
    TIME_PERIODS = {'last_7_days': 7, 'last_30_days': 30, 'last_90_days': 90}

    # Calcular métricas para cada período definido en config
    for period, days in TIME_PERIODS.items():
        cutoff_date = datetime.now() - timedelta(days=days)

        # Filtrar actividades del período
        recent_activities = [
            a for a in activities
            if a.get('date') is not None and isinstance(a['date'], datetime) and a['date'] > cutoff_date
        ]
        
        # Contar por tipo de actividad
        metrics[f'publications_{period}'] = sum(
            1 for a in recent_activities if a['type'] == 'publication'
        )
        metrics[f'comments_{period}'] = sum(
            1 for a in recent_activities if a['type'] == 'comment'
        )
        metrics[f'reactions_{period}'] = sum(
            1 for a in recent_activities if a['type'] == 'reaction'
        )
    
    return metrics


def _get_profile_id(profile_url: str) -> str:
    """
    Extrae el ID del perfil desde la URL.
    
    Args:
        profile_url: URL del perfil de LinkedIn
        
    Returns:
        ID del perfil o 'unknown_profile' si no se puede extraer
    """
    match = re.search(r'/in/([^/]+)', profile_url)
    return match.group(1) if match else "unknown_profile"


def extract_profile_data(page: Page, profile_url: str) -> dict | None:
    """
    Visita las tres páginas de actividad de un perfil y extrae todos los datos.
    
    Args:
        page: Objeto Page de Playwright
        profile_url: URL base del perfil
        
    Returns:
        Diccionario con métricas del perfil e información de alta actividad
    """
    profile_id = _get_profile_id(profile_url)
    print(f"     📋 ID del perfil: {profile_id}")
    
    # Lista para acumular todas las actividades de las 3 páginas
    all_activities = []
    
    # Definir las páginas de actividad a visitar
    activity_pages = [
        ('posts', f"{profile_url}recent-activity/all/"),
        ('comments', f"{profile_url}recent-activity/comments/"),
        ('reactions', f"{profile_url}recent-activity/reactions/")
    ]
    
    # Visitar cada página de actividad
    for page_type, url in activity_pages:
        try:
            print(f"     🔍 Analizando '{page_type}'...")
            
            # Navegar a la página de actividad
            page.goto(url, timeout=60000)
            time.sleep(random.uniform(3, 8))
            page.mouse.wheel(0, 800)
            time.sleep(random.uniform(3, 8))
            page.mouse.wheel(0, random.randint(200, 800))
            page.mouse.wheel(0, random.randint(200, 800))
            page.mouse.wheel(0, random.randint(200, 800))
            page.mouse.wheel(0, random.randint(200, 800))
            page.mouse.wheel(0, random.randint(200, 800))
            # Obtener HTML de la página
            html_content = page.content()
            
            # Analizar actividades en esta página
            activities = _analyze_activity_from_html(html_content)
            
            if activities:
                print(f"        ✓ Encontradas {len(activities)} actividades")
                all_activities.extend(activities)
            else:
                print(f"        ⚠️ No se encontraron actividades")
                
        except Exception as e:
            print(f"        ❌ Error al procesar página '{page_type}': {e}")
            continue
    
    # Si no se encontraron actividades en ninguna página, retornar None
    if not all_activities:
        print("     🤷 No se encontraron actividades en ninguna página.")
        return None
    
    # Eliminar posibles duplicados (por si aparecen en múltiples páginas)
    # Usamos un conjunto para tracking basado en fecha y tipo
    seen = set()
    unique_activities = []
    for activity in all_activities:
        key = (activity['date'], activity['type'])
        if key not in seen:
            seen.add(key)
            unique_activities.append(activity)
    
    print(f"     📊 Total de actividades únicas encontradas: {len(unique_activities)}")
    # Calcular métricas del perfil
    profile_data = {'profile_id': profile_id}
    profile_data.update(_calculate_metrics(unique_activities))
    
    return {
        "profile_metrics": profile_data
    }
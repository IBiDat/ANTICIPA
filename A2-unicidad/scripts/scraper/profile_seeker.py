# profile_seeker.py
from playwright.sync_api import Page
from bs4 import BeautifulSoup
import time


def get_profile_urls_on_current_page(page: Page) -> list[str]:
    """
    Extrae todas las URLs de perfiles de la página de resultados actual.
    
    Args:
        page: Objeto Page de Playwright con la página de resultados cargada
        
    Returns:
        Lista de URLs de perfiles encontrados (URLs base sin /recent-activity/)
    """
    print("  🔎 Localizando perfiles en la página actual...")
    
    # Obtener el HTML de la página actual
    html_content = page.content()
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Set para evitar duplicados
    profile_urls = set()
    
    # Buscar todos los enlaces que contengan '/in/' (perfiles de LinkedIn)
    for link in soup.find_all('a', href=True):
        href = link.get('href')
        
        # Filtrar solo enlaces de perfiles
        if href and '/in/' in href:
            # Limpiar la URL para obtener solo la parte del perfil
            if href.startswith('http'):
                # URL completa
                base_url = href.split('?')[0]  # Remover parámetros
            else:
                # URL relativa
                base_url = f"https://www.linkedin.com{href.split('?')[0]}"
            
            # Asegurarse de que termine con '/' para consistencia
            if not base_url.endswith('/'):
                base_url += '/'
            
            # Evitar URLs de actividad reciente u otras secciones
            if '/recent-activity/' not in base_url and '/overlay/' not in base_url:
                profile_urls.add(base_url)
    
    # Convertir set a lista para mantener orden
    profile_urls_list = list(profile_urls)
    
    print(f"  ✓ Se encontraron {len(profile_urls_list)} perfiles únicos")
    
    return profile_urls_list


def go_to_next_page(page: Page) -> bool:
    """
    Intenta navegar a la siguiente página de resultados usando el botón "Next page".
    
    Args:
        page: Objeto Page de Playwright
        
    Returns:
        True si se pudo ir a la siguiente página, False si no hay más páginas
    """
    try:
        # Obtener el HTML actual de la página
        html_content = page.content()
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Buscar el botón específico de "Next page"
        next_button = soup.find("button", {"aria-label": "Next page"})
        
        if next_button:
            # Verificar si el botón está deshabilitado
            is_disabled = next_button.get('disabled') is not None or 'disabled' in next_button.get('class', [])
            
            if not is_disabled:
                # Usar Playwright para hacer clic en el botón
                # Necesitamos usar el selector exacto para Playwright
                page.click('button[aria-label="Next page"]')
                time.sleep(5)
                return True
            else:
                print("\n  ⏹️ Se ha llegado al final de todas las páginas de resultados.")
                return False
        else:
            print("\n  ⏹️ No hay más páginas disponibles (no se encontró botón 'Next page').")
            return False
            
    except Exception as e:
        print(f"\n  ❌ Error al intentar navegar a la siguiente página: {e}")
        print("  ⏹️ Finalizando búsqueda...")
        return False
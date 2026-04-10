// 'chrome.runtime.' en Manifest_v3, como 'chrome.runtime.' en Manifest_v2, inyecta nuestro script en el contexto de la extensión en vez de inyectarlo directamente en la página web, 
// porque sino tiene implicaciones de seguridad y privacidad.
const script = document.createElement('script');
script.src = chrome.runtime.getURL('script.js');
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
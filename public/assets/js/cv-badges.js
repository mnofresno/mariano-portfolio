// CV Badges Loader - Genera badges para descargar CVs directamente desde GitHub Releases
// Los releases públicos de GitHub son accesibles sin autenticación
(function () {
  const GITHUB_REPO = 'mnofresno/mariano-portfolio';
  // URL especial de GitHub que siempre apunta al último release sin necesidad de API
  const BASE_DOWNLOAD_URL = '/assets/cv';

  const CV_VARIANTS = [
    { name: 'General (EN)', file: 'CV-en.pdf', lang: 'en', variant: 'general' },
    { name: 'Development (EN)', file: 'CV-en-dev.pdf', lang: 'en', variant: 'dev' },
    { name: 'Tech Lead (EN)', file: 'CV-en-lead.pdf', lang: 'en', variant: 'lead' },
    { name: 'IoT & Electronics (EN)', file: 'CV-en-iot.pdf', lang: 'en', variant: 'iot' },
    { name: 'General (ES)', file: 'CV-es.pdf', lang: 'es', variant: 'general' },
    { name: 'Desarrollo (ES)', file: 'CV-es-dev.pdf', lang: 'es', variant: 'dev' },
    { name: 'Líder Técnico (ES)', file: 'CV-es-lead.pdf', lang: 'es', variant: 'lead' },
    { name: 'IoT y Electrónica (ES)', file: 'CV-es-iot.pdf', lang: 'es', variant: 'iot' }
  ];

  // Función para construir URL de descarga directa (sin necesidad de API)
  // GitHub proporciona una URL especial que siempre apunta al último release
  function getDownloadUrl(filename) {
    return `${BASE_DOWNLOAD_URL}/${filename}`;
  }

  // Función para crear un badge
  function createBadge(variant, downloadUrl) {
    const badge = document.createElement('a');
    badge.href = downloadUrl;
    badge.target = '_blank';
    badge.rel = 'noopener noreferrer';
    badge.className = 'cv-badge';
    badge.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;
    badge.onmouseover = function () {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    };
    badge.onmouseout = function () {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    };

    badge.innerHTML = `
      <i class="bi bi-file-earmark-pdf" style="font-size: 18px;"></i>
      <span>${variant.name}</span>
      <i class="bi bi-download" style="font-size: 14px; opacity: 0.8;"></i>
    `;

    return badge;
  }

  // Función principal para cargar badges
  function loadCVBadges() {
    const container = document.getElementById('cv-badges-container');
    if (!container) return;

    // Limpiar contenedor
    container.innerHTML = '';

    // Construir URLs de descarga directas (sin necesidad de API)
    const variants = CV_VARIANTS.map(v => ({
      ...v,
      downloadUrl: getDownloadUrl(v.file)
    }));

    // Crear badges para cada variante
    variants.forEach(variant => {
      const badge = createBadge(variant, variant.downloadUrl);
      container.appendChild(badge);
    });

    // Exponer información globalmente para el chatbot
    window.cvInfo = {
      variants: variants
    };
  }

  // Cargar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCVBadges);
  } else {
    loadCVBadges();
  }
})();


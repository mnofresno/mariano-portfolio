// CV Badges Loader - Genera badges para descargar CVs directamente desde GitHub Releases
// Los releases públicos de GitHub son accesibles sin autenticación
(function () {
  const GITHUB_REPO = 'mnofresno/mariano-portfolio';
  const BASE_DOWNLOAD_URL = 'https://mnofresno.github.io/mariano-portfolio/assets/cv';

  const CV_VARIANTS = {
    en: [
      { name: 'General', file: 'CV-en.pdf', variant: 'general', icon: 'bi-person-badge', color: '#667eea' },
      { name: 'Development', file: 'CV-en-dev.pdf', variant: 'dev', icon: 'bi-code-slash', color: '#06b6d4' },
      { name: 'Tech Lead', file: 'CV-en-lead.pdf', variant: 'lead', icon: 'bi-people-fill', color: '#f59e0b' },
      { name: 'IoT & Electronics', file: 'CV-en-iot.pdf', variant: 'iot', icon: 'bi-cpu', color: '#8b5cf6' }
    ],
    es: [
      { name: 'General', file: 'CV-es.pdf', variant: 'general', icon: 'bi-person-badge', color: '#667eea' },
      { name: 'Desarrollo', file: 'CV-es-dev.pdf', variant: 'dev', icon: 'bi-code-slash', color: '#06b6d4' },
      { name: 'Líder Técnico', file: 'CV-es-lead.pdf', variant: 'lead', icon: 'bi-people-fill', color: '#f59e0b' },
      { name: 'IoT y Electrónica', file: 'CV-es-iot.pdf', variant: 'iot', icon: 'bi-cpu', color: '#8b5cf6' }
    ]
  };

  // Función para construir URL de descarga directa
  function getDownloadUrl(filename) {
    return `${BASE_DOWNLOAD_URL}/${filename}`;
  }

  // Función para crear un badge moderno
  function createBadge(variant, lang) {
    const downloadUrl = getDownloadUrl(variant.file);

    const badge = document.createElement('a');
    badge.href = downloadUrl;
    badge.target = '_blank';
    badge.rel = 'noopener noreferrer';
    badge.className = 'cv-badge';
    badge.dataset.variant = variant.variant;

    badge.innerHTML = `
      <div class="cv-badge-icon" style="background: ${variant.color};">
        <i class="bi ${variant.icon}"></i>
      </div>
      <div class="cv-badge-content">
        <div class="cv-badge-title">${variant.name}</div>
        <div class="cv-badge-action">
          <i class="bi bi-download"></i>
          <span>Download PDF</span>
        </div>
      </div>
    `;

    return badge;
  }

  // Función para configurar el sistema de tabs
  function setupTabs() {
    const tabs = document.querySelectorAll('.cv-lang-tab');
    const contents = document.querySelectorAll('.cv-lang-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        const lang = this.dataset.lang;

        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        // Update active content
        contents.forEach(c => c.classList.remove('active'));
        const targetContent = document.querySelector(`[data-lang-content="${lang}"]`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }

  // Función principal para cargar badges
  function loadCVBadges() {
    // Cargar badges de inglés
    const containerEn = document.getElementById('cv-badges-en');
    if (containerEn) {
      containerEn.innerHTML = '';
      CV_VARIANTS.en.forEach(variant => {
        const badge = createBadge(variant, 'en');
        containerEn.appendChild(badge);
      });
    }

    // Cargar badges de español
    const containerEs = document.getElementById('cv-badges-es');
    if (containerEs) {
      containerEs.innerHTML = '';
      CV_VARIANTS.es.forEach(variant => {
        const badge = createBadge(variant, 'es');
        containerEs.appendChild(badge);
      });
    }

    // Configurar tabs
    setupTabs();

    // Exponer información globalmente para el chatbot
    const allVariants = [
      ...CV_VARIANTS.en.map(v => ({ ...v, lang: 'en', downloadUrl: getDownloadUrl(v.file) })),
      ...CV_VARIANTS.es.map(v => ({ ...v, lang: 'es', downloadUrl: getDownloadUrl(v.file) }))
    ];

    window.cvInfo = {
      variants: allVariants
    };
  }

  // Cargar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCVBadges);
  } else {
    loadCVBadges();
  }
})();

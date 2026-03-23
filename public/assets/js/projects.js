(function () {
  const DATA_URL = '/data/projects.json';

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === 'string') node.textContent = text;
    return node;
  }

  function renderStack(tags) {
    const wrap = el('div', 'project-stack');
    tags.forEach((tag) => {
      const chip = el('span', 'project-chip', tag);
      wrap.appendChild(chip);
    });
    return wrap;
  }

  function buildCard(project, index) {
    const col = el('div', 'col-lg-6 d-flex align-items-stretch');
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', String(100 + index * 70));

    const card = el('article', 'project-card');
    const cover = el('img', 'project-cover');
    cover.src = project.asset;
    cover.alt = project.name + ' cover';

    const body = el('div', 'project-card-body');
    const badge = el(
      'span',
      project.visibility === 'public' ? 'project-visibility public' : 'project-visibility private',
      project.visibility === 'public' ? 'Public' : 'NDA / Private'
    );
    const title = el('h3', 'project-title', project.name);
    const tagline = el('p', 'project-tagline', project.tagline);

    const f1 = el('p', 'project-field');
    f1.innerHTML = '<strong>Problema de negocio:</strong> ' + project.problem;
    const f2 = el('p', 'project-field');
    f2.innerHTML = '<strong>Solución técnica:</strong> ' + project.solution;
    const f3 = el('p', 'project-field');
    f3.innerHTML = '<strong>Resultado medible:</strong> ' + project.result;

    const ctas = el('div', 'project-cta-group');
    const caseBtn = el('button', 'btn btn-primary btn-sm', 'Ver caso');
    caseBtn.type = 'button';
    caseBtn.dataset.bsToggle = 'modal';
    caseBtn.dataset.bsTarget = '#projectCaseModal';
    caseBtn.dataset.projectId = project.id;

    const repoLink = el('a', 'btn btn-outline-primary btn-sm', 'Ver repo/demo');
    repoLink.href = project.repoUrl;
    repoLink.target = '_blank';
    repoLink.rel = 'noopener noreferrer';

    ctas.appendChild(caseBtn);
    ctas.appendChild(repoLink);

    body.appendChild(badge);
    body.appendChild(title);
    body.appendChild(tagline);
    body.appendChild(f1);
    body.appendChild(f2);
    body.appendChild(renderStack(project.stack));
    body.appendChild(f3);
    body.appendChild(ctas);

    card.appendChild(cover);
    card.appendChild(body);
    col.appendChild(card);
    return col;
  }

  function formatCase(project) {
    return [
      ['Contexto', project.context],
      ['Rol', project.role],
      ['Arquitectura', project.architecture],
      ['Decisiones', project.decisions.join(' | ')],
      ['Impacto', project.impact],
      ['Qué haría siguiente', project.next]
    ];
  }

  function updateModal(project) {
    const title = document.getElementById('projectCaseTitle');
    const subtitle = document.getElementById('projectCaseSubtitle');
    const body = document.getElementById('projectCaseBody');
    const repo = document.getElementById('projectCaseRepo');

    if (!title || !subtitle || !body || !repo) return;

    title.textContent = project.name;
    subtitle.textContent = project.tagline;
    repo.href = project.repoUrl;

    body.innerHTML = '';
    formatCase(project).forEach(([label, value]) => {
      const item = el('div', 'case-block');
      const h = el('h5', 'case-label', label);
      const p = el('p', 'case-text', value);
      item.appendChild(h);
      item.appendChild(p);
      body.appendChild(item);
    });
  }

  function updateCounters(projects) {
    const publicCount = projects.filter((p) => p.visibility === 'public').length;
    const privateCount = projects.filter((p) => p.visibility !== 'public').length;
    const publicNode = document.getElementById('featuredPublicCount');
    const privateNode = document.getElementById('featuredPrivateCount');
    if (publicNode) publicNode.textContent = String(publicCount);
    if (privateNode) privateNode.textContent = String(privateCount);
  }

  async function initProjects() {
    const publicGrid = document.getElementById('featuredPublicGrid');
    const privateGrid = document.getElementById('featuredPrivateGrid');
    if (!publicGrid || !privateGrid) return;

    try {
      const response = await fetch(DATA_URL, { cache: 'no-store' });
      const payload = await response.json();
      const projects = payload.projects || [];

      const pub = projects.filter((p) => p.visibility === 'public');
      const pri = projects.filter((p) => p.visibility !== 'public');

      pub.forEach((project, idx) => publicGrid.appendChild(buildCard(project, idx)));
      pri.forEach((project, idx) => privateGrid.appendChild(buildCard(project, idx + pub.length)));
      updateCounters(projects);

      const modal = document.getElementById('projectCaseModal');
      if (modal && window.bootstrap) {
        modal.addEventListener('show.bs.modal', function (event) {
          const button = event.relatedTarget;
          if (!button) return;
          const id = button.getAttribute('data-project-id');
          const project = projects.find((p) => p.id === id);
          if (project) updateModal(project);
        });
      }
    } catch (error) {
      const node = document.getElementById('featuredProjectsError');
      if (node) {
        node.textContent = 'No se pudieron cargar los proyectos. Revisa public/data/projects.json';
        node.style.display = 'block';
      }
      console.error(error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjects);
  } else {
    initProjects();
  }
})();

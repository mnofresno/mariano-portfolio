(function () {
  function initMobileNav() {
    const nav = document.querySelector('header nav');
    const desktopLinks = nav ? nav.querySelector('.hidden.md\\:flex') : null;
    const cta = nav ? nav.querySelector('button, a[data-primary-cta]') : null;

    if (!nav || !desktopLinks || nav.querySelector('[data-nav-toggle]')) {
      return;
    }

    nav.classList.add('relative');

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'mobile-nav-panel');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    toggle.setAttribute('data-nav-toggle', 'true');
    toggle.className = 'md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border border-outline-variant/20 text-on-surface';
    toggle.innerHTML = '<span class="material-symbols-outlined">menu</span>';

    const panel = document.createElement('div');
    panel.id = 'mobile-nav-panel';
    panel.hidden = true;
    panel.className = 'md:hidden absolute left-0 right-0 top-full mt-3 rounded-[1.75rem] border border-outline-variant/15 bg-white/95 backdrop-blur-xl shadow-[0_18px_48px_rgba(22,28,34,0.08)] p-4';

    const list = document.createElement('div');
    list.className = 'flex flex-col gap-2';

    Array.from(desktopLinks.querySelectorAll('a')).forEach((link) => {
      const item = document.createElement('a');
      item.href = link.href;
      item.className = 'rounded-2xl px-4 py-3 text-sm font-bold tracking-wide text-on-surface hover:bg-surface-container-low';
      item.textContent = link.textContent.trim();
      item.addEventListener('click', closeMenu);
      list.appendChild(item);
    });

    panel.appendChild(list);

    if (cta) {
      const ctaLink = document.createElement('a');
      ctaLink.href = cta.tagName === 'A' ? cta.href : 'mailto:mnofresno@gmail.com';
      ctaLink.className = 'mt-4 flex items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-on-primary';
      ctaLink.textContent = cta.textContent.trim() || 'Contact';
      ctaLink.addEventListener('click', closeMenu);
      panel.appendChild(ctaLink);
    }

    if (cta) {
      cta.insertAdjacentElement('beforebegin', toggle);
    } else {
      nav.appendChild(toggle);
    }
    nav.appendChild(panel);

    function openMenu() {
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      toggle.innerHTML = '<span class="material-symbols-outlined">close</span>';
    }

    function closeMenu() {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<span class="material-symbols-outlined">menu</span>';
    }

    toggle.addEventListener('click', function () {
      if (panel.hidden) {
        openMenu();
      } else {
        closeMenu();
      }
    });

    document.addEventListener('click', function (event) {
      if (panel.hidden) return;
      if (!nav.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !panel.hidden) {
        closeMenu();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768 && !panel.hidden) {
        closeMenu();
      }
    });
  }

  function initChatbot() {
    if (window.__siteChatbotBootRequested) {
      return;
    }

    const loadChatbot = function () {
      if (window.__siteChatbotBootRequested) {
        return;
      }
      window.__siteChatbotBootRequested = true;
      import('/chatbot/chatbot-widget.js').catch(function (error) {
        console.error('Unable to load chatbot widget', error);
      });
    };

    const eagerEvents = ['pointerdown', 'keydown', 'touchstart'];
    const onFirstIntent = function () {
      eagerEvents.forEach(function (eventName) {
        window.removeEventListener(eventName, onFirstIntent, true);
      });
      loadChatbot();
    };

    eagerEvents.forEach(function (eventName) {
      window.addEventListener(eventName, onFirstIntent, true);
    });

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadChatbot, { timeout: 2500 });
    } else {
      window.setTimeout(loadChatbot, 2500);
    }
  }

  function initCultsGallery() {
    const gallery = document.querySelector('[data-cults-gallery]');
    if (!gallery) {
      return;
    }

    const status = document.querySelector('[data-cults-status]');
    const source = gallery.getAttribute('data-cults-source') || '/api/cults-gallery?limit=6';
    const limit = Number.parseInt(gallery.getAttribute('data-cults-limit') || '6', 10);

    function setStatus(message, isError) {
      if (!status) return;
      status.textContent = message;
      status.classList.toggle('text-error', Boolean(isError));
      status.classList.toggle('text-on-surface-variant', !isError);
    }

    function renderCards(cards) {
      gallery.innerHTML = '';

      cards.slice(0, limit).forEach(function (card) {
        const link = card.querySelector('a');
        const image = card.querySelector('img');
        const title = card.querySelector('h3');

        if (!link || !image || !title) {
          return;
        }

        const article = document.createElement('article');
        article.className = 'group overflow-hidden rounded-[1.75rem] border border-outline-variant/15 bg-surface-container-lowest shadow-[0_12px_32px_rgba(22,28,34,0.05)]';
        article.innerHTML = '' +
          '<a class="block h-full" target="_blank" rel="noopener noreferrer">' +
            '<div class="aspect-[4/3] overflow-hidden bg-surface-container-low"></div>' +
            '<div class="space-y-2 p-5">' +
              '<p class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary">Cults3D</p>' +
              '<h3 class="font-headline text-lg font-bold tracking-tight text-on-surface"></h3>' +
            '</div>' +
          '</a>';

        const anchor = article.querySelector('a');
        const media = article.querySelector('div');
        const heading = article.querySelector('h3');
        const img = document.createElement('img');

        anchor.href = link.href;
        img.src = image.src;
        img.alt = image.alt || title.textContent.trim();
        img.loading = 'lazy';
        img.className = 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105';
        media.appendChild(img);
        heading.textContent = title.textContent.trim();

        gallery.appendChild(article);
      });
    }

    async function loadGallery() {
      try {
        setStatus('Loading live 3D gallery...', false);
        const response = await fetch(source, {
          headers: { Accept: 'text/html' }
        });

        if (!response.ok) {
          throw new Error('Gallery request failed with status ' + response.status);
        }

        const html = await response.text();
        const parsed = new DOMParser().parseFromString(html, 'text/html');
        const cards = Array.from(parsed.querySelectorAll('.cults-card'));

        if (!cards.length) {
          throw new Error('Gallery response did not include any cards');
        }

        renderCards(cards);
        setStatus('', false);
      } catch (error) {
        console.error('Unable to load Cults3D gallery', error);
        gallery.innerHTML = '<div class="rounded-[1.75rem] border border-dashed border-outline-variant/25 bg-surface-container-low px-6 py-10 text-center text-sm text-on-surface-variant">Live preview temporarily unavailable. The full catalog is still available on Cults3D.</div>';
        setStatus('The gallery preview could not be loaded right now.', true);
      }
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        if (!entries[0] || !entries[0].isIntersecting) {
          return;
        }
        observer.disconnect();
        loadGallery();
      }, { rootMargin: '240px 0px' });

      observer.observe(gallery);
    } else {
      loadGallery();
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initChatbot();
    initCultsGallery();
  });
})();

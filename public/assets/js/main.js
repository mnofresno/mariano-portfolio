/**
* Lightweight UI behavior for the portfolio home page.
*/
(function () {
  "use strict";

  const select = (selector, all = false) => {
    const nodes = document.querySelectorAll(selector);
    return all ? Array.from(nodes) : nodes[0] || null;
  };

  const on = (type, selector, listener, all = false) => {
    const elements = select(selector, all);
    if (!elements) return;

    if (all) {
      elements.forEach((element) => element.addEventListener(type, listener));
      return;
    }

    elements.addEventListener(type, listener);
  };

  const navbarLinks = select('#navbar .scrollto', true);

  const updateActiveNav = () => {
    const position = window.scrollY + 200;

    navbarLinks.forEach((link) => {
      if (!link.hash) return;
      const section = select(link.hash);
      if (!section) return;

      const inSection = position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight;
      link.classList.toggle('active', inSection);
    });
  };

  const scrollToSection = (hash) => {
    const target = select(hash);
    if (!target) return;

    window.scrollTo({
      top: target.offsetTop,
      behavior: 'smooth'
    });
  };

  const backToTop = select('.back-to-top');
  const toggleBackToTop = () => {
    if (!backToTop) return;
    backToTop.classList.toggle('active', window.scrollY > 100);
  };

  on('click', '.mobile-nav-toggle', function () {
    document.body.classList.toggle('mobile-nav-active');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });

  on('click', '.scrollto', function (event) {
    if (!this.hash || !select(this.hash)) return;

    event.preventDefault();

    if (document.body.classList.contains('mobile-nav-active')) {
      document.body.classList.remove('mobile-nav-active');
      const navbarToggle = select('.mobile-nav-toggle');
      if (navbarToggle) {
        navbarToggle.classList.add('bi-list');
        navbarToggle.classList.remove('bi-x');
      }
    }

    scrollToSection(this.hash);
  }, true);

  const createTypedController = () => {
    const typedElement = select('.typed');
    if (!typedElement) return null;

    let typeTimeout = null;
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const getPhrases = () => {
      const values = typedElement.getAttribute('data-typed-items') || '';
      return values.split(',').map((item) => item.trim()).filter(Boolean);
    };

    const clearTimer = () => {
      if (typeTimeout) {
        window.clearTimeout(typeTimeout);
        typeTimeout = null;
      }
    };

    const tick = () => {
      const phrases = getPhrases();
      if (!phrases.length) {
        typedElement.textContent = '';
        return;
      }

      const current = phrases[phraseIndex % phrases.length];

      if (!deleting) {
        charIndex += 1;
        typedElement.textContent = current.slice(0, charIndex);

        if (charIndex >= current.length) {
          deleting = true;
          typeTimeout = window.setTimeout(tick, 1800);
          return;
        }

        typeTimeout = window.setTimeout(tick, 85);
        return;
      }

      charIndex -= 1;
      typedElement.textContent = current.slice(0, Math.max(charIndex, 0));

      if (charIndex <= 0) {
        deleting = false;
        phraseIndex += 1;
        typeTimeout = window.setTimeout(tick, 220);
        return;
      }

      typeTimeout = window.setTimeout(tick, 40);
    };

    return {
      start() {
        clearTimer();
        phraseIndex = 0;
        charIndex = 0;
        deleting = false;
        typedElement.textContent = '';
        tick();
      },
      restart() {
        this.start();
      }
    };
  };

  const typedController = createTypedController();
  window.initTyped = () => {
    if (typedController) typedController.restart();
  };

  const initSkillBars = () => {
    const skillsContent = select('.skills-content');
    if (!skillsContent) return;

    const fillBars = () => {
      select('.progress .progress-bar', true).forEach((bar) => {
        bar.style.width = `${bar.getAttribute('aria-valuenow')}%`;
      });
    };

    if (!('IntersectionObserver' in window)) {
      fillBars();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries[0] || !entries[0].isIntersecting) return;
      fillBars();
      observer.disconnect();
    }, { threshold: 0.2 });

    observer.observe(skillsContent);
  };

  const initSectionReveal = () => {
    const animatedNodes = select('[data-aos]', true);
    if (!animatedNodes.length) return;

    animatedNodes.forEach((node) => {
      node.classList.add('aos-lite');
    });

    if (!('IntersectionObserver' in window)) {
      animatedNodes.forEach((node) => node.classList.add('aos-lite-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('aos-lite-visible');
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15
    });

    animatedNodes.forEach((node) => observer.observe(node));
  };

  window.addEventListener('load', () => {
    updateActiveNav();
    toggleBackToTop();
    if (window.location.hash && select(window.location.hash)) {
      scrollToSection(window.location.hash);
    }
    if (typedController) typedController.start();
    initSkillBars();
    initSectionReveal();
  });

  document.addEventListener('scroll', updateActiveNav, { passive: true });
  document.addEventListener('scroll', toggleBackToTop, { passive: true });
})();

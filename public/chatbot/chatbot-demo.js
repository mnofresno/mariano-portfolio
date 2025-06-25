// Chatbot demo workflow desacoplado y multi-idioma
(function () {
  if (window.ChatbotDemoLoaded) return;
  window.ChatbotDemoLoaded = true;

  // Mensajes de demo simplificados y textos multi-idioma
  const demoTexts = {
    es: {
      greeting: '¡Hola! ¿En qué puedo ayudarte?',
      cta: 'Estoy en desarrollo, pero podés <b>enviarme un WhatsApp</b>:'
    },
    en: {
      greeting: 'Hi! How can I help you?',
      cta: 'I am under development, but you can <b>send me a WhatsApp</b>:'
    }
  };

  // Detecta idioma de la página
  function getLang() {
    const langBtn = document.getElementById('switch-lang');
    if (langBtn && langBtn.textContent.trim().toLowerCase() === 'es') return 'es';
    return 'en';
  }

  // Hook para el widget: intercepta el submit y simula el flujo demo
  window.chatbotDemoSend = async function(input, addMsg) {
    const lang = getLang();
    const texts = demoTexts[lang] || demoTexts['en'];
    const userMsgs = Array.from(document.querySelectorAll('#chatbot-messages span')).filter(e => e.parentNode.style.textAlign === 'right');
    const idx = userMsgs.length;

    if (idx === 0) {
      setTimeout(() => addMsg('bot', texts.greeting), 800);
    } else {
      // CTA WhatsApp
      setTimeout(() => {
        const whatsappNumber = '5491162502232';
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(input)}`;
        const whatsappIcon = `<i class='bx bxl-whatsapp' style='font-size:20px;color:#25D366;vertical-align:middle;'></i>`;
        // Elimina mensajes previos de CTA antes de agregar el nuevo
        const allBotMsgs = document.querySelectorAll('#chatbot-messages div');
        allBotMsgs.forEach(div => {
          if (div.innerHTML.includes('enviarme un WhatsApp') || div.innerHTML.includes('send me a WhatsApp')) {
            div.remove();
          }
        });
        const whatsappCTA = `<div style='display:flex;align-items:center;gap:8px;margin-top:8px;'>${whatsappIcon}<a href='${whatsappLink}' target='_blank' style='color:#25D366;font-weight:600;text-decoration:none;font-size:15px;'>WhatsApp</a></div>`;
        addMsg('bot', `${texts.cta}<br>${whatsappCTA}`);
      }, 800);
    }
  };

  // Observa cambios de idioma y actualiza TODOS los CTAs de WhatsApp dinámicamente
  const langObserver = new MutationObserver(() => {
    const lang = getLang();
    const texts = demoTexts[lang] || demoTexts['en'];
    const allBotMsgs = document.querySelectorAll('#chatbot-messages div');
    allBotMsgs.forEach(div => {
      // Busca el CTA de WhatsApp por el ícono de boxicons y el link
      const whatsappLink = div.querySelector(".bxl-whatsapp") && div.querySelector("a[href^='https://wa.me/']");
      if (whatsappLink) {
        // Mantiene el link y el ícono, solo cambia el texto
        const whatsappDiv = whatsappLink.parentElement.outerHTML;
        div.innerHTML = `${texts.cta}<br>${whatsappDiv}`;
      }
    });
  });
  langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();

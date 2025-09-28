// Modular Chatbot Widget Loader
// Vanilla JS, sin dependencias externas
function initChatbotWidget(customConfig) {
  if (window.ChatbotWidgetLoaded) return;
  window.ChatbotWidgetLoaded = true;

  const config = Object.assign({
    demoMode: true, // Alternar entre modo demo y backend
    backendUrl: 'https://example.com/chatbot', // URL del backend
  }, customConfig || {});

  // Crea el botón flotante con ícono de chat
  const btn = document.createElement('button');
  btn.id = 'chatbot-fab';
  btn.setAttribute('aria-label', 'Abrir chat');
  btn.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
  Object.assign(btn.style, {
    position: 'fixed', right: '24px', bottom: '90px', zIndex: 9999,
    background: '#0078FF', border: 'none', borderRadius: '50%', width: '56px', height: '56px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'box-shadow 0.2s',
  });

  // Crea el popup del chat (inicialmente oculto)
  const popup = document.createElement('div');
  popup.id = 'chatbot-popup';
  Object.assign(popup.style, {
    position: 'fixed', right: '24px', bottom: '90px', width: '320px', maxWidth: '90vw', height: '420px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.18)', zIndex: 10000, display: 'none', flexDirection: 'column', animation: 'chatbot-popin 0.4s cubic-bezier(.68,-0.55,.27,1.55)'
  });
  popup.innerHTML = `
    <style>
      @keyframes chatbot-popin { 0% { transform: scale(0.7) translateY(100px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
      #chatbot-popup::-webkit-scrollbar { width: 6px; background: #eee; }
      #chatbot-popup::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
    </style>
    <div style="padding:12px 16px;border-bottom:1px solid #eee;background:#0078FF;color:#fff;border-top-left-radius:16px;border-top-right-radius:16px;display:flex;align-items:center;justify-content:space-between">
      <span>Marian Bot</span>
      <button id="chatbot-close" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer">&times;</button>
    </div>
    <div id="chatbot-messages" style="flex:1;overflow-y:auto;padding:16px;"></div>
    <form id="chatbot-form" style="display:flex;border-top:1px solid #eee;padding:8px">
      <input id="chatbot-input" type="text" placeholder="Escribe tu mensaje..." autocomplete="off" style="flex:1;border:none;outline:none;font-size:15px;padding:8px;border-radius:8px;background:#f7f7f7" />
      <button type="submit" style="margin-left:8px;background:#0078FF;color:#fff;border:none;border-radius:8px;padding:0 16px;font-weight:600;cursor:pointer">Enviar</button>
    </form>
  `;

  // Traducciones UI
  const uiText = {
    es: {
      placeholder: 'Escribe tu mensaje...',
      send: 'Enviar',
      greeting: '¡Hola! ¿En qué puedo ayudarte?'
    },
    en: {
      placeholder: 'Type your message...',
      send: 'Send',
      greeting: 'Hi! How can I help you?'
    }
  };

  function getLang() {
    // Prioridad: atributo lang del <html>, luego botón, luego 'en'
    const htmlLang = document.documentElement.getAttribute('lang');
    if (htmlLang && (htmlLang === 'es' || htmlLang === 'en')) return htmlLang;
    const langBtn = document.getElementById('switch-lang');
    if (langBtn && langBtn.textContent.trim().toLowerCase() === 'es') return 'es';
    return 'en';
  }

  function updateUIText() {
    const lang = getLang();
    if (input) input.placeholder = uiText[lang].placeholder;
    if (form) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.textContent = uiText[lang].send;
    }
    // Cambia todos los mensajes de bot que sean el saludo por el del idioma actual
    if (messagesDiv) {
      Array.from(messagesDiv.children).forEach((msg, idx) => {
        if (
          msg.style.textAlign === 'left' &&
          (msg.textContent.trim().replace(/\s+/g, ' ') === uiText['es'].greeting ||
           msg.textContent.trim().replace(/\s+/g, ' ') === uiText['en'].greeting)
        ) {
          msg.innerHTML = `<span style="display:inline-block;background:#f1f1f1;color:#222;border-radius:12px;padding:8px 14px;max-width:80%;font-size:15px;">${uiText[lang].greeting}</span>`;
        }
      });
    }
  }

  // Lógica de apertura/cierre
  btn.onclick = () => { 
    popup.style.display = 'flex'; 
    btn.style.display = 'none'; 
    setTimeout(() => input.focus(), 100); // Foco automático al abrir
    updateUIText();
  };
  popup.querySelector('#chatbot-close').onclick = () => { popup.style.display = 'none'; btn.style.display = 'flex'; };

  // Lógica de mensajes
  const messagesDiv = popup.querySelector('#chatbot-messages');
  const form = popup.querySelector('#chatbot-form');
  const input = popup.querySelector('#chatbot-input');
  function addMsg(from, text) {
    const msg = document.createElement('div');
    msg.style.margin = '8px 0';
    msg.style.textAlign = from === 'user' ? 'right' : 'left';
    msg.innerHTML = `<span style="display:inline-block;background:${from==='user'?'#e6f0fa':'#f1f1f1'};color:#222;border-radius:12px;padding:8px 14px;max-width:80%;font-size:15px;">${text}</span>`;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
  addMsg('bot', '¡Hola! ¿En qué puedo ayudarte?');
  // Animación de "escribiendo..." estilo typing
  function showTyping() {
    const typingMsg = document.createElement('div');
    typingMsg.className = 'chatbot-typing';
    typingMsg.style.margin = '8px 0';
    typingMsg.style.textAlign = 'left';
    typingMsg.innerHTML = `<span style="display:inline-block;background:#f1f1f1;color:#888;border-radius:12px;padding:8px 14px;max-width:80%;font-size:15px;min-width:40px;">
      <span class="typing-dot" style="display:inline-block;width:6px;height:6px;background:#888;border-radius:50%;margin-right:2px;animation:blink 1s infinite 0s;"></span>
      <span class="typing-dot" style="display:inline-block;width:6px;height:6px;background:#888;border-radius:50%;margin-right:2px;animation:blink 1s infinite 0.2s;"></span>
      <span class="typing-dot" style="display:inline-block;width:6px;height:6px;background:#888;border-radius:50%;animation:blink 1s infinite 0.4s;"></span>
    </span>`;
    messagesDiv.appendChild(typingMsg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return typingMsg;
  }
  // Carga dinámica de chatbot-rag.js para modo RAG
  function loadRAGScriptIfNeeded(cb) {
    if (window.ChatbotRAGLoaded) return cb && cb();
    if (window.RAGChatbot) {
      window.ChatbotRAGLoaded = true;
      return cb && cb();
    }
    const script = document.createElement('script');
    script.src = '/chatbot/chatbot-rag.js';
    script.onload = () => { 
      window.ChatbotRAGLoaded = true;
      if (cb) cb(); 
    };
    script.onerror = () => {
      console.error('Error cargando chatbot-rag.js');
      if (cb) cb();
    };
    document.head.appendChild(script);
  }

  // Carga dinámica de chatbot-demo.js si está en demoMode y no está cargado
  function loadDemoScriptIfNeeded(cb) {
    if (!config.demoMode) return cb && cb();
    if (window.ChatbotDemoLoaded) return cb && cb();
    const script = document.createElement('script');
    script.src = '/chatbot/chatbot-demo.js';
    script.onload = () => { if (cb) cb(); };
    document.head.appendChild(script);
  }
  form.onsubmit = async e => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    addMsg('user', val);
    input.value = '';
    const typingMsg = showTyping();
    try {
      if (config.demoMode) {
        // Usar sistema RAG en lugar del demo
        loadRAGScriptIfNeeded(async () => {
          if (window.ragChatbot) {
            try {
              const response = await window.ragChatbot.processQuery(val);
              if (typingMsg.parentNode) typingMsg.remove();
              addMsg('bot', response);
            } catch (error) {
              console.error('Error en RAG:', error);
              if (typingMsg.parentNode) typingMsg.remove();
              addMsg('bot', 'Lo siento, hubo un error procesando tu consulta.');
            }
          } else {
            // Fallback al demo si RAG no está disponible
            loadDemoScriptIfNeeded(() => {
              if (window.chatbotDemoSend) {
                window.chatbotDemoSend(val, (from, text) => {
                  if (typingMsg.parentNode) typingMsg.remove();
                  addMsg(from, text);
                });
              } else {
                if (typingMsg.parentNode) typingMsg.remove();
              }
            });
          }
        });
      } else {
        const lang = document.documentElement.lang || 'en';
        const res = await fetch(`${config.backendUrl}?lang=${lang}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: val })
        });
        const data = await res.json();
        if (typingMsg.parentNode) typingMsg.remove();
        addMsg('bot', data.reply || '...');
      }
    } catch {
      if (typingMsg.parentNode) typingMsg.remove();
      addMsg('bot', 'Error de conexión.');
    }
  };

  document.body.appendChild(btn);
  document.body.appendChild(popup);

  // Inicializa UI en idioma correcto
  updateUIText();

  // Observa cambios de idioma en el botón de idioma y en el atributo lang del html
  function observeLangSwitch() {
    // Observa el botón de idioma
    const langBtn = document.getElementById('switch-lang');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        setTimeout(updateUIText, 150); // Espera a que el cambio de idioma se refleje
      });
    }
    // Observa el atributo lang del html
    const langAttrObserver = new MutationObserver(() => {
      updateUIText();
    });
    langAttrObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    
    // También escucha eventos personalizados para tests
    document.addEventListener('attributes', () => {
      updateUIText();
    });
    
    // También observa cambios en el botón de idioma si se agrega dinámicamente
    const btnObserver = new MutationObserver(() => {
      const newLangBtn = document.getElementById('switch-lang');
      if (newLangBtn && !newLangBtn.hasAttribute('data-listener-added')) {
        newLangBtn.addEventListener('click', () => {
          setTimeout(updateUIText, 150);
        });
        newLangBtn.setAttribute('data-listener-added', 'true');
      }
    });
    btnObserver.observe(document.body, { childList: true, subtree: true });
  }
  observeLangSwitch();

  // Agrega keyframes para la animación de los puntos
  const style = document.createElement('style');
  style.textContent = `@keyframes blink { 0%, 80%, 100% { opacity: 0.2; } 40% { opacity: 1; } }`;
  document.head.appendChild(style);
}

// Auto-inicialización si se carga por script en navegador
if (typeof window !== 'undefined' && !window.__CHATBOT_WIDGET_TEST__) {
  initChatbotWidget();
}

// Export para tests
if (typeof module !== 'undefined') {
  module.exports = { initChatbotWidget };
}

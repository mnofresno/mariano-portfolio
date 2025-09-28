// __tests__/chatbot-integration.test.js
// Integration tests for the complete chatbot system

/**
 * @jest-environment jsdom
 */

const path = require('path');
const { initChatbotWidget } = require('../public/chatbot/chatbot-widget.js');

// Mock del sitio web completo
const mockCompleteWebsite = `
<!DOCTYPE html>
<html lang="es">
<head>
    <title>Mariano Fresno - Personal Website</title>
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>
<body>
    <h1>Mariano Fresno</h1>
    <div id="aboutSubtitle">Technical Leader & Web Developer</div>
    <div id="aboutText">Mariano Fresno - Personal Professional Website</div>
    <div id="aboutSubtext">Web developer - Technical Leader</div>
    <div id="aboutFooter">Technical leader, hardware and software developer. Tech coach and team lead.</div>
    <div id="age-field">39</div>
    
    <div class="social-links">
        <a href="https://ln.fresno.ar" class="linkedin"><i class="bx bxl-linkedin"></i></a>
        <a href="https://github.com/mnofresno" class="github"><i class="bx bxl-github"></i></a>
        <a href="https://tw.fresno.ar" class="twitter"><i class="bx bxl-twitter"></i></a>
        <a href="https://cults3d.com/en/users/mnofresno/3d-models" class="cults3d"><i class="bx bxl-cults3d"></i></a>
        <a href="https://wa.me/5491162502232" class="whatsapp"><i class="bx bxl-whatsapp"></i></a>
    </div>
    
    <ul>
        <li><strong>Phone:</strong> +54 9 11-6250-2232</li>
        <li><strong>E-mail:</strong> mnofresno@gmail.com</li>
        <li><strong>Website:</strong> mariano.fresno.ar</li>
        <li><strong>City:</strong> Buenos Aires, Argentina</li>
        <li><strong>Birthday:</strong> 29 Jan 1986</li>
        <li><strong>Freelance:</strong> Available</li>
    </ul>
    
    <div class="skill" title="PHP, Python, Java, C#/C++, Node">
        <span>Backend</span>
        <span class="val">90%</span>
    </div>
    <div class="skill" title="JS, Vue.js, Angular, React">
        <span>Frontend</span>
        <span class="val">65%</span>
    </div>
    <div class="skill" title="Docker, Kubernetes, LAMBDAS, Puppet, Terraform, Jenkins">
        <span>DevOps</span>
        <span class="val">60%</span>
    </div>
    <div class="skill" title="xUnit, Mocks, Gherkin">
        <span>Unit testing</span>
        <span class="val">85%</span>
    </div>
    <div class="skill" title="Electronics: ARDUINO, RASPBERRY">
        <span>IoT</span>
        <span class="val">70%</span>
    </div>
    <div class="skill" title="Management, hiring, estimation, mentoring">
        <span>Leadership</span>
        <span class="val">55%</span>
    </div>
    
    <div class="icon-box">
        <h4><a href="">Desarrollo de Equipos Técnicos</a></h4>
        <p>Desarrollo y liderazgo de equipos técnicos especializados</p>
    </div>
    <div class="icon-box">
        <h4><a href="">Desarrollo de Software</a></h4>
        <p>Desarrollo de aplicaciones web y móviles</p>
    </div>
    <div class="icon-box">
        <h4><a href="">Optimización de Rendimiento</a></h4>
        <p>Mejora de rendimiento y escalabilidad de aplicaciones</p>
    </div>
    
    <div class="resume-item">
        <h4>Senior software engineering specialist</h4>
        <h5>2019 - Present</h5>
        <em>Tech Company</em>
        <p>Lead in the design, development, and implementation of technical solutions</p>
        <ul>
            <li>Lead in the design, development, and implementation of the graphic, layout, and production communication materials</li>
            <li>Delegate tasks to the 7 members of the design team and provide counsel on all aspects of the project</li>
        </ul>
    </div>
    
    <button id="switch-lang">ES</button>
</body>
</html>
`;

// Helper para configurar el DOM completo
function setupCompleteDOM() {
  document.body.innerHTML = mockCompleteWebsite;
  document.documentElement.lang = 'es';
}

// Helper para cargar el widget con RAG
async function loadWidgetWithRAG(demoMode = true, lang = 'es') {
  document.body.innerHTML = '';
  window.__CHATBOT_WIDGET_TEST__ = true;
  document.documentElement.lang = lang;
  setupCompleteDOM();
  
  // Mock RAG system
  if (!window.RAGChatbot) {
    const { RAGChatbot } = require('../public/chatbot/chatbot-rag.js');
    window.RAGChatbot = RAGChatbot;
  }
  
  initChatbotWidget({ demoMode });
  await new Promise(r => setTimeout(r, 100));
}

describe('Chatbot Integration Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    window.ChatbotWidgetLoaded = false;
    window.ChatbotRAGLoaded = false;
    window.ChatbotDemoLoaded = false;
    delete window.__CHATBOT_WIDGET_TEST__;
    jest.resetModules();
  });

  describe('Complete RAG System Integration', () => {
    test('initializes RAG system and extracts complete website content', async () => {
      await loadWidgetWithRAG();
      
      const chatbot = new window.RAGChatbot();
      await chatbot.initialize();
      
      expect(chatbot.isModelLoaded).toBe(true);
      expect(chatbot.knowledgeBase.length).toBeGreaterThan(0);
      
      // Verificar que se extrajo información personal
      const personalInfo = chatbot.knowledgeBase.find(doc => doc.id === 'personal_info');
      expect(personalInfo).toBeDefined();
      expect(personalInfo.content).toContain('Mariano Fresno');
      
      // Verificar que se extrajeron habilidades
      const skillsInfo = chatbot.knowledgeBase.find(doc => doc.id === 'skills');
      expect(skillsInfo).toBeDefined();
      expect(skillsInfo.content).toContain('Backend');
      expect(skillsInfo.content).toContain('DevOps');
    });

    test('responds to technology questions correctly', async () => {
      await loadWidgetWithRAG();
      
      const chatbot = new window.RAGChatbot();
      await chatbot.initialize();
      
      const kubernetesResponse = await chatbot.processQuery('¿Sabe Mariano sobre Kubernetes?');
      expect(kubernetesResponse).toContain('Kubernetes');
      expect(kubernetesResponse).toContain('DevOps');
      
      const dockerResponse = await chatbot.processQuery('¿Tiene experiencia con Docker?');
      expect(dockerResponse).toContain('Docker');
      
      const reactResponse = await chatbot.processQuery('¿Conoce React?');
      expect(reactResponse).toContain('React');
    });

    test('responds to contact questions with WhatsApp integration', async () => {
      await loadWidgetWithRAG();
      
      const chatbot = new window.RAGChatbot();
      await chatbot.initialize();
      
      const phoneResponse = await chatbot.processQuery('¿Cuál es su teléfono?');
      expect(phoneResponse).toContain('+54 9 11-6250-2232');
      expect(phoneResponse).toContain('WhatsApp');
      expect(phoneResponse).toContain('bx bxl-whatsapp');
      expect(phoneResponse).toContain('wa.me');
      
      const contactResponse = await chatbot.processQuery('¿Cómo puedo contactarlo?');
      expect(contactResponse).toContain('Email: mnofresno@gmail.com');
      expect(contactResponse).toContain('WhatsApp');
    });

    test('provides fallback with WhatsApp for unknown questions', async () => {
      await loadWidgetWithRAG();
      
      const chatbot = new window.RAGChatbot();
      await chatbot.initialize();
      
      const fallbackResponse = await chatbot.processQuery('¿Cuál es su color favorito?');
      expect(fallbackResponse).toContain('No tengo información específica');
      expect(fallbackResponse).toContain('WhatsApp');
      expect(fallbackResponse).toContain('bx bxl-whatsapp');
      expect(fallbackResponse).toContain('wa.me');
    });

    test('supports multilingual responses', async () => {
      await loadWidgetWithRAG(true, 'en');
      
      const chatbot = new window.RAGChatbot();
      await chatbot.initialize();
      
      const fallbackResponse = await chatbot.processQuery('What is your favorite color?');
      expect(fallbackResponse).toContain("I don't have specific information");
      expect(fallbackResponse).toContain('WhatsApp');
    });
  });

  describe('Widget Integration with RAG', () => {
    test('widget loads and uses RAG system in demo mode', async () => {
      await loadWidgetWithRAG();
      
      const btn = document.getElementById('chatbot-fab');
      expect(btn).toBeTruthy();
      btn.click();
      
      const popup = document.getElementById('chatbot-popup');
      expect(popup.style.display).toBe('flex');
      
      // Test sending a message
      const input = document.getElementById('chatbot-input');
      input.value = '¿Cuál es su teléfono?';
      document.getElementById('chatbot-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      
      await new Promise(r => setTimeout(r, 500));
      
      // Should have user message and bot response
      const messages = document.querySelectorAll('#chatbot-messages div');
      expect(messages.length).toBeGreaterThan(1);
    });

    test('widget handles RAG errors gracefully', async () => {
      // Mock RAG system that throws errors
      window.RAGChatbot = jest.fn().mockImplementation(() => ({
        initialize: jest.fn().mockRejectedValue(new Error('RAG Error')),
        processQuery: jest.fn().mockRejectedValue(new Error('RAG Error'))
      }));
      
      await loadWidgetWithRAG();
      
      const btn = document.getElementById('chatbot-fab');
      btn.click();
      
      const input = document.getElementById('chatbot-input');
      input.value = 'test question';
      document.getElementById('chatbot-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      
      await new Promise(r => setTimeout(r, 500));
      
      // Should handle error gracefully
      const messages = document.querySelectorAll('#chatbot-messages div');
      expect(messages.length).toBeGreaterThan(1);
    });
  });

  describe('Language Switching Integration', () => {
    test('switches language and updates RAG responses', async () => {
      await loadWidgetWithRAG(true, 'es');
      
      const chatbot = new window.RAGChatbot();
      await chatbot.initialize();
      
      // Test Spanish response
      let response = await chatbot.processQuery('¿Cuál es su teléfono?');
      expect(response).toContain('teléfono');
      
      // Switch to English
      document.documentElement.lang = 'en';
      const langBtn = document.getElementById('switch-lang');
      if (langBtn) {
        langBtn.click();
      }
      
      await new Promise(r => setTimeout(r, 100));
      
      // Test English response
      response = await chatbot.processQuery('What is your phone number?');
      expect(response).toContain('phone');
    });
  });

  describe('Performance and Reliability', () => {
    test('handles multiple rapid queries', async () => {
      await loadWidgetWithRAG();
      
      const chatbot = new window.RAGChatbot();
      await chatbot.initialize();
      
      const queries = [
        '¿Cuál es su teléfono?',
        '¿Sabe sobre Kubernetes?',
        '¿Cuál es su email?',
        '¿Qué servicios ofrece?',
        '¿Cuál es su color favorito?'
      ];
      
      const responses = await Promise.all(
        queries.map(query => chatbot.processQuery(query))
      );
      
      expect(responses).toHaveLength(5);
      responses.forEach(response => {
        expect(typeof response).toBe('string');
        expect(response.length).toBeGreaterThan(0);
      });
    });

    test('maintains state across multiple queries', async () => {
      await loadWidgetWithRAG();
      
      const chatbot = new window.RAGChatbot();
      await chatbot.initialize();
      
      // First query
      const response1 = await chatbot.processQuery('¿Cuál es su teléfono?');
      expect(response1).toContain('+54 9 11-6250-2232');
      
      // Second query should still work
      const response2 = await chatbot.processQuery('¿Cuál es su email?');
      expect(response2).toContain('mnofresno@gmail.com');
      
      // System should still be initialized
      expect(chatbot.isModelLoaded).toBe(true);
    });
  });
});

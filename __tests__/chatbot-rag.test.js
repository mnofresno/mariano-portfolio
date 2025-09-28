// __tests__/chatbot-rag.test.js
// Jest tests for the RAG chatbot system

/**
 * @jest-environment jsdom
 */

// Mock del DOM para simular el sitio web
const mockWebsiteHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <title>Mariano Fresno - Personal Website</title>
</head>
<body>
    <h1>Mariano Fresno</h1>
    <div id="aboutSubtitle">Technical Leader & Web Developer</div>
    <div id="age-field">39</div>
    <div class="social-links">
        <a href="https://ln.fresno.ar" class="linkedin"><i class="bx bxl-linkedin"></i></a>
        <a href="https://github.com/mnofresno" class="github"><i class="bx bxl-github"></i></a>
        <a href="https://wa.me/5491162502232" class="whatsapp"><i class="bx bxl-whatsapp"></i></a>
    </div>
    <ul>
        <li><strong>Phone:</strong> +54 9 11-6250-2232</li>
        <li><strong>E-mail:</strong> mnofresno@gmail.com</li>
        <li><strong>City:</strong> Buenos Aires, Argentina</li>
        <li><strong>Birthday:</strong> 29 Jan 1986</li>
    </ul>
    <div class="skill">
        <span>Backend</span>
        <span class="val">90%</span>
    </div>
    <div class="skill">
        <span>DevOps</span>
        <span class="val">60%</span>
    </div>
    <div class="icon-box">
        <h4><a href="">Desarrollo de Software</a></h4>
        <p>Desarrollo de aplicaciones web y móviles</p>
    </div>
    <div class="resume-item">
        <h4>Senior Developer</h4>
        <h5>2020 - Present</h5>
        <em>Tech Company</em>
        <p>Desarrollo de soluciones full-stack</p>
    </div>
</body>
</html>
`;

// Helper para configurar el DOM mock
function setupMockDOM() {
  document.body.innerHTML = mockWebsiteHTML;
  document.documentElement.lang = 'es';
}

// Helper para cargar el script RAG
async function loadRAGScript() {
  // Mock del RAGChatbot para testing
  if (!window.RAGChatbot) {
    const { RAGChatbot } = require('../public/chatbot/chatbot-rag.js');
    window.RAGChatbot = RAGChatbot;
  }
}

describe('RAG Chatbot System', () => {
  beforeEach(() => {
    setupMockDOM();
    jest.clearAllMocks();
  });

  describe('RAGChatbot Class', () => {
    test('creates instance successfully', () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      expect(chatbot).toBeDefined();
      expect(chatbot.knowledgeBase).toEqual([]);
      expect(chatbot.isModelLoaded).toBe(false);
    });

    test('initializes with fallback knowledge base on error', async () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      
      // Mock console.error para evitar spam en tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await chatbot.initialize();
      
      expect(chatbot.isModelLoaded).toBe(true);
      expect(chatbot.knowledgeBase.length).toBeGreaterThan(0);
      
      consoleSpy.mockRestore();
    });

    test('extracts personal information from DOM', () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      const personalInfo = chatbot.extractPersonalInfo();
      
      expect(personalInfo.name).toBe('Mariano Fresno');
      expect(personalInfo.title).toBe('Technical Leader & Web Developer');
      expect(personalInfo.age).toBe('39');
      expect(personalInfo.socialLinks.linkedin).toBe('https://ln.fresno.ar');
      expect(personalInfo.socialLinks.github).toBe('https://github.com/mnofresno');
      expect(personalInfo.socialLinks.whatsapp).toBe('https://wa.me/5491162502232');
    });

    test('extracts skills from DOM', () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      const skills = chatbot.extractSkills();
      
      expect(skills.length).toBeGreaterThan(0);
      expect(skills[0]).toHaveProperty('name');
      expect(skills[0]).toHaveProperty('percentage');
    });

    test('extracts services from DOM', () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      const services = chatbot.extractServices();
      
      expect(services.length).toBeGreaterThan(0);
      expect(services[0]).toHaveProperty('title');
      expect(services[0]).toHaveProperty('description');
    });

    test('extracts contact information from DOM', () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      const contact = chatbot.extractContact();
      
      expect(contact.phone).toContain('+54 9 11-6250-2232');
      expect(contact.email).toBe('mnofresno@gmail.com');
      expect(contact.city).toBe('Buenos Aires, Argentina');
    });

    test('extracts experience from DOM', () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      const experience = chatbot.extractExperience();
      
      expect(experience.length).toBeGreaterThan(0);
      expect(experience[0]).toHaveProperty('title');
      expect(experience[0]).toHaveProperty('period');
      expect(experience[0]).toHaveProperty('company');
    });
  });

  describe('Knowledge Base Generation', () => {
    test('structures knowledge base correctly', () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      const content = {
        personalInfo: { name: 'Mariano Fresno', title: 'Developer' },
        skills: [{ name: 'JavaScript', percentage: '90%' }],
        services: [{ title: 'Web Development', description: 'Full-stack development' }],
        contact: { phone: '+1234567890', email: 'test@example.com' }
      };
      
      const knowledgeBase = chatbot.structureKnowledgeBase(content);
      
      expect(knowledgeBase.length).toBeGreaterThan(0);
      expect(knowledgeBase[0]).toHaveProperty('id');
      expect(knowledgeBase[0]).toHaveProperty('content');
      expect(knowledgeBase[0]).toHaveProperty('keywords');
    });

    test('generates fallback knowledge base', () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      const fallbackKB = chatbot.getFallbackKnowledgeBase();
      
      expect(fallbackKB.length).toBeGreaterThan(0);
      expect(fallbackKB.some(doc => doc.id === 'personal_info')).toBe(true);
      expect(fallbackKB.some(doc => doc.id === 'skills')).toBe(true);
      expect(fallbackKB.some(doc => doc.id === 'contact')).toBe(true);
    });
  });

  describe('Embedding and Search', () => {
    test('generates embeddings for text', async () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      const embedding = await chatbot.generateEmbedding('test text');
      
      expect(Array.isArray(embedding)).toBe(true);
      expect(embedding.length).toBe(128);
    });

    test('calculates cosine similarity correctly', () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      const a = [1, 0, 0];
      const b = [1, 0, 0];
      const similarity = chatbot.cosineSimilarity(a, b);
      
      expect(similarity).toBeCloseTo(1, 5);
    });

    test('finds relevant documents', () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      
      // Mock embeddings
      chatbot.embeddings.set('test1', {
        embedding: [1, 0, 0],
        content: 'JavaScript programming',
        keywords: ['javascript', 'programming']
      });
      chatbot.embeddings.set('test2', {
        embedding: [0, 1, 0],
        content: 'Python development',
        keywords: ['python', 'development']
      });
      
      const relevant = chatbot.findRelevantDocuments('javascript', 1);
      
      expect(relevant.length).toBe(1);
      expect(relevant[0].id).toBe('test1');
    });
  });

  describe('Response Generation', () => {
    test('generates greeting response', () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      const response = chatbot.generateIntelligentResponse('hola', []);
      
      expect(response).toContain('Hola! Soy el asistente virtual');
    });

    test('generates technology-specific responses', () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      
      const kubernetesResponse = chatbot.generateIntelligentResponse('kubernetes', []);
      expect(kubernetesResponse).toContain('Kubernetes');
      
      const dockerResponse = chatbot.generateIntelligentResponse('docker', []);
      expect(dockerResponse).toContain('Docker');
    });

    test('generates phone response with WhatsApp', () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      const response = chatbot.generateIntelligentResponse('teléfono', []);
      
      expect(response).toContain('+54 9 11-6250-2232');
      expect(response).toContain('WhatsApp');
      expect(response).toContain('bx bxl-whatsapp');
    });

    test('generates contact response with WhatsApp', () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      const response = chatbot.generateIntelligentResponse('contacto', []);
      
      expect(response).toContain('Email: mnofresno@gmail.com');
      expect(response).toContain('WhatsApp');
      expect(response).toContain('bx bxl-whatsapp');
    });

    test('generates fallback response with WhatsApp', () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      const response = chatbot.generateIntelligentResponse('color favorito', []);
      
      expect(response).toContain('No tengo información específica');
      expect(response).toContain('WhatsApp');
      expect(response).toContain('bx bxl-whatsapp');
    });

    test('detects language correctly', () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      
      document.documentElement.lang = 'es';
      expect(chatbot.getLanguage()).toBe('es');
      
      document.documentElement.lang = 'en';
      expect(chatbot.getLanguage()).toBe('en');
    });

    test('generates multilingual fallback', () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      
      document.documentElement.lang = 'es';
      const responseES = chatbot.generateIntelligentResponse('unknown question', []);
      expect(responseES).toContain('No tengo información específica');
      
      document.documentElement.lang = 'en';
      const responseEN = chatbot.generateIntelligentResponse('unknown question', []);
      expect(responseEN).toContain("I don't have specific information");
    });
  });

  describe('Query Processing', () => {
    test('processes query successfully', async () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      
      // Mock console methods to avoid spam
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const response = await chatbot.processQuery('hola');
      
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
      
      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    test('handles errors gracefully', async () => {
      loadRAGScript();
      const chatbot = new window.RAGChatbot();
      
      // Mock console.error to avoid spam
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Force an error by breaking the DOM
      document.body.innerHTML = '';
      
      const response = await chatbot.processQuery('test');
      
      expect(typeof response).toBe('string');
      expect(response).toContain('Error');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Integration with Widget', () => {
    test('exposes global functions correctly', () => {
      loadRAGScript();
      
      expect(window.RAGChatbot).toBeDefined();
      expect(typeof window.RAGChatbot).toBe('function');
    });

    test('prevents duplicate declarations', () => {
      loadRAGScript();
      
      // Try to load again
      const originalRAG = window.RAGChatbot;
      loadRAGScript();
      
      expect(window.RAGChatbot).toBe(originalRAG);
    });
  });
});

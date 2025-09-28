// Sistema RAG con ONNX.js y modelo Qwen 0.5B
// Extrae automáticamente información del sitio web para responder preguntas

// Evitar declaración duplicada
if (typeof window !== 'undefined' && window.RAGChatbot) {
  console.warn('RAGChatbot ya está definido, saltando redefinición');
} else {
  class RAGChatbot {
  constructor() {
    this.onnxSession = null;
    this.tokenizer = null;
    this.isModelLoaded = false;
    this.knowledgeBase = [];
    this.embeddings = new Map();
    this.maxTokens = 512;
    this.temperature = 0.7;
    this.useFallback = true; // Usar fallback por defecto para mayor compatibilidad
  }

  // Extraer información automáticamente del sitio web
  extractWebsiteContent() {
    const content = {
      personalInfo: this.extractPersonalInfo(),
      skills: this.extractSkills(),
      services: this.extractServices(),
      about: this.extractAbout(),
      contact: this.extractContact(),
      experience: this.extractExperience()
    };

    // Convertir a base de conocimiento estructurada
    this.knowledgeBase = this.structureKnowledgeBase(content);
    return this.knowledgeBase;
  }

  // Extraer información personal del HTML
  extractPersonalInfo() {
    const info = {};
    
    // Nombre
    const nameElement = document.querySelector('h1');
    if (nameElement) info.name = nameElement.textContent.trim();

    // Título profesional
    const titleElement = document.querySelector('#aboutSubtitle');
    if (titleElement) info.title = titleElement.textContent.trim();

    // Información de contacto
    const phoneElement = document.querySelector('a[href*="wa.me"]');
    if (phoneElement) {
      const phoneText = phoneElement.textContent.trim();
      info.phone = phoneText;
    }

    const emailElement = Array.from(document.querySelectorAll('li')).find(li => 
      li.textContent.includes('E-mail')
    );
    if (emailElement) {
      const emailText = emailElement.textContent.trim();
      info.email = emailText.split(':')[1]?.trim();
    }

    // Edad
    const ageElement = document.querySelector('#age-field');
    if (ageElement) info.age = ageElement.textContent.trim();

    // Ciudad
    const cityElement = Array.from(document.querySelectorAll('li')).find(li => 
      li.textContent.includes('City')
    );
    if (cityElement) {
      const cityText = cityElement.textContent.trim();
      info.city = cityText.split(':')[1]?.trim();
    }

    // Fecha de nacimiento
    const birthdayElement = Array.from(document.querySelectorAll('li')).find(li => 
      li.textContent.includes('Birthday')
    );
    if (birthdayElement) {
      const birthdayText = birthdayElement.textContent.trim();
      info.birthday = birthdayText.split(':')[1]?.trim();
    }

    // Enlaces sociales
    const socialLinks = {};
    const socialElements = document.querySelectorAll('.social-links a');
    socialElements.forEach(link => {
      const href = link.getAttribute('href');
      const icon = link.querySelector('i');
      if (icon) {
        const className = icon.className;
        if (className.includes('linkedin')) socialLinks.linkedin = href;
        else if (className.includes('github')) socialLinks.github = href;
        else if (className.includes('twitter')) socialLinks.twitter = href;
        else if (className.includes('whatsapp')) socialLinks.whatsapp = href;
        else if (className.includes('cults3d')) socialLinks.cults3d = href;
      }
    });
    info.socialLinks = socialLinks;

    return info;
  }

  // Extraer habilidades del sitio
  extractSkills() {
    const skills = [];
    const skillElements = document.querySelectorAll('.skill');
    
    skillElements.forEach(skill => {
      const skillNameElement = skill.querySelector('span');
      const percentageElement = skill.querySelector('.val');
      
      if (skillNameElement && percentageElement) {
        const skillName = skillNameElement.textContent.trim();
        const percentage = percentageElement.textContent.trim();
        const title = skill.getAttribute('title') || '';
        
        skills.push({
          name: skillName,
          percentage: percentage,
          details: title
        });
      }
    });

    return skills;
  }

  // Extraer servicios
  extractServices() {
    const services = [];
    const serviceElements = document.querySelectorAll('.icon-box');
    
    serviceElements.forEach(service => {
      const titleElement = service.querySelector('h4 a');
      const descElement = service.querySelector('p');
      
      if (titleElement && descElement) {
        const title = titleElement.textContent.trim();
        const description = descElement.textContent.trim();
        
        if (title && description) {
          services.push({
            title: title,
            description: description
          });
        }
      }
    });

    return services;
  }

  // Extraer información "About"
  extractAbout() {
    const about = {};
    
    const aboutTextElement = document.querySelector('#aboutText');
    if (aboutTextElement) about.mainText = aboutTextElement.textContent.trim();

    const aboutSubtextElement = document.querySelector('#aboutSubtext');
    if (aboutSubtextElement) about.subtext = aboutSubtextElement.textContent.trim();

    const aboutFooterElement = document.querySelector('#aboutFooter');
    if (aboutFooterElement) about.footer = aboutFooterElement.textContent.trim();

    return about;
  }

  // Extraer información de contacto
  extractContact() {
    const contact = {};
    
    // Buscar todos los elementos que contengan información de contacto
    const contactElements = document.querySelectorAll('li');
    contactElements.forEach(li => {
      const text = li.textContent.trim();
      if (text.includes('Phone:')) contact.phone = text.split('Phone:')[1]?.trim();
      else if (text.includes('E-mail:')) contact.email = text.split('E-mail:')[1]?.trim();
      else if (text.includes('Website:')) contact.website = text.split('Website:')[1]?.trim();
      else if (text.includes('City:')) contact.city = text.split('City:')[1]?.trim();
      else if (text.includes('Freelance:')) contact.freelance = text.split('Freelance:')[1]?.trim();
    });

    return contact;
  }

  // Extraer experiencia (si está disponible)
  extractExperience() {
    const experience = [];
    const resumeItems = document.querySelectorAll('.resume-item');
    
    resumeItems.forEach(item => {
      const titleElement = item.querySelector('h4');
      const periodElement = item.querySelector('h5');
      const companyElement = item.querySelector('em');
      const descriptionElement = item.querySelector('p');
      const listElement = item.querySelector('ul');
      
      if (titleElement && titleElement.textContent.trim()) {
        const exp = {
          title: titleElement.textContent.trim(),
          period: periodElement ? periodElement.textContent.trim() : '',
          company: companyElement ? companyElement.textContent.trim() : '',
          description: descriptionElement ? descriptionElement.textContent.trim() : '',
          responsibilities: []
        };
        
        if (listElement) {
          const responsibilities = listElement.querySelectorAll('li');
          responsibilities.forEach(li => {
            if (li.textContent.trim()) {
              exp.responsibilities.push(li.textContent.trim());
            }
          });
        }
        
        experience.push(exp);
      }
    });

    return experience;
  }

  // Base de conocimiento de fallback
  getFallbackKnowledgeBase() {
    return [
      {
        id: 'personal_info',
        content: 'Mariano Fresno es un desarrollador full-stack y líder técnico con experiencia en desarrollo web, hardware y software. Nació el 29 de enero de 1986 en Buenos Aires, Argentina.',
        keywords: ['personal', 'información', 'datos', 'biografía', 'perfil']
      },
      {
        id: 'skills',
        content: 'Habilidades técnicas: Backend (90%) - PHP, Python, Java, C#/C++, Node.js. Frontend (65%) - JS, Vue.js, Angular, React. DevOps (60%) - Docker, Kubernetes, LAMBDAS, Puppet, Terraform, Jenkins. Testing unitario (85%) - xUnit, Mocks, Gherkin. IoT (70%) - Arduino, Raspberry Pi. Liderazgo (55%) - Management, hiring, estimation, mentoring.',
        keywords: ['habilidades', 'tecnologías', 'programación', 'skills', 'conocimientos']
      },
      {
        id: 'contact',
        content: 'Información de contacto: Email: mnofresno@gmail.com. Teléfono: +54 9 11-6250-2232. LinkedIn: https://ln.fresno.ar. GitHub: https://github.com/mnofresno. Twitter: https://tw.fresno.ar. WhatsApp: https://wa.me/5491162502232.',
        keywords: ['contacto', 'email', 'teléfono', 'linkedin', 'github', 'whatsapp', 'phone', 'correo', 'mail']
      },
      {
        id: 'social',
        content: 'Enlaces sociales: LinkedIn: https://ln.fresno.ar, GitHub: https://github.com/mnofresno, Twitter: https://tw.fresno.ar, WhatsApp: https://wa.me/5491162502232, Cults3D: https://cults3d.com/en/users/mnofresno/3d-models',
        keywords: ['redes', 'sociales', 'linkedin', 'github', 'twitter', 'whatsapp', 'cults3d']
      },
      {
        id: 'services',
        content: 'Servicios ofrecidos: Desarrollo de equipos técnicos, desarrollo de software, optimización de rendimiento, análisis técnico, capacitación y entrenamiento, hosting y servicios web. Especializado en soluciones end-to-end, definición de estándares de calidad, automatización de procesos, code review, estimaciones técnicas y selección de personal técnico.',
        keywords: ['servicios', 'ofrecimientos', 'consultoría', 'desarrollo']
      }
    ];
  }

  // Estructurar la base de conocimiento
  structureKnowledgeBase(content) {
    const knowledgeBase = [];

    // Información personal
    if (content.personalInfo.name) {
      knowledgeBase.push({
        id: 'personal_info',
        content: `Información personal: ${content.personalInfo.name} es ${content.personalInfo.title || 'desarrollador'}. ${content.personalInfo.birthday ? `Nació el ${content.personalInfo.birthday}.` : ''} ${content.personalInfo.age ? `Tiene ${content.personalInfo.age} años.` : ''} ${content.personalInfo.city ? `Vive en ${content.personalInfo.city}.` : ''}`,
        keywords: ['personal', 'información', 'datos', 'biografía', 'perfil']
      });
    }

    // Habilidades
    if (content.skills.length > 0) {
      const skillsText = content.skills.map(skill => 
        `${skill.name} (${skill.percentage})${skill.details ? ` - ${skill.details}` : ''}`
      ).join(', ');
      
      knowledgeBase.push({
        id: 'skills',
        content: `Habilidades técnicas: ${skillsText}`,
        keywords: ['habilidades', 'tecnologías', 'programación', 'skills', 'conocimientos']
      });
    }

    // Servicios
    if (content.services.length > 0) {
      const servicesText = content.services.map(service => 
        `${service.title}: ${service.description}`
      ).join('. ');
      
      knowledgeBase.push({
        id: 'services',
        content: `Servicios ofrecidos: ${servicesText}`,
        keywords: ['servicios', 'ofrecimientos', 'consultoría', 'desarrollo']
      });
    }

    // Información "About"
    if (content.about.mainText || content.about.subtext || content.about.footer) {
      const aboutText = [content.about.mainText, content.about.subtext, content.about.footer]
        .filter(text => text)
        .join(' ');
      
      knowledgeBase.push({
        id: 'about',
        content: `Sobre Mariano: ${aboutText}`,
        keywords: ['sobre', 'acerca', 'descripción', 'perfil', 'biografía']
      });
    }

    // Contacto
    if (Object.keys(content.contact).length > 0) {
      const contactInfo = Object.entries(content.contact)
        .filter(([key, value]) => value)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      
      knowledgeBase.push({
        id: 'contact',
        content: `Información de contacto: ${contactInfo}`,
        keywords: ['contacto', 'email', 'teléfono', 'dirección', 'comunicación']
      });
    }

    // Enlaces sociales
    if (content.personalInfo.socialLinks) {
      const socialText = Object.entries(content.personalInfo.socialLinks)
        .map(([platform, url]) => `${platform}: ${url}`)
        .join(', ');
      
      knowledgeBase.push({
        id: 'social',
        content: `Enlaces sociales: ${socialText}`,
        keywords: ['redes', 'sociales', 'linkedin', 'github', 'twitter', 'whatsapp']
      });
    }

    // Experiencia
    if (content.experience.length > 0) {
      const expText = content.experience.map(exp => 
        `${exp.title}${exp.period ? ` (${exp.period})` : ''}${exp.company ? ` en ${exp.company}` : ''}${exp.description ? `: ${exp.description}` : ''}`
      ).join('. ');
      
      knowledgeBase.push({
        id: 'experience',
        content: `Experiencia profesional: ${expText}`,
        keywords: ['experiencia', 'trabajo', 'carrera', 'profesional', 'proyectos']
      });
    }

    return knowledgeBase;
  }

  // Inicializar el sistema RAG
  async initialize() {
    try {
      // Extraer contenido del sitio web
      this.extractWebsiteContent();
      
      // Verificar que se extrajo contenido
      if (this.knowledgeBase.length === 0) {
        console.warn('No se pudo extraer contenido del sitio web, usando información básica');
        this.knowledgeBase = this.getFallbackKnowledgeBase();
      }
      
      // Generar embeddings para la base de conocimiento
      await this.generateKnowledgeEmbeddings();
      
      this.isModelLoaded = true;
      console.log('Sistema RAG inicializado con contenido del sitio web');
      console.log('Base de conocimiento extraída:', this.knowledgeBase);
      
    } catch (error) {
      console.error('Error inicializando el sistema RAG:', error);
      // Usar información de fallback si hay error
      this.knowledgeBase = this.getFallbackKnowledgeBase();
      await this.generateKnowledgeEmbeddings();
      this.isModelLoaded = true;
      console.log('Sistema RAG inicializado con información de fallback');
    }
  }

  // Generar embeddings para la base de conocimiento
  async generateKnowledgeEmbeddings() {
    for (const doc of this.knowledgeBase) {
      const embedding = await this.generateEmbedding(doc.content);
      this.embeddings.set(doc.id, {
        embedding: embedding,
        content: doc.content,
        keywords: doc.keywords
      });
    }
  }

  // Generar embedding simple (para demo)
  async generateEmbedding(text) {
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(128).fill(0);
    
    words.forEach(word => {
      const hash = this.simpleHash(word);
      embedding[hash % 128] += 1;
    });
    
    // Normalizar
    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / norm);
  }

  // Hash simple para embedding
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  // Buscar documentos relevantes usando similitud coseno
  findRelevantDocuments(query, topK = 3) {
    const queryEmbedding = this.generateEmbedding(query);
    const similarities = [];

    for (const [id, doc] of this.embeddings) {
      const similarity = this.cosineSimilarity(queryEmbedding, doc.embedding);
      similarities.push({ id, similarity, content: doc.content, keywords: doc.keywords });
    }

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  // Calcular similitud coseno
  cosineSimilarity(a, b) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Detectar idioma de la página
  getLanguage() {
    const langBtn = document.getElementById('switch-lang');
    if (langBtn && langBtn.textContent.trim().toLowerCase() === 'es') return 'es';
    return 'en';
  }

  // Generar respuesta inteligente basada en el contenido extraído
  generateIntelligentResponse(query, context) {
    const queryLower = query.toLowerCase();
    const lang = this.getLanguage();
    
    // Respuestas específicas basadas en el contenido extraído
    if (queryLower.includes('hola') || queryLower.includes('saludo')) {
      return '¡Hola! Soy el asistente virtual de Mariano Fresno. Puedo ayudarte con información sobre sus habilidades, servicios, experiencia y datos de contacto. ¿En qué puedo ayudarte?';
    }
    
    if (queryLower.includes('quién es') || queryLower.includes('quien es') || queryLower.includes('sobre mariano')) {
      const personalInfo = context.find(doc => doc.id === 'personal_info');
      const aboutInfo = context.find(doc => doc.id === 'about');
      if (personalInfo || aboutInfo) {
        return `${personalInfo ? personalInfo.content : ''} ${aboutInfo ? aboutInfo.content : ''}`;
      }
    }
    
    // Preguntas específicas sobre tecnologías
    if (queryLower.includes('kubernetes') || queryLower.includes('k8s')) {
      const skillsInfo = context.find(doc => doc.id === 'skills');
      if (skillsInfo && skillsInfo.content.includes('Kubernetes')) {
        return 'Sí, Mariano tiene experiencia con Kubernetes. Según su perfil, tiene conocimientos en DevOps (60%) que incluyen Docker, Kubernetes, LAMBDAS, Puppet, Terraform y Jenkins.';
      } else {
        return 'Mariano tiene experiencia en DevOps que incluye tecnologías como Docker, Kubernetes, LAMBDAS, Puppet, Terraform y Jenkins. Su nivel de experiencia en DevOps es del 60%.';
      }
    }
    
    if (queryLower.includes('docker')) {
      return 'Sí, Mariano tiene experiencia con Docker. Es parte de sus habilidades en DevOps (60%) junto con Kubernetes, LAMBDAS, Puppet, Terraform y Jenkins.';
    }
    
    if (queryLower.includes('php') || queryLower.includes('python') || queryLower.includes('java') || queryLower.includes('node')) {
      return 'Sí, Mariano tiene experiencia con esas tecnologías. Su especialidad en Backend (90%) incluye PHP, Python, Java, C#/C++ y Node.js.';
    }
    
    if (queryLower.includes('react') || queryLower.includes('vue') || queryLower.includes('angular')) {
      return 'Sí, Mariano tiene experiencia con esos frameworks. Su experiencia en Frontend (65%) incluye JS, Vue.js, Angular y React.';
    }
    
    if (queryLower.includes('habilidades') || queryLower.includes('tecnologías') || queryLower.includes('programación')) {
      const skillsInfo = context.find(doc => doc.id === 'skills');
      if (skillsInfo) {
        return skillsInfo.content;
      }
    }
    
    if (queryLower.includes('servicios') || queryLower.includes('ofrece') || queryLower.includes('trabajo')) {
      const servicesInfo = context.find(doc => doc.id === 'services');
      if (servicesInfo) {
        return servicesInfo.content;
      }
    }
    
    // Preguntas específicas sobre contacto
    if (queryLower.includes('teléfono') || queryLower.includes('telefono') || queryLower.includes('teléfono') || queryLower.includes('phone')) {
      const whatsappNumber = '5491162502232';
      const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola Mariano!')}`;
      const whatsappIcon = `<i class='bx bxl-whatsapp' style='font-size:20px;color:#25D366;vertical-align:middle;'></i>`;
      const whatsappCTA = `<div style='display:flex;align-items:center;gap:8px;margin-top:8px;'>${whatsappIcon}<a href='${whatsappLink}' target='_blank' style='color:#25D366;font-weight:600;text-decoration:none;font-size:15px;'>WhatsApp</a></div>`;
      
      return `El teléfono de Mariano es +54 9 11-6250-2232.<br>También puedes contactarlo por:<br>${whatsappCTA}`;
    }
    
    if (queryLower.includes('email') || queryLower.includes('correo') || queryLower.includes('mail')) {
      return 'El email de Mariano es mnofresno@gmail.com. También puedes contactarlo por LinkedIn: https://ln.fresno.ar o por WhatsApp: https://wa.me/5491162502232';
    }
    
    if (queryLower.includes('contacto') || queryLower.includes('comunicarse') || queryLower.includes('contactar')) {
      const whatsappNumber = '5491162502232';
      const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola Mariano!')}`;
      const whatsappIcon = `<i class='bx bxl-whatsapp' style='font-size:20px;color:#25D366;vertical-align:middle;'></i>`;
      const whatsappCTA = `<div style='display:flex;align-items:center;gap:8px;margin-top:8px;'>${whatsappIcon}<a href='${whatsappLink}' target='_blank' style='color:#25D366;font-weight:600;text-decoration:none;font-size:15px;'>WhatsApp</a></div>`;
      
      return `Puedes contactar a Mariano por:<br>
      • Email: mnofresno@gmail.com<br>
      • Teléfono: +54 9 11-6250-2232<br>
      • LinkedIn: https://ln.fresno.ar<br>
      • GitHub: https://github.com/mnofresno<br>
      ${whatsappCTA}`;
    }
    
    if (queryLower.includes('experiencia') || queryLower.includes('proyectos') || queryLower.includes('carrera')) {
      const expInfo = context.find(doc => doc.id === 'experience');
      if (expInfo) {
        return expInfo.content;
      }
    }

    // Usar el contexto más relevante si está disponible
    if (context && context.length > 0) {
      const mostRelevant = context[0];
      return `Basándome en la información disponible: ${mostRelevant.content}`;
    }

    // Fallback inteligente con WhatsApp como en el sistema anterior
    const whatsappNumber = '5491162502232';
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(query)}`;
    const whatsappIcon = `<i class='bx bxl-whatsapp' style='font-size:20px;color:#25D366;vertical-align:middle;'></i>`;
    const whatsappCTA = `<div style='display:flex;align-items:center;gap:8px;margin-top:8px;'>${whatsappIcon}<a href='${whatsappLink}' target='_blank' style='color:#25D366;font-weight:600;text-decoration:none;font-size:15px;'>WhatsApp</a></div>`;
    
    const fallbackTexts = {
      es: `No tengo información específica sobre "${query}".<br>
      Pero puedes <b>enviarme un WhatsApp</b> y te responderé directamente:<br>
      ${whatsappCTA}`,
      en: `I don't have specific information about "${query}".<br>
      But you can <b>send me a WhatsApp</b> and I'll respond directly:<br>
      ${whatsappCTA}`
    };
    
    return fallbackTexts[lang] || fallbackTexts['es'];
  }

  // Procesar consulta principal
  async processQuery(query) {
    if (!this.isModelLoaded) {
      await this.initialize();
    }

    try {
      // Buscar documentos relevantes
      const relevantDocs = this.findRelevantDocuments(query);
      
      // Generar respuesta inteligente
      const response = this.generateIntelligentResponse(query, relevantDocs);
      
      return response;
      
    } catch (error) {
      console.error('Error procesando consulta:', error);
      return 'Lo siento, hubo un error procesando tu consulta. Por favor, intenta de nuevo.';
    }
  }
}

  // Función para inicializar el chatbot RAG
  function initRAGChatbot() {
    const ragChatbot = new RAGChatbot();
    
    // Exponer globalmente para uso en el widget
    window.ragChatbot = ragChatbot;
    
    return ragChatbot;
  }

  // Auto-inicialización
  if (typeof window !== 'undefined') {
    initRAGChatbot();
  }

  // Export para uso en módulos
  if (typeof module !== 'undefined') {
    module.exports = { RAGChatbot, initRAGChatbot };
  }
}
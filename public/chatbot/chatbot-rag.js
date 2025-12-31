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
      experience: this.extractExperience(),
      cvs: this.extractCVInfo()
    };

    // Convertir a base de conocimiento estructurada
    this.knowledgeBase = this.structureKnowledgeBase(content);
    return this.knowledgeBase;
  }

  // Extraer información de CVs disponibles
  extractCVInfo() {
    const BASE_DOWNLOAD_URL = 'https://github.com/mnofresno/mariano-portfolio/releases/latest/download';
    
    // Intentar obtener información de CVs desde window.cvInfo (seteado por cv-badges.js)
    if (window.cvInfo && window.cvInfo.variants) {
      return {
        variants: window.cvInfo.variants
      };
    }
    
    // Fallback: información estática con URLs directas (sin necesidad de API)
    return {
      variants: [
        { name: 'General (EN)', file: 'CV-en.pdf', lang: 'en', variant: 'general', downloadUrl: `${BASE_DOWNLOAD_URL}/CV-en.pdf` },
        { name: 'Development (EN)', file: 'CV-en-dev.pdf', lang: 'en', variant: 'dev', downloadUrl: `${BASE_DOWNLOAD_URL}/CV-en-dev.pdf` },
        { name: 'Tech Lead (EN)', file: 'CV-en-lead.pdf', lang: 'en', variant: 'lead', downloadUrl: `${BASE_DOWNLOAD_URL}/CV-en-lead.pdf` },
        { name: 'IoT & Electronics (EN)', file: 'CV-en-iot.pdf', lang: 'en', variant: 'iot', downloadUrl: `${BASE_DOWNLOAD_URL}/CV-en-iot.pdf` },
        { name: 'General (ES)', file: 'CV-es.pdf', lang: 'es', variant: 'general', downloadUrl: `${BASE_DOWNLOAD_URL}/CV-es.pdf` },
        { name: 'Desarrollo (ES)', file: 'CV-es-dev.pdf', lang: 'es', variant: 'dev', downloadUrl: `${BASE_DOWNLOAD_URL}/CV-es-dev.pdf` },
        { name: 'Líder Técnico (ES)', file: 'CV-es-lead.pdf', lang: 'es', variant: 'lead', downloadUrl: `${BASE_DOWNLOAD_URL}/CV-es-lead.pdf` },
        { name: 'IoT y Electrónica (ES)', file: 'CV-es-iot.pdf', lang: 'es', variant: 'iot', downloadUrl: `${BASE_DOWNLOAD_URL}/CV-es-iot.pdf` }
      ]
    };
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

    // CVs disponibles
    if (content.cvs && content.cvs.variants) {
      const cvInfo = content.cvs;
      const cvText = cvInfo.variants.map(v => {
        const url = v.downloadUrl || `https://github.com/mnofresno/mariano-portfolio/releases/latest/download/${v.file}`;
        return `${v.name}: ${url}`;
      }).join('\n');
      
      knowledgeBase.push({
        id: 'cvs',
        content: `CVs disponibles:\n${cvText}`,
        keywords: ['cv', 'curriculum', 'resume', 'descargar', 'download', 'pdf', 'hoja de vida']
      });
    }

    // Información "About"
    if (content.about && (content.about.mainText || content.about.subtext || content.about.footer)) {
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
    const htmlLang = document.documentElement.getAttribute('lang');
    if (htmlLang && (htmlLang === 'es' || htmlLang === 'en')) return htmlLang;
    const langBtn = document.getElementById('switch-lang');
    if (langBtn && langBtn.textContent.trim().toLowerCase() === 'es') return 'es';
    return 'en';
  }

  // System prompt para el LLM
  getSystemPrompt() {
    const lang = this.getLanguage();
    const isEnglish = lang === 'en';
    
    return isEnglish 
      ? `You are an AI assistant helping recruiters find the right CV version for Mariano Fresno.

Available CV variants:
- "general": General CV with all experience
- "dev": Development-focused CV (backend, frontend, full-stack, programming, software development)
- "lead": Tech Lead CV (leadership, team management, mentoring, architecture, senior roles)
- "iot": IoT & Electronics CV (hardware, embedded systems, Arduino, Raspberry Pi, sensors, electronics)

Your task:
1. Analyze the user's query to understand what type of position or role they're looking for
2. Determine the most relevant CV variant based on keywords and context
3. Detect the preferred language (English "en" or Spanish "es") from the query or use the current page language
4. Return a structured JSON response with:
   - "cvVariant": one of "general", "dev", "lead", or "iot"
   - "language": "en" or "es"
   - "reasoning": brief explanation of why this CV was selected
   - "needsCV": boolean indicating if the query is CV-related

Examples:
- "I'm looking for a backend developer" → {"cvVariant": "dev", "language": "en", "reasoning": "Query mentions backend developer role", "needsCV": true}
- "Busco un líder técnico" → {"cvVariant": "lead", "language": "es", "reasoning": "Query mentions tech lead role in Spanish", "needsCV": true}
- "What's your experience with IoT?" → {"cvVariant": "iot", "language": "en", "reasoning": "Query about IoT experience", "needsCV": true}
- "What's your phone number?" → {"cvVariant": null, "language": "en", "reasoning": "Not a CV-related query", "needsCV": false}

Always respond with valid JSON only, no additional text.`
      : `Eres un asistente de IA que ayuda a reclutadores a encontrar la versión correcta del CV de Mariano Fresno.

Variantes de CV disponibles:
- "general": CV general con toda la experiencia
- "dev": CV enfocado en desarrollo (backend, frontend, full-stack, programación, desarrollo de software)
- "lead": CV de Líder Técnico (liderazgo, gestión de equipos, mentoring, arquitectura, roles senior)
- "iot": CV de IoT y Electrónica (hardware, sistemas embebidos, Arduino, Raspberry Pi, sensores, electrónica)

Tu tarea:
1. Analiza la consulta del usuario para entender qué tipo de posición o rol están buscando
2. Determina la variante de CV más relevante basándote en palabras clave y contexto
3. Detecta el idioma preferido (inglés "en" o español "es") de la consulta o usa el idioma de la página actual
4. Retorna una respuesta JSON estructurada con:
   - "cvVariant": una de "general", "dev", "lead", o "iot"
   - "language": "en" o "es"
   - "reasoning": breve explicación de por qué se seleccionó este CV
   - "needsCV": booleano indicando si la consulta está relacionada con CVs

Ejemplos:
- "Busco un desarrollador backend" → {"cvVariant": "dev", "language": "es", "reasoning": "Consulta menciona rol de desarrollador backend", "needsCV": true}
- "I need a tech lead" → {"cvVariant": "lead", "language": "en", "reasoning": "Consulta menciona tech lead en inglés", "needsCV": true}
- "¿Cuál es tu experiencia con IoT?" → {"cvVariant": "iot", "language": "es", "reasoning": "Consulta sobre experiencia en IoT", "needsCV": true}
- "¿Cuál es tu teléfono?" → {"cvVariant": null, "language": "es", "reasoning": "Consulta no relacionada con CV", "needsCV": false}

Siempre responde solo con JSON válido, sin texto adicional.`;
  }

  // Llamar al LLM del browser para detectar CV relevante
  // Usa el mismo sistema de generación que el chatbot pero con un prompt estructurado
  async detectRelevantCVWithLLM(query) {
    try {
      // Si hay un LLM disponible en el browser (ONNX, Transformers.js, etc.)
      if (this.onnxSession && !this.useFallback) {
        // Usar el LLM real con el system prompt estructurado
        const systemPrompt = this.getSystemPrompt();
        const fullPrompt = `${systemPrompt}\n\nUser query: ${query}\n\nResponse (JSON only):`;
        
        // Generar respuesta usando el modelo ONNX
        const response = await this.generateWithLLM(fullPrompt);
        
        // Intentar parsear JSON de la respuesta
        try {
          // Limpiar la respuesta para extraer solo el JSON
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.warn('Could not parse LLM response as JSON:', e);
        }
      }
      
      // Si hay un LLM disponible vía API o función global
      if (window.generateWithLLM && typeof window.generateWithLLM === 'function') {
        const systemPrompt = this.getSystemPrompt();
        const fullPrompt = `${systemPrompt}\n\nUser query: ${query}\n\nResponse (JSON only):`;
        
        const response = await window.generateWithLLM(fullPrompt);
        
        try {
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.warn('Could not parse LLM response as JSON:', e);
        }
      }
      
      // Fallback: usar detección inteligente mejorada
      return this.detectRelevantCVFallback(query);
      
    } catch (error) {
      console.warn('Error calling LLM, using fallback:', error);
      return this.detectRelevantCVFallback(query);
    }
  }

  // Generar texto usando el LLM del browser (ONNX o similar)
  async generateWithLLM(prompt) {
    // Si hay un modelo ONNX cargado
    if (this.onnxSession && this.tokenizer) {
      // TODO: Implementar generación real con ONNX
      // Por ahora retornar null para usar fallback
      return null;
    }
    
    // Si hay una función global de generación
    if (window.generateWithLLM && typeof window.generateWithLLM === 'function') {
      return await window.generateWithLLM(prompt);
    }
    
    return null;
  }

  // Fallback mejorado (temporal) - será reemplazado por LLM real
  detectRelevantCVFallback(query) {
    const queryLower = query.toLowerCase();
    const lang = this.getLanguage();
    
    // Detectar si es relacionado con CV
    const cvKeywords = ['cv', 'curriculum', 'resume', 'hoja de vida', 'descargar', 'download', 
                        'perfil', 'profile', 'experiencia', 'experience', 'trabajo', 'job',
                        'posición', 'position', 'vacante', 'vacancy', 'busco', 'looking for',
                        'contratar', 'hire', 'reclutar', 'recruit', 'candidato', 'candidate'];
    
    const needsCV = cvKeywords.some(kw => queryLower.includes(kw));
    
    if (!needsCV) {
      return { cvVariant: null, language: lang, reasoning: 'Not a CV-related query', needsCV: false };
    }
    
    // Detectar variante
    const devKeywords = ['desarrollo', 'development', 'desarrollador', 'developer', 'programador', 'programmer', 
                        'código', 'code', 'software', 'backend', 'frontend', 'full stack', 'fullstack', 
                        'aplicación', 'app', 'web', 'api', 'programming'];
    const leadKeywords = ['líder', 'lead', 'leadership', 'liderazgo', 'manager', 'management', 'equipo', 'team',
                         'coordinador', 'coordinate', 'mentor', 'mentoring', 'arquitecto', 'architect', 
                         'senior', 'principal', 'tech lead', 'technical lead'];
    const iotKeywords = ['iot', 'internet of things', 'electrónica', 'electronics', 'hardware', 'arduino', 
                        'raspberry', 'embedded', 'embebido', 'máquina', 'machine', 'sensor', 'actuador', 
                        'actuator', 'placa', 'board', 'circuito', 'circuit'];
    
    let variant = 'general';
    let reasoning = 'General CV recommended';
    
    if (iotKeywords.some(kw => queryLower.includes(kw))) {
      variant = 'iot';
      reasoning = 'Query mentions IoT, electronics, or hardware';
    } else if (leadKeywords.some(kw => queryLower.includes(kw))) {
      variant = 'lead';
      reasoning = 'Query mentions leadership, management, or senior roles';
    } else if (devKeywords.some(kw => queryLower.includes(kw))) {
      variant = 'dev';
      reasoning = 'Query mentions development, programming, or software';
    }
    
    // Detectar idioma
    const preferEnglish = queryLower.includes('inglés') || queryLower.includes('english') || 
                         queryLower.includes(' en ') || queryLower.endsWith(' en');
    const preferSpanish = queryLower.includes('español') || queryLower.includes('spanish') || 
                         queryLower.includes(' es ') || queryLower.endsWith(' es');
    
    const detectedLang = preferEnglish ? 'en' : (preferSpanish ? 'es' : lang);
    
    return {
      cvVariant: variant,
      language: detectedLang,
      reasoning: reasoning,
      needsCV: true
    };
  }

  // Generar respuesta inteligente basada en el contenido extraído
  async generateIntelligentResponse(query, context) {
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

    // Obtener idioma actual
    const currentLang = this.getLanguage();

    // Función para crear badge bonito embebido
    const createCVBadge = (variantObj, downloadUrl, lang) => {
      const variantNames = {
        'general': { en: 'General CV', es: 'CV General' },
        'dev': { en: 'Development CV', es: 'CV Desarrollo' },
        'lead': { en: 'Tech Lead CV', es: 'CV Líder Técnico' },
        'iot': { en: 'IoT & Electronics CV', es: 'CV IoT y Electrónica' }
      };
      
      // Obtener el tipo de variant (puede ser un objeto con .variant o directamente el string)
      const variantType = (typeof variantObj === 'object' && variantObj.variant) ? variantObj.variant : variantObj;
      
      // Obtener el nombre, priorizando el nombre del objeto, luego el mapeo, luego fallback
      const name = variantObj.name || variantNames[variantType]?.[lang] || variantNames[variantType]?.['en'] || 'CV';
      
      return `
        <div style="
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          margin: 8px 0;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
          text-decoration: none;
          max-width: 100%;
        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(102, 126, 234, 0.4)';" 
           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.3)';"
           onclick="window.open('${downloadUrl}', '_blank')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span style="font-weight: 600; font-size: 15px; white-space: nowrap;">${name}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; opacity: 0.9;">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </div>
      `;
    };

    // Usar LLM para detectar CV relevante (con fallback inteligente)
    const cvDetection = await this.detectRelevantCVWithLLM(query);

    if (cvDetection && cvDetection.needsCV) {
      const cvInfo = context.find(doc => doc.id === 'cvs');
      
      // Intentar obtener información dinámica de window.cvInfo
      let cvData = null;
      const BASE_DOWNLOAD_URL = 'https://github.com/mnofresno/mariano-portfolio/releases/latest/download';
      
      if (window.cvInfo && window.cvInfo.variants) {
        cvData = window.cvInfo;
      } else if (cvInfo) {
        // Parsear desde el contexto si está disponible
        cvData = { variants: [] };
      }

      if (cvData && cvData.variants && cvData.variants.length > 0) {
        const lang = currentLang;
        const isEnglish = lang === 'en';
        
        // Usar la detección del LLM
        const detectedVariant = cvDetection.cvVariant || 'general';
        const detectedLang = cvDetection.language || lang;
        
        // Buscar el CV más relevante basado en la detección del LLM
        const relevantCV = cvData.variants.find(v => 
          v.variant === detectedVariant && v.lang === detectedLang
        ) || cvData.variants.find(v => v.variant === detectedVariant) || 
        cvData.variants.find(v => v.lang === detectedLang) ||
        cvData.variants.find(v => v.variant === 'general' && v.lang === detectedLang) ||
        cvData.variants[0];

        if (relevantCV) {
          const url = relevantCV.downloadUrl || `${BASE_DOWNLOAD_URL}/${relevantCV.file}`;
          const badge = createCVBadge(relevantCV, url, lang);
          
          const responseText = isEnglish 
            ? `Based on your question, I recommend this CV version:<br><br>${badge}<br><br><small style="color: #666;">You can also ask for a specific version: Development, Tech Lead, or IoT & Electronics (in English or Spanish).</small>`
            : `Según tu pregunta, te recomiendo esta versión de CV:<br><br>${badge}<br><br><small style="color: #666;">También puedes pedir una versión específica: Desarrollo, Líder Técnico o IoT y Electrónica (en inglés o español).</small>`;

          return responseText;
        }
      }
      
      // Fallback: mostrar todos los CVs disponibles
      if (cvData && cvData.variants && cvData.variants.length > 0) {
        const lang = this.getLanguage();
        const isEnglish = lang === 'en';
        
        // Filtrar por idioma si se especifica
        const filteredVariants = cvData.variants.filter(v => {
          if (queryLower.includes('inglés') || queryLower.includes('english') || queryLower.includes('en')) {
            return v.lang === 'en';
          }
          if (queryLower.includes('español') || queryLower.includes('spanish') || queryLower.includes('es')) {
            return v.lang === 'es';
          }
          // Si pregunta por variante específica
          if (queryLower.includes('dev') || queryLower.includes('desarrollo') || queryLower.includes('development')) {
            return v.variant === 'dev';
          }
          if (queryLower.includes('lead') || queryLower.includes('líder') || queryLower.includes('tech lead')) {
            return v.variant === 'lead';
          }
          if (queryLower.includes('iot') || queryLower.includes('electrónica') || queryLower.includes('electronics')) {
            return v.variant === 'iot';
          }
          // Por defecto, mostrar todos
          return true;
        });

        const variantsToShow = filteredVariants.length > 0 ? filteredVariants : cvData.variants;

        const cvBadges = variantsToShow.map(v => {
          const url = v.downloadUrl || `${BASE_DOWNLOAD_URL}/${v.file}`;
          return createCVBadge(v, url, currentLang);
        }).join('');

        const responseText = isEnglish 
          ? `Here are the available CVs:<br><br>${cvBadges}<br><br><small style="color: #666;">Click on any badge to download the PDF.</small>`
          : `Aquí están los CVs disponibles:<br><br>${cvBadges}<br><br><small style="color: #666;">Haz clic en cualquier badge para descargar el PDF.</small>`;

        return responseText;
      } else {
        // Fallback si no hay información dinámica
        const fallbackUrl = 'https://github.com/mnofresno/mariano-portfolio/releases/latest';
        const responseText = lang === 'en'
          ? `You can download my CVs from GitHub Releases: <a href="${fallbackUrl}" target="_blank" style="color: #667eea; font-weight: 600;">${fallbackUrl}</a><br><br>Available variants: General, Development, Tech Lead, and IoT & Electronics (in English and Spanish).`
          : `Puedes descargar mis CVs desde GitHub Releases: <a href="${fallbackUrl}" target="_blank" style="color: #667eea; font-weight: 600;">${fallbackUrl}</a><br><br>Variantes disponibles: General, Desarrollo, Líder Técnico e IoT y Electrónica (en inglés y español).`;
        return responseText;
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
      // Si la consulta es sobre CVs y window.cvInfo no está disponible, intentar esperar un poco
      const queryLower = query.toLowerCase();
      if ((queryLower.includes('cv') || queryLower.includes('curriculum') || queryLower.includes('resume')) 
          && !window.cvInfo) {
        // Esperar un poco para que cv-badges.js termine de cargar
        await new Promise(resolve => setTimeout(resolve, 500));
        // Si aún no está disponible, usar URLs directas sin necesidad de API
        if (!window.cvInfo) {
          const BASE_DOWNLOAD_URL = 'https://github.com/mnofresno/mariano-portfolio/releases/latest/download';
          const variants = [
            { name: 'General (EN)', file: 'CV-en.pdf', lang: 'en', variant: 'general', downloadUrl: `${BASE_DOWNLOAD_URL}/CV-en.pdf` },
            { name: 'Development (EN)', file: 'CV-en-dev.pdf', lang: 'en', variant: 'dev', downloadUrl: `${BASE_DOWNLOAD_URL}/CV-en-dev.pdf` },
            { name: 'Tech Lead (EN)', file: 'CV-en-lead.pdf', lang: 'en', variant: 'lead', downloadUrl: `${BASE_DOWNLOAD_URL}/CV-en-lead.pdf` },
            { name: 'IoT & Electronics (EN)', file: 'CV-en-iot.pdf', lang: 'en', variant: 'iot', downloadUrl: `${BASE_DOWNLOAD_URL}/CV-en-iot.pdf` },
            { name: 'General (ES)', file: 'CV-es.pdf', lang: 'es', variant: 'general', downloadUrl: `${BASE_DOWNLOAD_URL}/CV-es.pdf` },
            { name: 'Desarrollo (ES)', file: 'CV-es-dev.pdf', lang: 'es', variant: 'dev', downloadUrl: `${BASE_DOWNLOAD_URL}/CV-es-dev.pdf` },
            { name: 'Líder Técnico (ES)', file: 'CV-es-lead.pdf', lang: 'es', variant: 'lead', downloadUrl: `${BASE_DOWNLOAD_URL}/CV-es-lead.pdf` },
            { name: 'IoT y Electrónica (ES)', file: 'CV-es-iot.pdf', lang: 'es', variant: 'iot', downloadUrl: `${BASE_DOWNLOAD_URL}/CV-es-iot.pdf` }
          ];
          window.cvInfo = { variants: variants };
        }
      }

      // Buscar documentos relevantes
      const relevantDocs = this.findRelevantDocuments(query);
      
      // Generar respuesta inteligente (ahora es async)
      const response = await this.generateIntelligentResponse(query, relevantDocs);
      
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
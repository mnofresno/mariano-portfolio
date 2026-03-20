(function () {
    var textsToShow = {
        en: {
            heroTypedItems: "I build automation that replaces manual workflows, I create AI systems that debug complex issues, I deploy pipelines that reduce deployment time by 85%, I architect solutions that unify disparate systems",
            aboutText: "I build AI-powered automation systems that replace manual processes, debug complex technical issues, and deploy production-ready solutions with measurable ROI.",
            aboutFooter: "I have a keen interest in delving into technical intricacies, crafting comprehensive end-to-end solutions, defining stringent quality standards, and infusing innovation into our technical and product roadmap. Beyond my professional pursuits, I'm an avid 3D designer and printer, actively contributing to the vibrant maker community. I excel in producing efficient documentation, streamlining and automating workflows, enforcing and disseminating code review policies, and fostering collaborative interactions with upper management. I'm committed to delivering top-notch results, always prioritizing quality in every endeavor. Additionally, I conduct interviews and select technical talent through a thoughtful and approachable evaluation process, offering timely and constructive feedback both to and about candidates.",
            aboutSubtitle: "AI-Powered System Builder",
            aboutSubtext: "I build automation systems that replace manual work, debug complex technical issues, and deliver measurable ROI.",
            skillsSubtitle: "Here is a brief list of some of my competencies and the level at which I currently perform at each of those.",
            socialFooter: "You can contact me through all these social networks or using the contact information in the 'About' section.",
            servicesSubtitle: "Turn-key automation systems with measurable ROI",
            serviceTechTeams: "AI-Powered Automation",
            serviceTechTeamsDesc: "Custom automation system using LLM agents for task execution and error recovery. Reduce manual work by 80%+ with automated quality checks.",
            serviceDev: "Automated Deployment Pipeline",
            serviceDevDesc: "End-to-end CI/CD pipeline with automated testing, security scanning, and rollback. Deploy in under 5 minutes vs. 30+ minutes manually.",
            servicePerformance: "Infrastructure Intelligence",
            servicePerformanceDesc: "Proactive monitoring system with AI-driven anomaly detection and auto-remediation. Identify issues before they impact users with 95% accuracy.",
            serviceAnalysis: "Analysis and QA",
            serviceAnalysisDesc: "Functional analysis of use cases of existing and projected systems, generation of documentation and estimates. Coverage analysis and continuous quality improvement.",
            serviceTraining: "Trainings",
            serviceTrainingDesc: "Team mentoring, tailor-made training, code review, content generation for technical learning.",
            serviceHosting: "Web Hosting",
            serviceHostingDesc: "Automated deployment of CI/CD, cloud services for delivered projects and pre-existing systems, domain and SSL certificates management.",
            cults3dTitle: "3D Designs",
            cults3dSubtitle: "Some of my 3D model designs.",
            cultsLoadingStatus: "Loading 3D models…",
            cultsViewAll: "View all on Cults3D",
            langTooltip: "Change language",
            cvDownloadTitle: "📄 Download My Resume",
            cvDownloadSubtitle: "Choose your preferred language and specialization",
            cvTabEn: "English",
            cvTabEs: "Español"
        },
        es: {
            heroTypedItems: "Construyo automatización que reemplaza flujos manuales, Creo sistemas de IA que depuran problemas complejos, Despliego pipelines que reducen tiempo de deployment en 85%, Arquitecto soluciones que unifican sistemas dispares",
            aboutText: "Construyo sistemas de automatización impulsados por IA que reemplazan procesos manuales, depuran problemas técnicos complejos y despliegan soluciones listas para producción con ROI medible.",
            aboutFooter: "Tengo un gran interés en investigar y analizar asuntos técnicos, desarrollar soluciones integrales, establecer rigurosos estándares de calidad y aportar innovación a la estrategia técnica y de productos. Más allá de mis compromisos profesionales, soy un apasionado diseñador e impresor 3D, participando activamente en la vibrante comunidad maker. Destaco en la generación de documentación eficiente, la mejora y automatización de procesos, la implementación y comunicación de políticas de revisión de código, así como en la interacción con la alta dirección. Mi compromiso principal es entregar resultados de alta calidad en todo momento. Además, conduzco entrevistas y selecciono personal técnico a través de un proceso de evaluación relajado y accesible, brindando retroalimentación oportuna tanto a los candidatos como sobre ellos.",
            aboutSubtitle: "Constructor de Sistemas con IA",
            aboutSubtext: "Construyo sistemas de automatización que reemplazan trabajo manual, depuran problemas técnicos complejos y entregan ROI medible.",
            skillsSubtitle: "Aquí se encuentra una lista resumida de algunas de mis competencias y el nivel con el que actualmente me desempeño en cada una.",
            socialFooter: "Puede comunicarse conmigo a través de todas éstas redes sociales o utilizando los datos de contacto de la sección 'About'.",
            servicesSubtitle: "Sistemas de automatización llave en mano con ROI medible",
            serviceTechTeams: "Automatización con IA",
            serviceTechTeamsDesc: "Sistema de automatización personalizado usando agentes LLM para ejecución de tareas y recuperación de errores. Reduce trabajo manual en 80%+ con controles de calidad automatizados.",
            serviceDev: "Pipeline de Deployment Automatizado",
            serviceDevDesc: "Pipeline CI/CD de extremo a extremo con testing automatizado, escaneo de seguridad y rollback. Despliega en menos de 5 minutos vs. 30+ minutos manualmente.",
            servicePerformance: "Inteligencia de Infraestructura",
            servicePerformanceDesc: "Sistema de monitoreo proactivo con detección de anomalías impulsada por IA y auto-remediación. Identifica problemas antes de que impacten usuarios con 95% de precisión.",
            serviceAnalysis: "Análisis y Control de Calidad",
            serviceAnalysisDesc: "Análisis funcional de casos de uso nuevos y existentes, generación de documentación y estimaciones. Análisis de cobertura y mejora continua de la calidad.",
            serviceTraining: "Capacitaciones",
            serviceTrainingDesc: "Mentoreo de equipos, capacitaciones a medida, revisión de código, generación de contenidos para aprendizajes técnicos.",
            serviceHosting: "Web Hosting",
            serviceHostingDesc: "Despliegue automatizado CI/CD, cloud services para proyectos propios y sistemas pre-existentes, gestión de dominios y certificados SSL.",
            cults3dTitle: "Diseños 3D",
            cults3dSubtitle: "Algunos de mis diseños de modelos 3D.",
            cultsLoadingStatus: "Cargando modelos 3D…",
            cultsViewAll: "Ver todos en Cults3D",
            langTooltip: "Cambiar idioma",
            cvDownloadTitle: "📄 Descargar mi CV",
            cvDownloadSubtitle: "Elige tu idioma y especialización preferida",
            cvTabEn: "Inglés",
            cvTabEs: "Español"
        },
        pt: {
            heroTypedItems: "Eu construo automação que substitui fluxos manuais, Eu crio sistemas de IA que depuram problemas complexos, Eu implanto pipelines que reduzem tempo de implantação em 85%, Eu arquiteto soluções que unificam sistemas distintos",
            aboutText: "Eu construo sistemas de automação alimentados por IA que substituem processos manuais, depuram problemas técnicos complexos e implantam soluções prontas para produção com ROI mensurável.",
            aboutFooter: "Tenho grande interesse em explorar detalhes técnicos, desenvolver soluções completas de ponta a ponta, definir padrões rigorosos de qualidade e trazer inovação para o roadmap técnico e de produtos. Além das minhas atividades profissionais, sou um entusiasta designer e impressor 3D, participando ativamente da vibrante comunidade maker. Destaco-me na produção de documentação eficiente, otimização e automatização de fluxos de trabalho, implementação e disseminação de políticas de revisão de código, além de promover interações colaborativas com a alta gestão. Estou comprometido em entregar resultados de alta qualidade, sempre priorizando a excelência em cada projeto. Também conduzo entrevistas e seleciono talentos técnicos através de um processo de avaliação acessível e atencioso, oferecendo feedback oportuno e construtivo tanto para quanto sobre os candidatos.",
            aboutSubtitle: "Construtor de Sistemas com IA",
            aboutSubtext: "Eu construo sistemas de automação que substituem trabalho manual, depuram problemas técnicos complexos e entregam ROI mensurável.",
            skillsSubtitle: "Aqui está uma breve lista de algumas das minhas competências e o nível em que atualmente me desempenho em cada uma delas.",
            socialFooter: "Você pode entrar em contato comigo através de todas essas redes sociais ou usando as informações de contato na seção 'About'.",
            servicesSubtitle: "Sistemas de automação turn-key com ROI mensurável",
            serviceTechTeams: "Automação com IA",
            serviceTechTeamsDesc: "Sistema de automação personalizado usando agentes LLM para execução de tarefas e recuperação de erros. Reduz trabalho manual em 80%+ com verificações de qualidade automatizadas.",
            serviceDev: "Pipeline de Implantação Automatizada",
            serviceDevDesc: "Pipeline CI/CD de ponta a ponta com testes automatizados, varredura de segurança e rollback. Implanta em menos de 5 minutos vs. 30+ minutos manualmente.",
            servicePerformance: "Inteligência de Infraestrutura",
            servicePerformanceDesc: "Sistema de monitoramento proativo com detecção de anomalias alimentada por IA e auto-remediação. Identifica problemas antes de impactar usuários com 95% de precisão.",
            serviceAnalysis: "Análise e QA",
            serviceAnalysisDesc: "Análise funcional de casos de uso de sistemas existentes e projetados, geração de documentação e estimativas. Análise de cobertura e melhoria contínua da qualidade.",
            serviceTraining: "Treinamentos",
            serviceTrainingDesc: "Mentoria de equipes, treinamentos personalizados, revisão de código, geração de conteúdo para aprendizado técnico.",
            serviceHosting: "Hospedagem Web",
            serviceHostingDesc: "Implantação automatizada de CI/CD, serviços em nuvem para projetos entregues e sistemas pré-existentes, gestão de dominios e certificados SSL.",
            cults3dTitle: "Designs 3D",
            cults3dSubtitle: "Alguns dos meus designs de modelos 3D.",
            cultsLoadingStatus: "Carregando modelos 3D…",
            cultsViewAll: "Ver todos no Cults3D",
            langTooltip: "Mudar idioma",
            cvDownloadTitle: "📄 Baixar Meu Currículo",
            cvDownloadSubtitle: "Escolha seu idioma e especialização preferidos",
            cvTabEn: "Inglês",
            cvTabEs: "Espanhol"
        }
    };

    $(function () {
        var langs = ["EN", "ES", "PT"];
        var langOptions = $(".lang-opt");
        var langTrigger = $(".lang-trigger");

        // Get saved language or default to EN
        var savedLang = localStorage.getItem('portfolio-lang');
        var currentLang = savedLang ? savedLang.toUpperCase() : "EN";
        if (langs.indexOf(currentLang) === -1) currentLang = "EN";

        // Update active state on language options
        function updateActiveState() {
            langOptions.removeClass('active');
            langOptions.filter('[data-lang="' + currentLang + '"]').addClass('active');

            // Update tooltip text on the custom tooltip element
            var tooltipText = textsToShow[currentLang.toLowerCase()].langTooltip;
            $("#lang-tooltip-text").text(tooltipText);

            // Also remove the native title to avoid double tooltips
            langTrigger.removeAttr('title');
        }

        // Apply translations for current language
        function changeTo(lang) {
            var lowerCaseLang = lang.toLowerCase();
            Object.keys(textsToShow[lowerCaseLang]).forEach(function (elementId) {
                if (elementId === 'heroTypedItems') {
                    $("#hero-typed").attr('data-typed-items', textsToShow[lowerCaseLang][elementId]);
                    if (window.initTyped) {
                        window.initTyped();
                    }
                } else {
                    $("#" + elementId).text(textsToShow[lowerCaseLang][elementId]);
                }
            });
            localStorage.setItem('portfolio-lang', lang);
        }

        // Handle click on language options
        langOptions.on("click", function (e) {
            e.preventDefault();
            e.stopPropagation(); // Avoid triggering parent links
            var newLang = $(this).data('lang');
            if (newLang !== currentLang) {
                currentLang = newLang;
                changeTo(currentLang);
                updateActiveState();
            }
        });

        // Initialize: apply current language and update active state
        changeTo(currentLang);
        updateActiveState();
    });
})();
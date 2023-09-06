(function() {
    var textsToShow = {
        en: {
            iam: "I'm",
            aboutText: "I communicate ideas clearly and I am passionate about teaching technical concepts. I create personalized, creative tech solutions for my clients.",
            aboutFooter: "I have a keen interest in delving into technical intricacies, crafting comprehensive end-to-end solutions, defining stringent quality standards, and infusing innovation into our technical and product roadmap. Beyond my professional pursuits, I'm an avid 3D designer and printer, actively contributing to the vibrant maker community. I excel in producing efficient documentation, streamlining and automating workflows, enforcing and disseminating code review policies, and fostering collaborative interactions with upper management. I'm committed to delivering top-notch results, always prioritizing quality in every endeavor. Additionally, I conduct interviews and select technical talent through a thoughtful and approachable evaluation process, offering timely and constructive feedback both to and about candidates.",
            aboutSubtitle: "Technical Leader & Web Developer.",
            aboutSubtext: "With experience in the formation of teams and the permanent training of personnel, I work empathetically to achieve the objectives set by the business without forgetting that software development is a human activity where attention to detail also contributes to quality.",
            skillsSubtitle: "Here is a brief list of some of my competencies and the level at which I currently perform at each of those.",
            socialFooter: "You can contact me through all these social networks or using the contact information in the 'About' section.",
            servicesSubtitle: "If you need any of these services please feel free to contact me so we can achieve together a solution that suits your needs:",
            serviceTechTeams: "Technical Teams",
            serviceTechTeamsDesc: "Technical evaluation of IT profiles, work management with teams formed ad-hoc by project.",
            serviceDev: "Systems Development",
            serviceDevDesc: "I build Web applications and also command line tools, desktop systems. Multi-architecture, multi-pattern designs. Embedded systems.",
            servicePerformance: "Optimization",
            servicePerformanceDesc: "Database performance optimization, time profile debugging, mitigation of N + 1 queries, Caches implementation, infrastructure solutions.",
            serviceAnalysis: "Analysis and QA",
            serviceAnalysisDesc: "Functional analysis of use cases of existing and projected systems, generation of documentation and estimates. Coverage analysis and continuous quality improvement.",
            serviceTraining: "Trainings",
            serviceTrainingDesc: "Team mentoring, tailor-made training, code review, content generation for technical learning.",
            serviceHosting: "Web Hosting",
            serviceHostingDesc: "Automated deployment of CI/CD, cloud services for delivered projects and pre-existing systems, domain and SSL certificates management."
        },
        es: {
            iam: "Soy",
            aboutText: "Comunico ideas de manera clara y tengo pasión por enseñar temas técnicos. Desarrollo soluciones tecnológicas creativas y personalizadas para mis clientes.",
            aboutFooter: "Tengo un gran interés en investigar y analizar asuntos técnicos, desarrollar soluciones integrales, establecer rigurosos estándares de calidad y aportar innovación a la estrategia técnica y de productos. Más allá de mis compromisos profesionales, soy un apasionado diseñador e impresor 3D, participando activamente en la vibrante comunidad maker. Destaco en la generación de documentación eficiente, la mejora y automatización de procesos, la implementación y comunicación de políticas de revisión de código, así como en la interacción con la alta dirección. Mi compromiso principal es entregar resultados de alta calidad en todo momento. Además, conduzco entrevistas y selecciono personal técnico a través de un proceso de evaluación relajado y accesible, brindando retroalimentación oportuna tanto a los candidatos como sobre ellos.",
            aboutSubtitle: "Líder Técnico y Desarrollador Web",
            aboutSubtext: "Con experiencia en la conformación de equipos y la capacitación permanente del personal, trabajo empáticamente para alcanzar los objetivos planteados por el negocio sin olvidar que el desarrollo de software es una actividad humana donde la atención al detalle también aporta calidad.",
            skillsSubtitle: "Aquí se encuentra una lista resumida de algunas de mis competencias y el nivel con el que actualmente me desempeño en cada una.",
            socialFooter: "Puede comunicarse conmigo a través de todas éstas redes sociales o utilizando los datos de contacto de la sección 'About'.",
            servicesSubtitle: "Si necesita alguno de estos servicios por favor contácteme para que podamos lograr juntos una solución que se acomode a sus necesidades:",
            serviceTechTeams: "Equipos Técnicos",
            serviceTechTeamsDesc: "Evaluación técnica de perfiles IT, gestión de trabajos con equipos conformados ad-hoc por proyecto.",
            serviceDev: "Desarrollo de Sistemas",
            serviceDevDesc: "Construyo aplicaciones Web y también herramientas de línea de comando, sistemas de escritorio, diseños multi-arquitectura, multi-patrón. Sistemas embebidos.",
            servicePerformance: "Optimización",
            servicePerformanceDesc: "Optimización de performance en bases de datos, depuración de perfiles de tiempos, mitigación de N+1 queries, implementación de Cachés, soluciones de infraestructura.",
            serviceAnalysis: "Análisis y Control de Calidad",
            serviceAnalysisDesc: "Análisis funcional de casos de uso nuevos y existentes, generación de documentación y estimaciones. Análisis de cobertura y mejora continua de la calidad.",
            serviceTraining: "Capacitaciones",
            serviceTrainingDesc: "Mentoreo de equipos, capacitaciones a medida, revisión de código, generación de contenidos para aprendizajes técnicos.",
            serviceHosting: "Web Hosting",
            serviceHostingDesc: "Despliegue automatizado CI/CD, cloud services para proyectos propios y sistemas pre-existentes, gestión de dominios y certificados SSL."
        }
    };

    $(function() {
        var langs = ["EN", "ES"];
        var switchLangBtn = $("#switch-lang");
        var switchLangSpan= $("#switch-lang span");
        var lang = langs[0]
        var langIndex = 0;

        switchLangBtn.on("click", () => {
            switchLangSpan.text(lang);
            lang = langs[++langIndex % langs.length];
            changeTo(lang)
        })

        function changeTo(lang) {
            var lowerCaseLang = lang.toLowerCase();
            Object.keys(textsToShow[lowerCaseLang]).forEach(elementId => {
                $("#" + elementId).text(textsToShow[lowerCaseLang][elementId]);
            });
        }
        changeTo(lang);
    });
})();
(function() {
    var textsToShow = {
        en: {
            iam: "I'm",
            aboutText: "I communicate my ideas clearly, I am passionate about teaching technical matters. I develop creative and personalized technological solutions for my clients.",
            aboutFooter: "I like to research and analyze technical matters, develop end-to-end solutions, create the definition of quality-standards and contribute to the technical and product roadmap with innovation. I generate efficient documentation, improve and automate processes, implement and communicate code-review policies, interact with upper-management and make estimates always prioritizing the quality of the deliveries. I interview and select technical personnel with relaxed evaluations and give feedback timely about and to the candidates.",
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
            aboutText: "Comunico mis ideas con claridad, soy apasionado por la enseñanza de cuestiones técnicas. Desarrollo soluciones tecnológicas creativas y personalizadas a mis clientes.",
            aboutFooter: "Me gusta investigar y analizar temas técnicos, desarrollar soluciones punta-a-punta, crear la definición de estándares de calidad y aportar al roadmap técnico y de producto con innovación. Genero documentación eficiente, perfecciono y automatizo procesos, implemento y comunico políticas de code-review, interactúo con el management y confecciono estimaciones priorizando siempre la calidad de las entregas. Entrevisto y selecciono personal técnico con evaluaciones descontracturadas y doy feedback oportuno de y a los candidatos.",
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
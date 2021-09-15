(function() {
    var textsToShow = {
        en: {
            iam: "I'm",
            aboutText: "I communicate my ideas clearly, I am passionate about teaching technical matters. I develop creative and personalized technological solutions for my clients.",
            aboutFooter: "I like to research and analyze technical matters, develop end-to-end solutions, create the definition of quality-standards and contribute to the technical and product roadmap with innovation. I generate efficient documentation, improve and automate processes, implement and communicate code-review policies, interact with upper-management and make estimates always prioritizing the quality of the deliveries. I interview and select technical personnel with relaxed evaluations and give feedback timely about and to the candidates.",
            aboutSubtitle: "Technical Leader & Web Developer.",
            aboutSubtext: "With experience in the formation of teams and the permanent training of personnel, I work empathetically to achieve the objectives set by the business without forgetting that software development is a human activity where attention to detail also contributes to quality.",
            skillsSubtitle: "Here is a summary list of some of my competencies and the level at which I currently perform at each of those.",
            socialFooter: "You can contact me through all these social networks or using the contact information in the 'About' section."
        },
        es: {
            iam: "Soy",
            aboutText: "Comunico mis ideas con claridad, soy apasionado por la enseñanza de cuestiones técnicas. Desarrollo soluciones tecnológicas creativas y personalizadas a mis clientes.",
            aboutFooter: "Me gusta investigar y analizar temas técnicos, desarrollar soluciones punta-a-punta, crear la definición de estándares de calidad y aportar al roadmap técnico y de producto con innovación. Genero documentación eficiente, perfercciono y automatizo procesos, implemento y comunico políticas de code-review, interactúo con el management y confecciono estimaciones priorizando siempre la calidad de las entregas. Entrevisto y selecciono personal técnico con evaluaciones descontracturadas y doy feedback oportuno de y a los candidatos.",
            aboutSubtitle: "Líder Técnico y Desarrollador Web",
            aboutSubtext: "Con experiencia en la conformación de equipos y la capacitación permanente del personal, trabajo empáticamente para alcanzar los objetivos planteados por el negocio sin olvidar que el desarrollo de software es una actividad humana donde la atención al detalle también aporta calidad.",
            skillsSubtitle: "Aquí se encuentra una lista resumida de algunas de mis competencias y el nivel con el que actualmente me desempeño en cada una.",
            socialFooter: "Puede comunicarse conmigo a través de todas éstas redes sociales o utilizando los datos de contacto de la sección 'About'."
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
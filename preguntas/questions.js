const host = base.getFunctionsAPI();
const URL = host + "/questions";
const nodeAPIQuestions = document.querySelector("#sectionQuestions");

class Questions {
    constructor(objQuestions) {
        this.title()
        this.createContainer(objQuestions);
        preloader();
    }

    title() {
        const title = document.createElement("h3");
        title.innerText = "Preguntas Frecuentes";
        title.id = "questionsTitle"
        title.className = "section__questions--title";
        nodeAPIQuestions.appendChild(title);
    }

    createContainer(objQuestions) {
        const container = document.createElement("div");
        container.className = `container`;
        container.id = "containerQuestions";
        for (const key in objQuestions) {
            const element = objQuestions[key];
            let link = element.link;
            let linkText = "";
            let linkClass = "";
            if (link.length > 1) {
                linkText = "Mas información";
                linkClass = "button__link";
            }
            container.innerHTML += `
                <div class="container__question">
                    <div class="container__question--interrogation">
                        ${element.pregunta}
                    </div>
                    <div class="container__question--answer">
                        ${element.respuesta}
                    </div>
                    <a class="${linkClass}" href="${link}">${linkText}</a>
                </div>`;
        }
        //container.addEventListener("click", event => locateEvent(event));      
        nodeAPIQuestions.appendChild(container);
    }
}

function preloader() {
    nodeAPIQuestions.classList.toggle("preloader");
}

async function conexion(URL) {
    try {
        const info = await fetch(`${URL}`);
        const infoJSON = await info.json();
        const questions = new Questions(infoJSON);
    } catch (error) {
        console.log(error)
        const titleError = document.createElement("h3");
        titleError.innerHTML = `
        <h3 class="error__API">Lo sentimos, la información no esta disponible en este momento.
        Por favor intenta más tarde, lamentamos los inconvenientes.</h3>`;
        nodeAPIQuestions.appendChild(titleError);
        preloader();
    }
}

preloader()
conexion(URL);
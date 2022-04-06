const host = "http://localhost:3000/";
const URL = host + "API/v1/frontendURL/30";
const nodeAPIQuestions = document.querySelector("#sectionQuestions");

class Questions {
    constructor(objQuestions){
        this.title()
        this.createContainer(objQuestions);        
    }

    title(){
        const title = document.createElement("h3");
        title.innerText = "Preguntas Frecuentes";
        title.id = "questionsTitle"
        title.className ="section__questions--title";
        nodeAPIQuestions.appendChild(title);
    }
    
    createContainer(objQuestions){
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

async function conexion(URL) {
    try {
        const info = await fetch(`${URL}`);        
        const infoJSON = await info.json();
        const questions = new Questions(infoJSON);        
    } catch (error) {
        console.log(error)
        const titleError = document.createElement("h3");
        titleError.innerHTML= `
        <h3 class="error__API">Error al consultar la información. 
        Por favor intenta más tarde. 
        Estamos trabajando para darte un mejor servicio.</h3>`;
        nodeAPIQuestions.appendChild(titleError);
    }
}

conexion(URL);
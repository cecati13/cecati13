const URL = "https://sheets.googleapis.com/v4/spreadsheets/108FBMScjh_seZ284-T0cZgpW_OpdiU9iJNGlycV4aJU/values/preguntas!A:C?key=AIzaSyA1pfILJrar9ay5u1PoOWVuz4t8VhxA6jE"
const nodeAPIQuestions = document.querySelector("#sectionQuestions");

class ObjFromArray {
    arrayKeys = [];
    constructor (array){
        this.arrayProperties(array);
        const arrayWithObjects = this.trasnformArrayOfObjects(array);        
        return arrayWithObjects;
    }
    
    arrayProperties(array){
        array[0].forEach( element => this.arrayKeys.push(element))
    }
    
    trasnformArrayOfObjects(array){        
        let arrayWithObject = []
        array.forEach( element => {
            let i = 0;
            const question = element.reduce( (obj, item)=> {
                const prop = this.arrayKeys[i];
                if (!obj[item]) {
                    Object.defineProperty(obj, prop, {
                        value: item,
                        writable: true,
                        enumerable: true,
                        configurable: false
                    })
                }
                i++;
                return obj
            }, {})
            arrayWithObject.push(question)
        })        
        arrayWithObject.shift();        
        return arrayWithObject;
    }        
}

class Questions {
    constructor(arrayQuestions){
        this.title()
        this.createContainer(arrayQuestions);        
    }

    title(){
        const title = document.createElement("h3");
        title.innerText = "Preguntas Frecuentes";
        title.id = "questionsTitle"
        title.className ="section__questions--title";
        nodeAPIQuestions.appendChild(title);
    }
    
    createContainer(arrayQuestions){
        const container = document.createElement("div");
        container.className = `container`;
        container.id = "containerQuestions";
        arrayQuestions.forEach(element => {
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
                </div>`             
        });
        //container.addEventListener("click", event => locateEvent(event));      
        nodeAPIQuestions.appendChild(container);
    }
}

async function conexion(URL) {
    try {
        const info = await fetch(`${URL}`);        
        const infoJSON = await info.json()
        const responseWithArray = infoJSON.values;        
        const response = new ObjFromArray(responseWithArray);        
        const questions = new Questions(response);
        
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

// async function conexion(URL) {
//     try {
//         const info = await fetch(`${URL}`);        
//         const infoJSON = await info.json();        
//         const responseWithArray = infoJSON.values;
//         const obj = {...responseWithArray}
//         console.log(obj)
//     } catch (error) {
//         console.log(error)
        
//     }
// }

conexion(URL);
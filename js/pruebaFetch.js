const azure = "https://cecati13api.azurewebsites.net";
const telmex = "http://svo-5-191.servidoresvirtuales.mx";
const localhost = "http://localhost:3500"

let URL = localhost;
const verifyingCecatiATelmex = /cecati13/;
const verifyLocationTelmex = verifyingCecatiATelmex.test(window.location.hostname);

if (verifyLocationTelmex) {
    URL = telmex;
}

const nodeAPI_Offer = document.getElementById("API_educativeOffer");
let infoFetch = [];

class availableCourses {
    constructor(nameSpeciality){
        const courses = this.getCourses(nameSpeciality);
        if (courses.length > 0) {
            const containerCourses = this.sendCourses(courses);
            this.mountNode(containerCourses);
        }
    }

    mountNode(containerCourses){
        const coursesContainers = document.createElement("div");
        coursesContainers.id = "containerCourses";
        containerCourses.forEach( course => {            
            coursesContainers.appendChild(course);
        })
        nodeAPI_Offer.appendChild(coursesContainers);
        showButtonBack();
    }

    sendCourses(array){
        let arrayCourses = [];        
        array[0].forEach(element => {
            const course = this.constructorCourse(element);
            arrayCourses.push(course);
        })                
        return arrayCourses;
    }

    constructorCourse(course){        
        const container = document.createElement("div");
        container.className = "containerCourse";
        container.innerHTML = `
        <p>Curso: ${course.curso}.</p>
        <p class="containerCourse--profesor">Profesor: ${course.profesor.toLowerCase()}</p>
        <br>
        <p>Modalidad del curso: ${course.modalidad_curso}.</p>
        <p>Horario: ${course.hora_inicio} a ${course.Hora_fin} hrs.</p>
        <p>El curos inicia el ${course.fecha_inicio}, y finaliza el ${course.fecha_termino}.</p>
        <p>${course.horas} horas de duración.</p>
        <p>Dias de clase: ${course.dias_de_clases}.</p>
        <p>Costo del curso: $${course.costo}</p>        
        <br>
        <p>Observaciones: ${course.observaciones}</p>
        <br>
        `;
        return container;
    }

    getCourses(specialitie){
        let courses = []
        infoFetch.forEach(element => {
            if(element.specialty.toUpperCase() === specialitie) {
                courses.push(element.courses)
            }
        });
        return courses;
    }
}

function locate(event) {
    const ubication = event.target.innerText.toUpperCase()
    const showCourses = new availableCourses(ubication)
    showSpecialties();
}

function showButtonBack() {    
    const nodeButtonBack = document.querySelector("#buttonBack");
    nodeButtonBack.classList.toggle("buttonBack--HIDE");
    nodeButtonBack.addEventListener("click", backToSpecialties)
}

function showSpecialties(){    
    const nodeSpecialties = document.querySelector("#containerSpecialties");
    nodeSpecialties.classList.toggle("container__Specialties--HIDE");
}

const backToSpecialties = function () {    
    showSpecialties();
    removeSon();
    showButtonBack();
}

function removeSon() {    
    const containerCourses = document.querySelector("#containerCourses");
    //cuidar que no elimine todo
    nodeAPI_Offer.removeChild(containerCourses);
}

function toogleClass(element) {
    const nodeLineSVG = document.querySelector(`#${element}`);
    nodeLineSVG.classList.toggle(element);
}

function createButtoBack(){    
    const buttonBack = document.createElement("div");
    buttonBack.className = "buttonBack buttonBack--HIDE";
    buttonBack.id = "buttonBack";
    buttonBack.innerHTML = `        
    <img src="/assets/arrowBack.png" alt="Retroceder">
    <span>Regresar a todas las Especialidades</span>`;        
    nodeAPI_Offer.appendChild(buttonBack);
}

async function conexion(URL) {
    try {
        const info = await fetch(`${URL}/api/v1/educativeOffer`);        
        const response = await info.json()
        console.log(response);
        const container = document.createElement("div");
        container.className = `container__Specialties container__Specialties--HIDE`;
        container.id = "containerSpecialties";
        response.forEach(element => {
            container.innerHTML += `
            <div class="Specialties--containers">
            ${element.specialty.toLowerCase()} </div>`
             //countCourses++;
        });
        container.addEventListener("click", event => locate(event));        
        infoFetch = [...response];        
        nodeAPI_Offer.appendChild(container);
        createButtoBack();
        showSpecialties()
    } catch (error) {
        console.log(error)
        const titleError = document.createElement("h3");
        titleError.innerHTML= `
        <h3>Error al consultar la información. 
        Por favor intenta más tarde. 
        Estamos trabajando para darte un mejor servicio.</h3>`;
        nodeAPI_Offer.appendChild(titleError);
    }
}

conexion(URL);

const title = document.createElement("h4");
title.innerText = `Seleciona una especialidad para ver los cursos disponibles:`;
title.className ="educativeOffer__api--title";
nodeAPI_Offer.appendChild(title);
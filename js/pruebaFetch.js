const azure = "https://cecati13api.azurewebsites.net";
const telmex = "http://svo-5-191.servidoresvirtuales.mx";
const localhost = "http://localhost:3500"

let URL = localhost;
const verifyingCecatiATelmex = /cecati13/;
const verifyLocationTelmex = verifyingCecatiATelmex.test(window.location.hostname);

if (verifyLocationTelmex) {
    URL = telmex;
}
const textTitle = "Seleciona una especialidad para ver los cursos disponibles:"
const nodeAPI_Offer = document.getElementById("API_educativeOffer");
let infoFetch = [];

class availableCourses {
    constructor(nameSpeciality){
        const courses = this.getCourses(nameSpeciality);
        if (courses.length > 0) {
            const containerCourses = this.sendCourses(courses);
            this.mountNode(containerCourses);
            showSpecialties();
            window.scroll(top);            
            alternateTitle(`Cursos de ${nameSpeciality.toUpperCase()}`);
        }
    }

    mountNode(containerCourses){
        const coursesContainers = document.createElement("div");
        coursesContainers.id = "containerCourses";
        coursesContainers.className ="containerCourses";
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
        container.className = "course";
        container.innerHTML = `
        <p class="containerCourse--title">${course.curso}</p>
        <p class="containerCourse--profesor">Profesor: ${course.profesor.toLowerCase()}</p>
        <br>
        <p>Inicia ${course.fecha_inicio}</p>
        <p>Termina: ${course.fecha_termino}</p>
        <p>Horario: ${course.hora_inicio} a ${course.Hora_fin} hrs.</p>
        <p>${course.horas} horas de duración</p>
        <p>Modalidad del curso: ${course.modalidad_curso}</p>
        <p>Dias de clase: ${course.dias_de_clases}</p>
        <p>Costo del curso: $${course.costo}.00</p>        
        <p>Observaciones: ${course.observaciones}</p>        
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

function alternateTitle(stringText){
    const title = document.querySelector("#alternateTitle");    
    title.innerText = stringText;
}

function locate(event) {
    const ubication = event.target.innerText.toUpperCase();
    const showCourses = new availableCourses(ubication);
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
    alternateTitle(textTitle);
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
    <img src="/assets/arrowBack.svg" alt="Retroceder">
    <span>REGRESAR</span>`;        
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
        <h3 class="error__API">Error al consultar la información. 
        Por favor intenta más tarde. 
        Estamos trabajando para darte un mejor servicio.</h3>`;
        nodeAPI_Offer.appendChild(titleError);
    }
}

conexion(URL);

const title = document.createElement("h4");
title.innerText = textTitle;
title.id = "alternateTitle"
title.className ="educativeOffer__api--title";
nodeAPI_Offer.appendChild(title);
const host = "https://backend-cursos-cecati13.uc.r.appspot.com/";
const URL = host + "API/v1/frontendURL/10"
const URL_BASE_IMAGE = "https://cecati13web.blob.core.windows.net/assets-web-cecati13/";

const nodeAPI_TV = document.getElementById("tv");
    
class ShowCoursesTV {
    static textTitle = "Selecciona una especialidad para ver los cursos disponibles:"

    constructor(objCourses){
        const courses = this.createContainer(objCourses);
        nodeAPI_TV.appendChild(courses);
        preloader();
    }
    
    createContainer(objCourses){
        const container = document.createElement("div");
        container.className = `container__courses`;
        container.id = "containerSpecialties";
        for (const key in objCourses) {
            const element = objCourses[key];
            const course = this.constructorCourse(element);
            container.appendChild(course);
        }
        return container;
    }

    constructorCourse(course){
        if (course.observaciones == undefined || course.observaciones === "") {
            course.observaciones = "";
        } else {
            const textObs = course.observaciones;
            course.observaciones = "Observaciones: " + textObs;
        }
        course.imageURL = (course.imagenURL != undefined ? URL_BASE_IMAGE + course.imagenURL : "");
        const container = document.createElement("div");
        container.className = "course";
        container.innerHTML = `        
        <p class="course__title">Curso: <strong>${course.curso}</strong></p>
        <p class="course__specialtie">${course.especialidad.toLowerCase()}</p>
        <img src="${course.imageURL}" alt="Logo de Especialidad">
        <p class="course__profesor">Profesor: ${course.profesor.toLowerCase()}</p>
        <p class="course__date">
        Del <span class="course__highlight">${course.fecha_inicio}</span>
        al <span class="course__highlight">${course.fecha_termino}</span>
        </p>
        <br>
        <p>
            ${course.dias_de_clases}
            de <span class="course__highlight">${course.hora_inicio} a ${course.hora_fin}</span> hrs.
        </p>
        <p>Modalidad: <span class="course__highlight">${course.modalidad_curso}</span></p>
        <p>${course.horas} horas de duración</p>        
        <p>${course.observaciones}</p>
        `;
        return container;
    }

    //determinar si se usaran estos metodos:
    textTitleCount(array){        
        const countSpecialties = array.length;
        Specialties.textTitle= `        
        Tenemos ${countSpecialties} especialidades con ${ObjFromArray.countCourses} cursos abiertos.
        Selecciona una especialidad y ve los cursos disponibles:        
        `;        
    }

    title(array){
        const title = document.createElement("h3");        
        title.innerText = Specialties.textTitle
        title.id = "alternateTitle"
        title.className ="section__courses--title";
        nodeAPI_TV.appendChild(title);
    }    
}

function preloader() {
    const nodePreloader = document.querySelector(".preloader")
    nodePreloader.classList.toggle("preloader");
}

async function conexion(URL) {
    try {
        const info = await fetch(`${URL}`);
        const infoJSON = await info.json();
        const specialitie = new ShowCoursesTV(infoJSON);
    } catch (error) {
        console.log(error)
        const titleError = document.createElement("h3");
        titleError.innerHTML= `
        <h3 class="error__API">Lo sentimos, la información no esta disponible en este momento.
        Por favor intenta más tarde, lamentamos los inconvenientes.</h3>`;
        nodeAPI_TV.appendChild(titleError);
        preloader();
    }
}

conexion(URL);
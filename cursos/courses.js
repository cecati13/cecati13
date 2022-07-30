const host = "https://backend-cursos-cecati13.uc.r.appspot.com/";
//const host = "http://localhost:3000/";
const URL = host + "API/v1/frontendURL/10"
const URL_BASE_ASSETS = "https://storage.googleapis.com/cecati13/assets/";
const URL_BASE_FI = "http://cecati13.com.mx/informacion/";

let infoFetch = [];
const nodeAPI_Offer = document.getElementById("sectionCourses");
const numberPlacesWithCourses = 25;

class AvailableCourses {
    constructor(nameSpeciality){
        const courses = this.getCourses(nameSpeciality);
        if (courses.length > 0) {
            const containerCourses = this.sendCourses(courses);
            this.mountNode(containerCourses);
            Specialties.showSpecialties();
            window.scroll(top);
            AvailableCourses.alternateTitle(`Cursos de ${nameSpeciality.toUpperCase()}`);            
        }
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

    constructorCourse(course){        
        if (course.observaciones == undefined || course.observaciones === "") {
            course.observaciones = "";
        } else {
            const textObs = course.observaciones;
            course.observaciones = "Observaciones: " + textObs;
        }
        course.imageURL = (course.imagenURL != undefined ? URL_BASE_ASSETS + course.imagenURL : "");
        const container = document.createElement("div");
        //container.className = "course";
        const preregister = this.preRegistrationInformation(course);
        container.innerHTML = `
        <div class="course">
            <p class="containerCourse--title"><strong>${course.curso}</strong></p>
            <p class="containerCourse--profesor">Profesor: ${course.profesor.toLowerCase()}</p>
            <br>
            <p>Inicia:  <b>${course.fecha_inicio}</b></p>
            <p>Termina:  <b>${course.fecha_termino}</b></p>        
            <p>Horario:  <b>${course.hora_inicio} a ${course.hora_fin}</b> hrs.</p>
            <br>
            <p>Modalidad del curso: <b><i>${course.modalidad_curso}</i></b></p>
            <p>${course.horas} horas de duración</p>
            <p>Dias de clase: ${course.dias_de_clases}</p>
            <p>Costo del curso: <b>$${course.costo}</b></p>
            <p>${course.observaciones}</p>
            <br>
            <img src="${course.imageURL}" alt="Logo de Especialidad">
            <a  
                href="${(course.ficha_informacion != undefined ? URL_BASE_FI + course.ficha_informacion : "./notFound.html")}"
                target="${course.ficha_informacion != undefined ? "_blank" : ""}" 
                id="containerCourse--info">
                <img src="${URL_BASE_ASSETS}moreInfo.png">
                    INFORMACIÓN
            </a>
            <textarea id="pre-${course.number}" style="display:none">${preregister}</textarea>
        </div>
            `;
        const containerImgButton = this.createContainerButton(course);
        //containerImgButton.addEventListener("click", event => saveCourse(event))
        //container.appendChild(containerImgButton);
            //<a class="button__link educativeOffer__button" href="../html/Inscribete.html">Inscribete...</a>
        return container;
    }

    createContainerButton(course){
        console.log(course)
        console.log(course.number)
        const containerAnchor = document.createElement("a");
        containerAnchor.className = "course--img-button";
        containerAnchor.dataset.numberCourse = `pre-${course.number}`;
        containerAnchor.href = "/src/formulario"
        containerAnchor.innerHTML = `       
            <img src="https://cecati13web.blob.core.windows.net/assets-web-cecati13/inscripcion.svg"
            alt="Inscripción" class="button__link floating__button" id="buttonFloatingReg"
            data-numberCourse="pre-${course.number}">
            <p data-numberCourse="pre-${course.number}">INSCRIBIRME</p>        
        `;      
        return containerAnchor;
    }

    preRegistrationInformation(course) {
        const newObject = {
           ...course,           
        };
        delete newObject.imageURL;
        delete newObject.imagenURL;
        delete newObject.inscritos;
        delete newObject.observaciones;

        const information = JSON.stringify(newObject);
        return information;
    }

    mountNode(containerCourses){
        const coursesContainers = document.createElement("div");
        coursesContainers.id = "containerCourses";
        coursesContainers.className ="containerCourses";
        containerCourses.forEach( course => {            
            coursesContainers.appendChild(course);
        })
        nodeAPI_Offer.appendChild(coursesContainers);        
        Specialties.showButtonBack();
    }

    sendCourses(array){
        let arrayCourses = [];        
        array[0].forEach(element => {            
            const course = this.constructorCourse(element);
            arrayCourses.push(course);
        })                
        return arrayCourses;
    }

    toogleClass(element) {
        const nodeLineSVG = document.querySelector(`#${element}`);
        nodeLineSVG.classList.toggle(element);
    }    

    static alternateTitle(stringText){
        const title = document.querySelector("#alternateTitle");    
        title.innerText = stringText;
    }

    static removeCourses() {
        const containerCourses = document.querySelector("#containerCourses");        
        nodeAPI_Offer.removeChild(containerCourses);
    }    
}

class ObjFromArray {
    static countCourses = 0;
    constructor (objCourses){        
        const arrayWithPlaces = this.coursesWithPlaces(objCourses)        
        const specialities = this.sortBySpeciality(arrayWithPlaces);        
        return specialities;
    }

    coursesWithPlaces(objCourses){
        const withPlace = [];
        for (const key in objCourses) {
            const item = objCourses[key];
            const places = Number.parseInt(item.inscritos)
            if (places < numberPlacesWithCourses && places != NaN) {
                withPlace.push(item)
            }
        }
        let totalCourses = withPlace.length
        ObjFromArray.countCourses = totalCourses;
        const assignPreInscription = withPlace.map( course => {
        const newCourse = {
            ...course,
            number: totalCourses
        }
        totalCourses--;
        return newCourse
        })
        return assignPreInscription
    }

    sortBySpeciality(objCourses){        
        const onlySpecialities = [];
        for (const key in objCourses) {
            const item = objCourses[key];
            if (!onlySpecialities.includes(item.especialidad)) {
                onlySpecialities.push(item.especialidad)
            }
        }
        
        const forSpecialities = onlySpecialities.map( item => {
            const coursesArrayWithSpecialtie = [];            
            for (const key in objCourses) {
                const itemObj = objCourses[key];
                if (itemObj.especialidad === item) {
                    coursesArrayWithSpecialtie.push(itemObj)
                }
            }
            const imgArrayWithSpecialtie = [];
            coursesArrayWithSpecialtie.forEach( course => imgArrayWithSpecialtie.push(course.imagenURL))
            
            const objSpecialities = {
                specialty : item,
                courses : coursesArrayWithSpecialtie,
                imageURL : imgArrayWithSpecialtie
            }            
            return objSpecialities
        })        
        return forSpecialities;
    }
}
    
class Specialties {
    static textTitle = "Selecciona una especialidad para ver los cursos disponibles:"

    constructor(arrayBySpecialties){        
        this.textTitleCount(arrayBySpecialties)
        this.title()
        this.createContainer(arrayBySpecialties);
        this.createButtoBack();        
        Specialties.showSpecialties();
        preloader();
    }

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
        nodeAPI_Offer.appendChild(title);
    }
    
    createContainer(arrayBySpecialties){
        const container = document.createElement("div");
        container.className = `container__Specialties container__Specialties--HIDE`;
        container.id = "containerSpecialties";
        arrayBySpecialties.forEach(element => {
            //image course random show to specialtie
            const imageRandom = Math.ceil(Math.random()*element.imageURL.length) - 1;
            let image = element.imageURL[imageRandom];
            if (image == undefined) {                
                image = "LogoCecatiEspecialidades.png";
            }
            container.innerHTML += `
            <div class="Specialties--containers" data-specialty="${element.specialty.toLowerCase()}">
                <div class="Specialties--container--logo" data-specialty="${element.specialty.toLowerCase()}">
                    <img src="${URL_BASE_ASSETS}${image}" class="Specialties--containers--img"
                    data-specialty="${element.specialty.toLowerCase()}" alt="curso">
                </div>
                <div class="Specialties--container--title" 
                data-specialty="${element.specialty.toLowerCase()}">${element.specialty.toLowerCase()}</div>
            </div>`             
        });
        container.addEventListener("click", event => locateEvent(event));      
        nodeAPI_Offer.appendChild(container);
    }

    createButtoBack(){        
        const buttonBack = document.createElement("div");        
        buttonBack.className = "container__buttons";
        const inscripcion = document.querySelector("#inscription");
        const buttonHref = inscripcion.href;
        buttonBack.innerHTML = `
        <div class="buttonBack buttonBack--HIDE" id="buttonBack">
            <img src="${URL_BASE_ASSETS}arrowBack.svg" alt="Retroceder">
            <span>REGRESAR</span>        
        </div>
        <a href="${buttonHref}">
            <img src="${URL_BASE_ASSETS}inscripcion.svg" 
            alt="Inscripción" class="button__link floating__button floating__button--HIDE" id="buttonFloatingReg">
        </a>
        `;        
        //PARA USAR CUANDO LA INSCRIPCION LLEVE DIRECTO AL FORMULARIO PRECARGADO CON EL CURSO
        // registrationButton.innerText = "Preinscríbete...";
        // registrationButton.className = "button__link floating__button floating__button--HIDE";
        //registrationButton.id = "buttonFloatingReg";
        nodeAPI_Offer.appendChild(buttonBack);
    }

    static showSpecialties(){    
        const nodeSpecialties = document.querySelector("#containerSpecialties");
        nodeSpecialties.classList.toggle("container__Specialties--HIDE");
    }

    static showButtonBack() {
        //habilitar si se usa boton flotante
        const nodeButtonFloatingReg = document.querySelector("#buttonFloatingReg");
        nodeButtonFloatingReg.classList.toggle("floating__button--HIDE");
        const nodeButtonBack = document.querySelector("#buttonBack");
        nodeButtonBack.classList.toggle("buttonBack--HIDE");
        nodeButtonBack.addEventListener("click", backToSpecialties)
    }
}

function preloader() {
    nodeAPI_Offer.classList.toggle("preloader");
}

//functions of EventListener
const backToSpecialties = function () {
    Specialties.showSpecialties();
    AvailableCourses.removeCourses();
    Specialties.showButtonBack();
    AvailableCourses.alternateTitle(Specialties.textTitle);
}

function locateEvent(event) {
    const ubication = event.target.dataset.specialty.toUpperCase();
    const showCourses = new AvailableCourses(ubication);
}

async function conexion(URL) {
    try {
        const info = await fetch(`${URL}`);        
        const infoJSON = await info.json()                
        const response = new ObjFromArray(infoJSON);
        console.log(response);
        const specialitie = new Specialties(response);        
        infoFetch = [...response];        
    } catch (error) {
        console.log(error)
        const titleError = document.createElement("h3");
        titleError.innerHTML= `
        <h3 class="error__API">Lo sentimos, la información no esta disponible en este momento.
        Por favor intenta más tarde, lamentamos los inconvenientes.</h3>`;
        nodeAPI_Offer.appendChild(titleError);
        preloader();
    }
}
preloader();
conexion(URL);
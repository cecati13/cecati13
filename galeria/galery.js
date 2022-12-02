const host = "https://backend-cursos-cecati13.uc.r.appspot.com/";
const URL = host + "API/v1/frontendURL/40"
const URL_BASE_IMAGE = "https://storage.googleapis.com/cecati13/galeria/";
const container = document.querySelector(".carousel__list");

function preloader() {
    const nodePreloader = document.querySelector(".preloader")
    nodePreloader.classList.toggle("preloader");
}

const functionGlider = ()=> {    
    new Glider(container, {
        type: 'carousel',
        dots: ".carousel__indicators",
        arrows: {
            prev: ".carousel__previous",
            next: ".carousel__next"
        }
    });    
}

function galleryContainer (array) {
    const arrayContainer = []
    array.forEach(element => {
        const picture = document.createElement("div");
        picture.innerHTML= `
        <picture class="container__picture">
            <source srcset="${URL_BASE_IMAGE + element.imageSmall}" media="(max-width: 767px)">
            <source srcset="${URL_BASE_IMAGE + element.imageMedium}" media="(max-width: 1023px)">
            <img srcset="${URL_BASE_IMAGE + element.imageHigh}" media="100%"
            alt="${element.nombre}" class="gallery__img">        
        </picture>
        `;        
        arrayContainer.push(picture)
        }
    );    
    container.append(...arrayContainer)
    preloader();
    window.addEventListener("load", functionGlider())
}

class ObjFromArray {    
    constructor (obj){        
        const newArray = this.convert(obj)
        return newArray;
    }

    convert(obj){
        const array = [];
        for (const key in obj) {
            const item = obj[key];
            array.push(item);
        }        
        return array;
    }
}

async function conexion(URL) {
    try {
        const info = await fetch(`${URL}`);        
        const infoJSON = await info.json()
        const response = new ObjFromArray(infoJSON);
        galleryContainer(response);
    } catch (error) {
        console.log(error)
        const nodeGallery = document.querySelector(".gallery");
        const titleError = document.createElement("h3");
        titleError.innerHTML= `
        <h3 class="error__API">Lo sentimos, la información no esta disponible en este momento.
        Por favor intenta más tarde, lamentamos los inconvenientes.</h3>`;
        nodeGallery.appendChild(titleError);
        preloader();
    }
}

conexion(URL);
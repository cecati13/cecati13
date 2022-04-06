const host = "https://backend-cursos-cecati13.uc.r.appspot.com/";
const URL = host + "API/v1/frontendURL/40"
const URL_BASE_IMAGE = "https://cecati13web.blob.core.windows.net/galeria/";


window.addEventListener("load", ()=> {
    new Glider(document.querySelector(".carousel__list"), {
        type: 'carousel',
        startAt: 5,
        perView: 5,
        dots: ".carousel__indicators",
        arrows: {
            prev: ".carousel__previous",
            next: ".carousel__next"
        }
    });
})

function galleryContainer (array) {
    const container = document.querySelector(".carousel__list");
    array.forEach(element => {
        const figure = document.createElement("figure");
        figure.innerHTML= `
        <img srcset="${URL_BASE_IMAGE + element.imageSmall} 500w,
                     ${URL_BASE_IMAGE + element.imageMedium} 768w
                     ${URL_BASE_IMAGE + element.imageHigh} 1024w"
            sizes="(max-width: 500px) 300px,
                   (max-width: 768px) 680px,
            src="${URL_BASE_IMAGE + element.imageHigh}" alt="${element.nombre}" class="gallery__img">
        `;       
        //<figcaption>${element.name}</figcaption>
        container.appendChild(figure)
        }
    );    
    return container
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
        console.log(response);        
    } catch (error) {
        console.log(error)
        const titleError = document.createElement("h3");
        titleError.innerHTML= `
        <h3 class="error__API">Lo sentimos, la información no esta disponible en este momento.
        Por favor intenta más tarde, lamentamos los inconvenientes.</h3>`;
        nodeAPI_Offer.appendChild(titleError);
    }
}

conexion(URL);
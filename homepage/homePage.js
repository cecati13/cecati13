const host = "https://backend-cursos-cecati13.uc.r.appspot.com/";
const announceURL = host + "API/v1/frontendURL/50";
const imageURL = host + "API/V1/frontendURL/imageHomePage?size=17"
const URL_BASE_IMAGE = "https://storage.googleapis.com/cecati13/galeria/";
const containerMain = document.querySelector(".main__container");
const widthPort = window.innerWidth;

const arrayImage = [
    "background_portada.jpg",
]

class HomePage {
    constructor(obj) {        
        this.createAnnounces(obj);        
        this.removeClassAnimation();        
        preloader();
    }

    createAnnounces(object){        
        const containerImage1 = HomePage.imageCoverPage(0, "1");
        containerMain.appendChild(containerImage1);
        
        for (const key in object) {
            if (Object.hasOwnProperty.call(object, key)) {
                const element = object[key];                
                const container = document.createElement("div");
                container.className = "main__container__announce";
                const containerAnnounce = this.announce(element);
                container.appendChild(containerAnnounce);
                containerMain.appendChild(container);
            }
        }        
        const positions = numberRandom()
        const randomOne = positions[0];
        const randomTwo = positions[1];        
        const containerImage2 = HomePage.imageCoverPage(randomOne,"2");
        const containerImage3 = HomePage.imageCoverPage(randomTwo,"3");

        containerMain.append(containerImage2, containerImage3);        
    }
    
    static imageCoverPage(numberPosition,assignID){
        const container = document.createElement("div");
        container.className = "main__container__image image__change";
        container.id=`containerImageCoverPage${assignID}`;            
        container.innerHTML= `
        <img src="${URL_BASE_IMAGE}${arrayImage[numberPosition]}"
        alt="Imagen de portada del plantel"
        id="imageCoverPage${assignID}"
        >
        `;        
        return container;       
    }    
    
    announce(obj){
        const container = document.createElement("div");
        container.className = "main__container__announce--div";
        let animate = "";        
        const animation = obj.animacion.toUpperCase();        
        if (animation.includes("SI")) {
            animate = "buttonAnimate";
        }     
        if (obj.botones === undefined) {
            container.innerHTML = `
            <p class="main__container__announces--div__title">${obj.titulo}</p>
            <p>${obj.informacion}</p>
            <p class="main__container__announce--div__note">${obj.notas}</p>
        `;
        } else {
            container.innerHTML = `
            <p class="main__container__announce--div__title">${obj.titulo}</p>
            <p>${obj.informacion}</p>
            <p class="main__container__announce--div__note">${obj.notas}</p>
            <a href="${obj.link}" class="button__link ${animate}">${obj.botones}</a>
            `;
        }
        return container;
    }

    removeClassAnimation(){
        const node = document.getElementById(`containerImageCoverPage1`)    
        node.classList.remove("image__change")
    }    
}

function createArrayImageFetch(imageJSON){
    for (const key in imageJSON) {
        if (widthPort < 768) {
            arrayImage.push(imageJSON[key].imageSmall);
        } 
        else if (widthPort < 1024) {
            arrayImage.push(imageJSON[key].imageMedium);
        } 
        else {
            arrayImage.push(imageJSON[key].imageHigh);
        }        
    }
}

function numberRandom (){
    const min = 0;
    const max = arrayImage.length;

    let n = 0;
    let numero;
    let uno = 0;
    let dos = 0;    
    do {
        numero = Math.floor(Math.random() * (+max - +min)) + min;
        if ((numero != uno) && (numero != dos)) {           
            n++;
            if (n == 1) {
                uno = numero;
            }
            if (n == 2) {
                dos = numero;
            }
        }
    } 
    while (n < 2);
    const numbers = [uno, dos]    
    return numbers;
}

function changeImage() {
    opacityChange(2);
    opacityChange(3);            
    setTimeout(() => {
        const positions = numberRandom()
        //const arrayPositions = indexArrayImage()        
        //console.log("array que regreso la funcion indexArrayImage: ", arrayPositions)
        changeOneImage(2, positions[0])
        changeOneImage(3, positions[1])
        //changeOneImage(2, position1)
        //changeOneImage(3, position2)
        
    }, 250);
    
}

//trabajar en el clousure para que las imagenes se pasen una a una y vaya aumentando
const indexArrayImage = () => {    
    let positions = [1,2];
    //    let position2 = 2;
    return {
        function (increment) {
        console.log("antes: del forEach", positions)
        positions.forEach(element => {
            element += increment;
        });        
        console.log("despuesdel forEach: ", positions)
        return positions
    }
}
    return changeIndexArrayImage
}

function opacityChange(ubication){
    const imagen = document.getElementById(`imageCoverPage${ubication}`)
    imagen.style.opacity = "0.1";
}

function changeOneImage(ubication, numberArray){
    const imagen = document.getElementById(`imageCoverPage${ubication}`)
    imagen.src = `${URL_BASE_IMAGE}`+arrayImage[numberArray];    
    imagen.style.opacity = "0.1";
    setTimeout( ()=>{
        imagen.style.opacity = "1"
    }, 250)
}

function slide() {
    setTimeout(()=>{
        changeImage();
        setInterval(changeImage, 7000);
    },7000)
}

window.onload = slide();

function preloader() {
    const nodePreloader = document.querySelector(".preloader")
    nodePreloader.classList.toggle("preloader");
}

async function conexion() {
    try {
        const infoImage = await fetch(imageURL);
        const imageJSON = await infoImage.json();
        console.log(imageJSON);
        createArrayImageFetch(imageJSON);

        const info = await fetch(announceURL);
        const infoJSON = await info.json();
        console.log(infoJSON);        
        const announce = new HomePage(infoJSON);

    } catch (error) {
        console.log(error)
        preloader();
        const titleError = document.createElement("h3");
        titleError.innerHTML= `
        <h3 class="error__API">UPS!
        Lo sentimos, parece haber problemas con algunas funciones en el sitio.
        Por favor intenta más tarde, lamentamos los inconvenientes.</h3>`;
        titleError.style.backgroundColor = "var(--mainColor)"
        containerMain.appendChild(titleError);
    }
}
conexion();
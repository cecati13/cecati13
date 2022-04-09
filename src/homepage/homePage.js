const host = "http://localhost:3000/";
const URL = host + "API/v1/frontendURL/50";
const URLimage = host + "API/V1/frontendURL/imageHomePage?size=17"
const URL_BASE_IMAGE = "https://cecati13web.blob.core.windows.net/galeria/";
const containerMain = document.querySelector(".main__container");

const arrayImage = [
    "background_portada.jpg",
    "zonas_comunes1.jpeg",
    "zonas_comunes2.jpeg",
    "zonas_comunes3.jpeg",
    "zonas_comunes4.jpeg",
    "zonas_comunes5.jpeg",
    "zonas_comunes6.jpeg",
    "zonas_comunes7.jpeg",
    "zonas_comunes8.jpeg",
    "zonas_comunes9.jpeg",
    "zonas_comunes10.jpeg",
    "zonas_comunes11.jpeg",
    "zonas_comunes12.jpeg",
    "zonas_comunes14.jpeg",
    "zonas_comunes16.jpeg",
    "zonas_comunes17.jpeg",
    "zonas_comunes18.jpg",
]

class HomePage {
    constructor(obj) {        
        this.createAnnounces(obj);        
        this.removeClassAnimation();
        containerMain.style.width="100vw"
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
        //revisar cuantos anuncios habra en el sitio
        // const countAdvertisements = Object.keys(object).length;
        // let classAdvertisements = "main__container__announce--div";       
        // const names = Object.getOwnPropertyNames(object)
        // let count = 0;
        // while (count < countAdvertisements) {
        //     const container = document.createElement("div");
        //     container.className = "main__container__announce";
        //     const value = names[count];
        //     const containerAnnounce = this.announce(obj[value], classAdvertisements);            
        //     container.appendChild(containerAnnounce);            
        //     count++;
        //     containerMain.appendChild(container);
        // }
        
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
        //container.className = stringClass;
        const absolutePath = /^http?:\/\//i;
        let animate = "";        
        if (obj.animacion) {
            animate = "buttonAnimate";
        }
        if (!absolutePath.test(obj.link)) {
            obj.link = document.querySelector(`#${obj.link}`);
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
            <a href="${obj.linkPage}" class="button__link ${animate}">${obj.botones}</a>
            `;
        }
        return container;
    }

    removeClassAnimation(){
        const node = document.getElementById(`containerImageCoverPage1`)    
        node.classList.remove("image__change")
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
    containerMain.classList.toggle("preloader");
}

async function conexion(URL) {
    try {
        const infoImage = await fetch(URLimage);
        const imageJSON = await infoImage.json();
        console.log(imageJSON)
        const info = await fetch(URL);
        const infoJSON = await info.json();
        console.log(infoJSON);        
        const announce = new HomePage(infoJSON);


    } catch (error) {
        console.log(error)
        preloader();
        const titleError = document.createElement("h3");
        titleError.innerText= `
        Tenemos problemas con algunas funciones en el sitio.
        Por favor intenta más tarde, lamentamos los inconvenientes.`;
        titleError.style.color = "var(--fontColor)";        
        containerMain.appendChild(titleError);
    }
}
preloader();
conexion(URL);
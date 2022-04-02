const baseIMG = "https://cecati13web.blob.core.windows.net/galeria/";

const arrayHomePage = [
    cicloEscolar = {
        title : "Bienvenido",
        year : "2021-2022",
    },
    
    advertisements = {
        // ofertaActual : {
        //     title : "Información importante sobre el seguro escolar",
        //     information : "El seguro escolar es una póliza de gastos médicos que garantiza la atención",
        //     note : "",
        //     button : "Cursos",
        //     linkPage : "courses",
        //     animation: false            
        // },
        promocion : {
            title : "Promoción para cursos en marzo",
            information : 
            `Inscríbete a uno de nuestros cursos y obtén 50% de descuento para cursar un segundo. Para hacer válida la promoción se tienen que inscribir juntos ambos cursos (deben iniciar en el periodo señalado). Ahorro $150.`,
            note : 
            `Nota. Esta promoción es válida para los cursos que inician en marzo, regístrate a un curso con un costo regular de $300 y cursa un segundo curso pagando solo $150.`,
            button : "Inscríbete",
            linkPage : "inscription",
            animation: true
        },
        // clases : {
        //     title : "Galeria de imagenes",
        //     information : "Revisa alguans de nuestras imagenes disponibles. Conoce mejor tu plantel",
        //     button : "Galeria",
        //     note: "",
        //     linkPage : "http://cecati13.com.mx/assets/galeria/portada1.jpeg",
        //     animation: false
        // },
        // other : {
        //     title : "Prueba extra",
        //     information : "Una prueba mas con 4 elementos para ver como se ve sin boton ni elementos extras.",            
        //     note: "",            
        // },
    }
];

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
    constructor(array) {
        const nodeMain = document.querySelector("#main");
        const containerWelcome = this.welcome(array[0]);        
        const containerMain = this.createContainerMain(array[1]);
        nodeMain.append(containerWelcome, containerMain);
        this.removeClassAnimation();
    }

    createContainerMain(objArray){
        const containerMain = document.createElement("div");
        containerMain.className = "main__container";
        const containerImage1 = HomePage.imageCoverPage(0, "1");
        containerMain.appendChild(containerImage1);

        //revisar cuantos anuncios habra en el sitio
        const countAdvertisements = Object.keys(objArray).length;
        let classAdvertisements = "main__container__announce--div";       
        const names = Object.getOwnPropertyNames(objArray)
        let count = 0;
        while (count < countAdvertisements) {
            const container = document.createElement("div");
            container.className = "main__container__announce";
            const value = names[count];
            const containerAnnounce = this.announce(objArray[value], classAdvertisements);            
            container.appendChild(containerAnnounce);            
            count++;
            containerMain.appendChild(container);
        }
        
        const positions = numberRandom()
        const randomOne = positions[0];
        const randomTwo = positions[1];        
        const containerImage2 = HomePage.imageCoverPage(randomOne,"2");
        const containerImage3 = HomePage.imageCoverPage(randomTwo,"3");

        containerMain.append(containerImage2, containerImage3);
        return containerMain; 
    }
    
    static imageCoverPage(numberPosition,assignID){
        const container = document.createElement("div");
        container.className = "main__container__image image__change";
        container.id=`containerImageCoverPage${assignID}`;            
        container.innerHTML= `
        <img src="${baseIMG}${arrayImage[numberPosition]}"
        alt="Imagen de portada del plantel"
        id="imageCoverPage${assignID}"
        >
        `;        
        return container;       
    }    
    
    announce(obj, stringClass){
        const container = document.createElement("div");
        container.className = stringClass;
        const absolutePath = /^http?:\/\//i;
        let animate = "";        
        if (obj.animation) {
            animate = "buttonAnimate";
        }
        if (!absolutePath.test(obj.linkPage)) {
            obj.linkPage = document.querySelector(`#${obj.linkPage}`);
        }
        if (obj.button === undefined) {
            container.innerHTML = `
            <p class="main__container__announces--div__title">${obj.title}</p>
            <p>${obj.information}</p>
            <p class="main__container__announce--div__note">${obj.note}</p>
        `;
        } else {
            container.innerHTML = `
            <p class="main__container__announce--div__title">${obj.title}</p>
            <p>${obj.information}</p>
            <p class="main__container__announce--div__note">${obj.note}</p>
            <a href="${obj.linkPage}" class="button__link ${animate}">${obj.button}</a>
            `;
        }
        return container;
    }

    welcome(obj){
        const container = document.createElement("div");
        container.className = "main__welcome";
        container.innerHTML = `        
            <h3 class="main__welcome--title">${obj.title}</h3>
            <h3 class="main__welcome--age">${obj.year}</h3>
            `;
            
        return container
    }

    removeClassAnimation(){
        const node = document.getElementById(`containerImageCoverPage1`)    
        node.classList.remove("image__change")
    }    
}

const containerMain = new HomePage(arrayHomePage);

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
    imagen.src = `${baseIMG}`+arrayImage[numberArray];    
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
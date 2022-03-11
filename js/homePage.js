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
    "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes15.jpeg",
    "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes9.jpeg",
    "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes16.jpeg",
    "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes1.jpeg",
    "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes2.jpeg",
    "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes3.jpeg",
    "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes4.jpeg",
    "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes5.jpeg",
    "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes6.jpeg",
    "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes7.jpeg",
    "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes8.jpeg",
    "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes10.jpeg",
    "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes11.jpeg",
    "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes12.jpeg",
    "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes13.jpeg",
    "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes14.jpeg",
    "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes17.jpeg",
    "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes18.jpeg",
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
        <img src="${arrayImage[numberPosition]}"
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
            <h3 class="mainr__welcome--age">${obj.year}</h3>
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
    const max = 17;    

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

function animationClass(number){
    const node = document.getElementById(`containerImageCoverPage${number}`)
    if (node.classList.contains("image__change")) {
        node.classList.remove("image__change")        
    }
    node.classList.add("image__change");
}

function changeImage() {
    setInterval( () => {
        const positions = numberRandom()        
        removeAddImage(2,positions[0])        
        removeAddImage(3,positions[1])
    }, 6000)
//Ajustar tiempo segun animacion en la clase image__change en HomePage.css
}

function removeAddImage(ubication, numberArray){
    const image = arrayImage[numberArray];
    animationClass(ubication);
    const nodeImage = document.getElementById(`imageCoverPage${ubication}`)
    nodeImage.src = image;
}

window.onload = changeImage();

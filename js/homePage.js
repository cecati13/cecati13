const arrayHomePage = [
    cicloEscolar = {
        title : "Bienvenido",
        year : "2021-2022",
        image: "http://cecati13.com.mx/assets/galeria/Portada5.jpeg"
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

class HomePage {
    constructor(array) {
        const container = document.createElement("div");
        container.className = "main__container";
        const containerWelcome = this.welcome(array[0]);
        const containerAdvertisements = this.countAnnounce(array[1]);
        container.append(containerWelcome, containerAdvertisements);
        return container;        
    }
    
    countAnnounce(objArray){        
        const containerAdvertisements = document.createElement("div");
        containerAdvertisements.className = "main__container__advertisements";
        const countAdvertisements = Object.keys(objArray).length;
        let classAdvertisements = "main__container__advertisements--div"
        if (countAdvertisements === 1) {
            classAdvertisements = "main__container__advertisements--div main__container__advertisements--div--maxWidth"
        }
        const names = Object.getOwnPropertyNames(objArray)
        let count = 0;
        while (count < countAdvertisements) {              
            const value = names[count];        
            const container = this.announce(objArray[value], classAdvertisements);
            containerAdvertisements.appendChild(container);
            count++;
        }
        return containerAdvertisements;
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
            <p class="main__container__advertisements--div__title">${obj.title}</p>
            <p>${obj.information}</p>
            <p class="main__container__advertisements--div__note">${obj.note}</p>
        `;
        } else {
            container.innerHTML = `
            <p class="main__container__advertisements--div__title">${obj.title}</p>
            <p>${obj.information}</p>
            <p class="main__container__advertisements--div__note">${obj.note}</p>
            <a href="${obj.linkPage}" class="button__link ${animate}">${obj.button}</a>
            `;
        }
        return container;
    }

    welcome(obj){
        const container = document.createElement("div");
        container.className = "main__container__welcome";
        container.innerHTML = `        
            <h3 class="main__container__welcome--title">${obj.title}</h3>
            <h3 class="main__container__welcome--age">${obj.year}</h3>
            `;
            
        return container
    }
}

const nodeMain = document.querySelector("#main");
const containerMain = new HomePage(arrayHomePage);
nodeMain.appendChild(containerMain);
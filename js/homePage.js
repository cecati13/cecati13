const arrayHomePage = [
    cicloEscolar = {
        title : "Bienvenido",
        year : "2021-2022",
        image: "http://cecati13.com.mx/assets/galeria/Portada5.jpeg"
    },
    
    advertisements = {
        // ofertaActual : {
        //     title : "Información importante sobre el seguro escolar",
        //     information : "El seguro escolar es una póliza de gastos médicos que garantiza la atención de forma gratuita en caso de sufrir un accidente escolar; debido a la pandemia y que la mayoría de nuestros cursos se imparten a distancia les estamos brindando información a los alumnos que deseen contratar este seguro",
        //     note: "Nota. El Seguro Escolar contra Accidentes iniciará su operatividad en el momento que los alumnos asistan a sus escuelas de manera presencial y que haya contratado el mismo. El seguro Escolar tiene un costo de $65 que puede pagarse opcionalmente, cubre riesgos en las instalaciones del plantel y en el trayecto de ida y vuelta de las instalaciones educativas al domicilio (se aplican condiciones de la póliza). El costo es un solo pago de $65 y aplica para todos los cursos a los que se inscriban durante el ciclo escolar. Es recomendable para todos los cursos presenciales e híbridos. En caso de no contratar el seguro el plantel no se hace responsable por algún accidente que suceda dentro de las instalaciones",
        //     button : "Conoce las condiciones del seguro escolar",
        //     linkPage : "https://cecati13web.blob.core.windows.net/descargas/info_seguro_escolar.pdf",
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
        //     title : "Promoción",
        //     information : "Inscribete al primer curso por $300.00, e inscribete a $150.00",
        //     button : "Inscríbete",
        //     linkPage : "inscription",
        //     animation: true
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
        const names = Object.getOwnPropertyNames(objArray)
        let count = 0;
        while (count < countAdvertisements) {              
            const value = names[count];        
            const container = this.announce(objArray[value]);
            containerAdvertisements.appendChild(container);
            count++;
        }
        return containerAdvertisements;
    }

    announce(obj){
        const container = document.createElement("div");
        container.className = "main__container__advertisements--div";
        container.innerHTML = `        
            <p class="main__container__advertisements--div__title">${obj.title}</p>
            <p>${obj.information}</p>
            <p class="main__container__advertisements--div__note">${obj.note}</p>
            <a href="${obj.linkPage}" class="button__link buttonAnimate">${obj.button}</a>       
        `;
        return container;
    }

    welcome(obj){
        const container = document.createElement("div");
        container.className = "main__container__welcome";
        container.innerHTML = `        
            <h3 class="main__container__welcome--title">${obj.title}</h3>
            <h3 class="main__container__welcome--age">${obj.year}</h3>
            `;
            //<img src="${obj.image}" alt="Portada de CECATI 13">
        return container
    }
}

const nodeMain = document.querySelector("#main");
const containerMain = new HomePage(arrayHomePage);
nodeMain.appendChild(containerMain);




// function createContainer () {
//     const container = document.createElement("div");
//     return container;
// }

// function welcome (obj) {
//     const containerWelcome = createContainer();
//     containerWelcome.className = "main__container__welcome";
//     containerWelcome.innerHTML = `
//     <h3 class="main__container__welcome--title">${obj.title}</h3>
//     <h3 class="main__container__welcome--age">${obj.year}</h3>
//     `;
//     //<img class="main__container__welcome--img" src="${obj.image}">
//     return containerWelcome;
// }

// function advertisementsTotal(obj) {
//     const containerAdvertisements = createContainer();
//     containerAdvertisements.className = "main__container__advertisements";
//     const countAdvertisements = Object.keys(obj).length;
//     let classAdvertisements = "main__container__advertisements--div"
//     if (countAdvertisements === 1) {
//         classAdvertisements = "main__container__advertisements--div main__container__advertisements--div--maxWidth"
//     }
//     const names = Object.getOwnPropertyNames(obj)
//     let count = 0;
//     while (count < countAdvertisements) {              
//         const value = names[count];        
//         const container = createAdvertisements(obj[value], classAdvertisements);
//         containerAdvertisements.appendChild(container);
//         count++;
//     }
//     return containerAdvertisements;
// }

// function createAdvertisements(obj, stringClass) {
//     //crear el anuncio
//     const container = createContainer();
//     container.className = stringClass;

//     container.innerHTML = `
//         <p class="main__container__advertisements--div__title">${obj.title}</p>
//         <p>${obj.information}</p>
//         <p class="main__container__advertisements--div__note">${obj.note}</p>
//     `;
//     const button = document.createElement("a")
//     button.textContent = obj.button;
//     const absolutePath = /^https?:\/\//i;    
//     if (absolutePath.test(obj.linkPage)) {
//         button.href = obj.linkPage;
//     } else {
//         button.href = document.querySelector(`#${obj.linkPage}`);
//     }
//     button.className = "button__link";
//     if (obj.animation) {
//         button.classList.add("buttonAnimate");
//     }
//     if (obj.button) {        
//         container.append(button);
//     }     
//     return container;
// }

// const containerWelcome = welcome(homepage[0]);

// const containerMain = createContainer();
// containerMain.className = "main__container";
// containerMain.appendChild(containerWelcome);

// const containerAdvertisements = advertisementsTotal(homepage[1]);
// containerMain.appendChild(containerAdvertisements);
// nodeMain.appendChild(containerMain);
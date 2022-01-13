const homepage = [
    cicloEscolar = {
        title : "Bienvenido",
        year : "2021-2022"
    },
    
    advertisements = {
        ofertaActual : {
            title : "Visita nuestra oferta educativa. Actualmente tenemos las siguientes modalidades:",
            information : "a DISTANCIA, PRESENCIALES e HÍBRIDOS",
            note: "",
            button : "Oferta Educativa",
            linkPage : "offer",
            animation: false
        },    
        modalidades : {
            title : "Costo por curso $300.00.",
            information : 
            `Inscríbete a un segundo curso a mitad de precio`,
            note : 
            `NOTA: Estos cursos NO incluyen el pago de Seguro Escolar,
             si vas a inscribirte a un curso presencial o hibrido el 
             costo es de $65.00 pago ÚNICO, para todos los cursos a los 
             que te inscribas en el ciclo escolar y quedes cubierto por 
             algún accidente dentro de las instalaciones del plantel`,
            button : "Inscríbete",
            linkPage : "inscription",
            animation: true
        },
        // clases : {
        //     title : "",
        //     information : "Reanudamos actividades a partir del 03 de enero de 2022"
        // },
    }
];

//algoritmo
const nodeMain = document.querySelector("#main");

function createContainer () {
    const container = document.createElement("div");
    return container;
}

function welcome (obj) {
    const containerWelcome = createContainer();
    containerWelcome.className = "main__container__welcome";
    
    const h3Title = document.createElement("h3");
    h3Title.textContent = obj.title;
    h3Title.className = "main__container__welcome--title";    
    const h3Age = document.createElement("h3");
    h3Age.textContent = obj.year;
    h3Age.className = "main__container__welcome--age";

    containerWelcome.append(h3Title,h3Age);
    return containerWelcome;
}

function advertisementsTotal(obj) {
    const containerAdvertisements = createContainer();
    containerAdvertisements.className = "main__container__advertisements";
    const countAdvertisements = Object.keys(obj).length;
    const names = Object.getOwnPropertyNames(obj)
    let count = 0;
    while (count < countAdvertisements) {              
        const value = names[count];        
        const container = createAdvertisements(obj[value]);
        containerAdvertisements.appendChild(container);
        count++;
    }
    return containerAdvertisements;
}

function createAdvertisements(obj) {
    //crear el anuncio
    const container = createContainer();
    container.className = "main__container__advertisements--div";

    const title = document.createElement("p");    
    title.textContent = obj.title;
    title.className = "main__container__advertisements--div__title";

    const information = document.createElement("p");
    information.textContent = obj.information;
    information.className = "";

    const note = document.createElement("p");
    note.textContent = obj.note;
    note.className = "main__container__advertisements--div__note";

    const button = document.createElement("a")
    button.textContent = obj.button;    
    button.href = document.querySelector(`#${obj.linkPage}`);
    button.className = "button__link";
    if (obj.animation) {
        button.classList.add("buttonAnimate");
    }
    if (obj.button) {        
        container.append(title, information, note, button);
    } else {
        container.append(title,information, note)
    }
    return container;
}

const containerWelcome = welcome(homepage[0]);

const containerMain = createContainer();
containerMain.className = "main__container";
containerMain.appendChild(containerWelcome);

const containerAdvertisements = advertisementsTotal(homepage[1]);
containerMain.appendChild(containerAdvertisements);
nodeMain.appendChild(containerMain);
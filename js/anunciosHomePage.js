const homepage = [
    cicloEscolar = {
        title : "Bienvenido",
        year : "2021-2022"
    },
    
    advertisements = {
        ofertaActual : {
            title : "Revisa nuestra oferta educativa para",
            information : "Enero y Febrero 2022",
            button : "Oferta Educativa",
            linkPage : "offer",
            animation: false
        },    
        modalidades : {
            title : "Actualmente tenemos las siguientes modalidades:",
            information : "A DISTANCIA, PRESENCIALES e HÍBRIDOS",
            button : "Inscríbete",
            linkPage : "inscription",
            animation: true
        }
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
    title.className = "";

    const information = document.createElement("p");
    information.textContent = obj.information;
    information.className = "";

    const button = document.createElement("a")
    button.textContent = obj.button;    
    button.href = document.querySelector(`#${obj.linkPage}`);
    button.className = "button__link";
    if (obj.animation) {
        button.classList.add("buttonAnimate");
    }
    container.append(title,information,button)
    return container;
}

const containerWelcome = welcome(homepage[0]);

const containerMain = createContainer();
containerMain.className = "main__container";
containerMain.appendChild(containerWelcome);

const containerAdvertisements = advertisementsTotal(homepage[1]);
containerMain.appendChild(containerAdvertisements);
nodeMain.appendChild(containerMain);
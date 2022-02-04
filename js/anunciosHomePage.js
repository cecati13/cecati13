const homepage = [
    cicloEscolar = {
        title : "Bienvenido",
        year : "2021-2022"
    },
    
    advertisements = {
        ofertaActual : {
            title : "Información importante sobre el seguro escolar",
            information : "El seguro escolar es una póliza de gastos médicos que garantiza la atención de forma gratuita en caso de sufrir un accidente escolar; debido a la pandemia y que la mayoría de nuestros cursos se imparten a distancia les estamos brindando información a los alumnos que deseen contratar este seguro",
            note: "Nota. El Seguro Escolar contra Accidentes iniciará su operatividad en el momento que los alumnos asistan a sus escuelas de manera presencial y que haya contratado el mismo. El seguro Escolar tiene un costo de $65 que puede pagarse opcionalmente, cubre riesgos en las instalaciones del plantel y en el trayecto de ida y vuelta de las instalaciones educativas al domicilio (se aplican condiciones de la póliza). El costo es un solo pago de $65 y aplica para todos los cursos a los que se inscriban durante el ciclo escolar. Es recomendable para todos los cursos presenciales e híbridos. En caso de no contratar el seguro el plantel no se hace responsable por algún accidente que suceda dentro de las instalaciones",
            button : "Conoce las condiciones del seguro escolar",
            linkPage : "https://cecati13web.blob.core.windows.net/descargas/info_seguro_escolar.pdf",
            animation: false
        },    
        modalidades : {
            title : "Promoción para cursos de enero y febrero",
            information : 
            `Inscríbete a uno de nuestros cursos y obtén 50% de descuento para cursar un segundo. Para hacer válida la promoción se tienen que inscribir juntos ambos cursos (deben iniciar en el periodo señalado). Ahorro $150.`,
            note : 
            `Nota. Esta promoción es válida para los cursos que inician en los meses de enero y febrero, regístrate a un curso con un costo regular de $300 y cursa un segundo curso pagando solo $150.`,
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
    const absolutePath = /^https?:\/\//i;    
    if (absolutePath.test(obj.linkPage)) {
        button.href = obj.linkPage;
    } else {
        button.href = document.querySelector(`#${obj.linkPage}`);
    }
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
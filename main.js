//verificar que no hay puerto definido, para determinar donde crear los enlaces.
const verifyingRegularExpression = /\d\d\d\d/
const verifyingRegularExpression2 = /github/

//URL cecati13 para hacer deploy: 
let URL_hostname =""
let index = "";

const verifyGithub = verifyingRegularExpression2.test(window.location.hostname) 
const verify = verifyingRegularExpression.test(window.location.port) 
if (verify) {
//estamos en localhost
    URL_hostname = ".."
}
if (verifyGithub) {
    URL_hostname = "cecati13";
    index = "index.html";
}

const pageDataLinks = [   
    {
        page: "home",
        content: "Inicio",
        link: `/${index}`,
        ubication: "NAV",
        attribute: false
    },
    {
        page: "specialties",
        content: "Especialidades",
        link: "/html/Especialidades.html",
        ubication: "NAV",
        attribute: false
    },
    {
        page: "offer",
        content: "Oferta Educativa",
        link: "/html/OfertaEducativa.html",
        ubication: "NAV",
        attribute: false
    },
    {
        page: "inscription",
        content: "Inscripción",
        link: "/html/Inscribete.html",
        ubication: "NAV",
        attribute: false
    },
    // {
    //     page: "documentation",
    //     content: "Documentación",
    //     link: "/html/Documentacion.html",
    //     ubication: "FOOTER",
    //     attribute: false
    // },
    {
        page: "roco",
        content: "ROCO",
        link: "/html/Rocos.html",
        ubication: "FOOTER",
        attribute: false
    },
    {
        page: "gallery",
        content: "Galería de Imágenes",
        link: "/html/Galeria.html",
        ubication: "NAV",
        attribute: false
    },
    {
        page: "contact",
        content: "Contacto",
        link: "/html/Contacto.html",
        ubication: "NAV",
        attribute: false
    },
    {
        page: "calendar",
        content: "Calendario Escolar",
        link: "https://www.gob.mx/sep?tab=Calendario%20escolar",
        ubication: "FOOTER",
        attribute: {
            target: "_blank"
        }
    },
    {
        page: "facebook",
        content: "Facebook",
        link: "https://www.facebook.com/cecati.trece/about",
        ubication: "FOOTER",
        attribute: {
            target: "_blank"
        }
    },
    {
        page: "youtube",
        content: "YouTube",
        link: "https://www.youtube.com/channel/UC5LX_ksGHFpydgsMJdWCv0A",
        ubication: "FOOTER",
        attribute: {
            target: "_blank"
        }
    },    
];

const menu = document.getElementById("menu");
const menuSVG = ["lineSpin1", "lineSpin2", "lineSpinHide"];
// const lineSpinHide = document.getElementById("lineSpinHide");
// const lineSpin1 = document.getElementById("lineSpin1");
// const lineSpin2 = document.getElementById("lineSpin2");
const nav = document.getElementById("navigator");
const footer = document.querySelector("#footer");

//1) crear contenedores UL
function createUL (typeclass) {
    const containerUL = document.createElement("ul");
    containerUL.className = typeclass;
    return containerUL;
}
//2)funcion que arme el contenido de los LI en NAV y FOOTER
function contentCreation(element) {
    const li = document.createElement("li");
    const aHtml = document.createElement("a");
    aHtml.textContent = element.content;
    aHtml.id = element.page;    
    aHtml.href = element.link
    //verificar ajuste para deploy en cecati13.com.mx
    if (verifyGithub)  {
        aHtml.href = URL_hostname + element.link;    
    }
    ////termina parte a verificar deploy
    if (typeof(element.attribute) === "object") {        
        aHtml.target = element.attribute.target;
    }
    if (element.ubication === "NAV") {
        aHtml.className = "nav__show--ul__link";
        li.appendChild(aHtml);
        navMenu.appendChild(li);
    } else {        
        li.appendChild(aHtml);
        footerMenu.appendChild(li);
    }
}
function menuAnimation(element) {
    const nodeLineSVG = document.querySelector(`#${element}`);
    nodeLineSVG.classList.toggle(element);
}

//crear menu NAV y FOOTER
const navMenu = createUL("nav__show--ul");
const footerMenu = createUL("footer__contact");
pageDataLinks.map(contentCreation);
nav.appendChild(navMenu);
footer.appendChild(footerMenu);

//Abrir y cerrar menu en Mobile
menu.addEventListener("click", ()=> {    
    if (nav.classList.contains("nav__hide")) {
        window.scroll(top);
    }    
    menuSVG.map(menuAnimation);
    nav.classList.toggle("nav__hide");
    nav.classList.toggle("nav__show");    
})
const pageDataLinks = [   
    {
        page: "home",
        content: "Inicio",
        link: "../index.html",
        ubication: "NAV",
        attribute: false
    },
    {
        page: "specialties",
        content: "Especialidades",
        link: "../html/Especialidades.html",
        ubication: "NAV",
        attribute: false
    },
    {
        page: "offer",
        content: "Oferta Educativa",
        link: "../html/OfertaEducativa.html",
        ubication: "NAV",
        attribute: false
    },
    {
        page: "inscription",
        content: "Inscripción",
        link: "../html/Inscribete.html",
        ubication: "NAV",
        attribute: false
    },
    {
        page: "documentation",
        content: "Documentación",
        link: "../html/Documentacion.html",
        ubication: "NAV",
        attribute: false
    },
    {
        page: "roco",
        content: "ROCO",
        link: "../html/Rocos.html",
        ubication: "NAV",
        attribute: false
    },
    {
        page: "gallery",
        content: "Galería",
        link: "../html/Galeria.html",
        ubication: "NAV",
        attribute: false
    },
    {
        page: "contact",
        content: "Contacto",
        link: "../html/Contacto.html",
        ubication: "FOOTER",
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
        page: "facebook-group",
        content: "Grupo de Programación en Facebook",
        link: "https://es-la.facebook.com/groups/1537489526570773/",
        ubication: "FOOTER",
        attribute: {
            target: "_blank"
        }
    },    
    {
        page: "facebook",
        content: "Página de Facebook",
        link: "https://www.facebook.com/cecati.trece/about",
        ubication: "FOOTER",
        attribute: {
            target: "_blank"
        }
    },
];

const menu = document.getElementById("menu");
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
    aHtml.href = element.link;
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

//crear menu NAV y FOOTER
const navMenu = createUL("nav__show--ul");
const footerMenu = createUL("footer__contact");
pageDataLinks.map(contentCreation);
nav.appendChild(navMenu);
footer.appendChild(footerMenu);

//Abrir y cerrar menu en Mobile
menu.addEventListener("click", ()=> {    
    nav.classList.toggle("nav__hide");
    nav.classList.toggle("nav__show");    
})


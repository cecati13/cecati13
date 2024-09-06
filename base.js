class Base {
  getApi() {
    return "https://apic13inscripciones-dev.up.railway.app/API/v1";
  }

  getFunctionsAPI() {
    //return "https://us-east1-backend-cursos-cecati13.cloudfunctions.net/API-V2";
    return "http://localhost:8080";
  }

  createNAV(ub) {
    const nav = document.createElement("nav");
    nav.className = "nav__hide";
    nav.id = "navigator";
    nav.innerHTML = `
        <ul class="nav__show--ul">
            <li>
                <a id="home" href="${ub}/" class="nav__show--ul__link">Inicio</a>
            </li>
            <li>
                <a id="courses" href="${ub}/cursos" class="nav__show--ul__link">Cursos Disponibles</a>
            </li>
            <li>
                <a id="question" href="${ub}/preguntas" class="nav__show--ul__link">Preguntas Frecuentes</a>
            </li>
            <li>
                <a id="services" href="${ub}/servicios" class="nav__show--ul__link">Servicios</a>
            </li>
        </ul>   
        `;
    // <li>
    //     <a id="specialties" href="${ub}/oferta" class="nav__show--ul__link">Oferta Educativa</a>
    // </li>
    return nav;
  }
  createFOOTER(ub) {
    const footerUL = document.createElement("ul");
    footerUL.className = "footer__contact";
    footerUL.innerHTML = `
        <li>
            <a id="gallery" href="${ub}/galeria">Galería de Imágenes</a>
        </li>
        <li>
        <a id="contact" href="${ub}/contacto">Contacto y Ubicación</a>
        </li>
        <li>
            <a 
                id="calendar" 
                href="https://storage.googleapis.com/cecati13/Calendario%202024-2025.pdf" 
                target="_blank"
            >
                Calendario Escolar
            </a>
        </li>
        <li>
            <a id="facebook" href="https://www.facebook.com/cecati.trece/about" target="_blank">
            <div class="footer__contact--img--text">Facebook</div>
            <img src="https://storage.googleapis.com/cecati13/assets/facebook-logo.png" 
            alt="Facebook" class="footer__contact--img" height="50px">
            </a>
            <a id="youtube" href="https://www.youtube.com/channel/UC5LX_ksGHFpydgsMJdWCv0A" target="_blank">
            <div class="footer__contact--img--text">YouTube</div>
            <img src="https://storage.googleapis.com/cecati13/assets/youtube-logo.png"
            alt="YouTube" class="footer__contact--img" height="50px">
            </a>
        </li>
        `;
    const footer = document.querySelector("#footer");
    const line = this.createLine();
    footer.append(line, footerUL);
  }

  constructor() {
    const ubication = this.verifyHost();
    this.createHeader(ubication);
    this.createFOOTER(ubication);
  }

  verifyHost() {
    let hostname = "";
    const verifying = /github/;
    const verifyGithub = verifying.test(window.location.hostname);
    if (verifyGithub) {
      hostname = "/cecati13";
    }
    return hostname;
  }

  createHeader(ubication) {
    const menu = this.createMenu();
    const header = this.createHeaderPort(ubication);
    const nav = this.createNAV(ubication);
    const line = this.createLine();
    const nodeHeader = document.getElementById("header");
    nodeHeader.append(menu, header, nav, line);
  }

  createHeaderPort(ub) {
    const container = document.createElement("div");
    container.className = "header__port";
    container.innerHTML = `        
        <a href="${ub}/"><img class="header__port--imgSEP" src="https://upload.wikimedia.org/wikipedia/commons/f/fc/SEP_Logo_2019.svg" alt="Secretaria de Educación Pública"></a>
        <div class="header__port__title">
            <a href="${ub}/"><h1 class="header__port--C13">CECATI 13</h1></a>
            <h2 class="header__port__title--h1">Centro de Capacitación para el Trabajo Industrial No. 13</h2>
            <h2 class="header__port__title--h2">Profesor "Abraham Lezama Bretón"</h2>
        </div>
        <img class="header__port--imgC13" src="https://storage.googleapis.com/cecati13/assets/LogoCecati.png" alt="Logo CECATI 13">
        `;
    return container;
  }

  createMenu() {
    const containerSVG = document.createElement("div");
    containerSVG.className = "menu";
    containerSVG.innerHTML = `
        <svg id="menu" class="menu__mobile"  viewBox="0 0 46 34.5" stroke-linecap="round" stroke-width="6px">
            <line id="lineSpinHide" x1="3" y1="17.25" x2="43" y2="17.25"/>
            <line id="lineSpin1" x1="3" y1="31.5" x2="43" y2="31.5"/>
            <line id="lineSpin2" x1="3" y1="3" x2="43" y2="3"/>
        </svg>
        <p class="menu--legend">MENÚ</p>
        `;
    return containerSVG;
  }
  createLine() {
    const line = document.createElement("hr");
    line.className = "line";
    return line;
  }
}
const base = new Base();

//Abrir y cerrar menu en Mobile
const menuSVG = ["lineSpin1", "lineSpin2", "lineSpinHide"];
const nav = document.getElementById("navigator");

function menuAnimation(element) {
  const nodeLineSVG = document.querySelector(`#${element}`);
  nodeLineSVG.classList.toggle(element);
}

menu.addEventListener("click", () => {
  if (nav.classList.contains("nav__hide")) {
    window.scroll(top);
  }
  menuSVG.map(menuAnimation);
  nav.classList.toggle("nav__hide");
  nav.classList.toggle("nav__show");
});

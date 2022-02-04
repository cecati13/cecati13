class Header {
    constructor() {
        const mainHeader = this.createMainContainer();
        const nodeHeader = document.getElementById("header");
        const nodeNAV = this.createNAV(this.nav);
        nodeHeader.appendChild(mainHeader);        
        nodeHeader.appendChild(nodeNAV);
        return nodeHeader;
    }

    createNAV(obj) {
        const node = this.createElementHTML(obj);
        return node;
    }

    createMainContainer () {
        const containerMain =  this.createContainerHeaderMain();
        return containerMain;
    }

    createContainerHeaderMain () {        
        const container = this.createElementHTML(this.containers, "general");
        const imageSEP = this.createElementHTML(this.logoSEP, "");
        const childContainer = this.createElementHTML(this.titles, "Array");        
        const imageCecati = this.createElementHTML(this.logoCecati, "");
        container.append(imageSEP, childContainer, imageCecati)
        return container;
    }

    createElementHTML (obj, typeContainer) {
        //resolver el asunto de los div    
        if (obj.htmlType === "div") {
            const findClass = this.findClassContainer(obj, typeContainer);
            obj.class = findClass;
        }
        if (Array.isArray(obj)) {//aplicar recursividad
            const container = this.createElementHTML(this.containers, "title");
            obj.forEach(element => {
                const title = this.createElementHTML(element, "");
                container.appendChild(title);
            });
            return container;
        } else {
            const element = this.createElement(obj);
            return element;
        }
    }

    findClassContainer(obj, type) {
        const everythingArray = Object.entries(obj);
        const findClass = everythingArray.find(item => item[0] === type);
        const newClass = findClass[1].class;
        return newClass;
    }
    
    createElement (obj) {
        const element = document.createElement(obj.htmlType);
        if (obj.class) {
            element.className = obj.class;
        }
        if (obj.id) {
            element.id = obj.id
        }
        if (obj.url) {
            element.src = obj.url;                
        }
        if (obj.alt) {                
            element.alt = obj.alt;
        }
        if (obj.legend) {                
            element.textContent= obj.legend;
        }
        return element;
    }    
    
    logoCecati = {
        htmlType: "img",
        url : "https://cecati13web.blob.core.windows.net/assets-web-cecati13/LogoCecati.png",
        alt : "Logo CECATI 13",
        class : "header__port--imgC13"
    }
    
    logoSEP = {
        htmlType: "img",
        url : "https://upload.wikimedia.org/wikipedia/commons/f/fc/SEP_Logo_2019.svg",
        //logo 2 = "https://cecati13web.blob.core.windows.net/assets-web-cecati13/LogoSep.png"
        alt : "Secretaria de Educación Pública",
        class : "header__port--imgSEP"
    }
    
    containers = {
        htmlType: "div",
        class: "",
        general : {
            class: "header__port",
        },
        title : {
            class: "header__port__title"
        }
    }
    
    titles = [
        {   htmlType : "h1",
        class : "header__port--C13",
        legend : "CECATI 13",
        },
        {   htmlType : "h1",
        class : "header__port__title--h1",
        legend : "Centro de Capacitación para el Trabajo Industrial No. 13",
            },
            {   htmlType : "h2",
            class : "header__port__title--h2",
            legend : `Profesor "Abraham Lezama Breton"`,
        },
    ];

    nav = {
        htmlType : "nav",
        id : "navigator",
        class : "nav__hide"
    }
}

const headerMain = new Header();
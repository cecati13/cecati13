//modelo en HMTL:
{/* <svg id="menu" class="menu__mobile"  viewBox="0 0 46 34.5" stroke-linecap="round" stroke-width="6px">
    <line id="lineSpinHide" x1="3" y1="17.25" x2="43" y2="17.25"/>
    <line id="lineSpin1" x1="3" y1="31.5" x2="43" y2="31.5"/>
    <line id="lineSpin2" x1="3" y1="3" x2="43" y2="3"/>
</svg> */}

// const attributsSVG = ["menu", {viewBox: "0 0 46 34.5"}];
// const line0 = ["lineSpinHide", { x1: 3, y1: 17.25, x2: 43, y2: 17.25 }];
// const line1 = ["lineSpin1", { x1: 3, y1: 31.25, x2: 43, y2: 31.25 }];
// const line2 = ["lineSpin2", { x1: 3, y1: 3, x2: 43, y2: 3 }];

class MenuMobile {
    //posicion en array= 0:tipo de elemento, 1:id del elemento, 2:clase en CSS, 3:Atributos del elemento(obj)
    attributsSVG = ["svg", "menu", "menu__mobile",{viewBox: "0 0 46 34.5"}];
    line0 = ["line", "lineSpinHide", "", { x1: "3", y1: "17.25", x2: "43", y2: "17.25" }];
    line1 = ["line", "lineSpin1", "", { x1: "3", y1: "31.25", x2: "43", y2: "31.25" }];
    line2 = ["line", "lineSpin2", "", { x1: "3", y1: "3", x2: "43", y2: "3" }];
    legend = ["p", "menuLegend", "menu--legend", { text:"MENÚ" }];

    constructor () {
        const containerSVG = document.createElement("div");
        const svg = this.createSVG();
        containerSVG.appendChild(svg);
        const legendMenu = this.createLegend(this.legend);
        const nodeMenu = this.mountAppend(containerSVG, legendMenu);
        debugger
        const nodeHeader = document.getElementById("header");
        nodeHeader.appendChild(nodeMenu);
        return nodeMenu;
    }
    
    createSVG() {
        const SVG_NS = "http://www.w3.org/2000/svg";
        let elementSVG = this.createElementNS(SVG_NS, this.attributsSVG);
        const lineSpinHide = this.createElementNS(SVG_NS, this.line0);
        const lineSpin1 = this.createElementNS(SVG_NS, this.line1);
        debugger
        const lineSpin2 = this.createElementNS(SVG_NS, this.line2);
        elementSVG.append(lineSpinHide,lineSpin1,lineSpin2)
        return elementSVG;
    }

    createElementHTML(array) {
        const element = document.createElement(array[0]);        
        const elementWithAttributs = this.createAttributes(element, array[3]);
        elementWithAttributs.id = array[1];
        elementWithAttributs.classname = array[2];
        return elementWithAttributs;
    }

    createElementNS(type, array) {
        const element = document.createElementNS(type, array[0]);        
        const elementWithAttributs = this.createAttributes(element, array[3]);
        elementWithAttributs.id = array[1];
        elementWithAttributs.classname = array[2];
        return elementWithAttributs;
    }

    createAttributes(elementHTML, objectAttributes){        
        for (const atribute in objectAttributes) {
            if (Object.hasOwnProperty.call(objectAttributes, atribute)) {
                const property = objectAttributes[atribute];
                elementHTML.setAttributeNS(null, atribute, property)
            }
        }
        return elementHTML;
    }

    createLegend(array) {        
        const element = document.createElement(array[0]);
        element.id= array[1];
        element.classname = array[2];
        element.textcontent = array[3].text;
        return element;
    }

    mountAppend(node1, node2){
        const node = document.createElement("div")
        node.append(node1, node2);
        node.className = "menu";
        return node;
    }
}
const menuObject = new MenuMobile();
console.log(typeof(menuObject));
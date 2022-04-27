// const curp = document.querySelector("#curp");
// const matricula = document.querySelector("#matricula");
//const API = "http://localhost:3000/API/V1/students";
const API = "https://backend-cursos-cecati13.uc.r.appspot.com/API/V1/students";

const result = document.querySelector(".consult__info__API")
const formConsult= document.querySelector("#matriculaORcurp");

async function consult(valueMatricula, valueCurp) {    
    const formData = new FormData();
    formData.set("matricula", valueMatricula)
    formData.set("curp", valueCurp.toUpperCase())
    const response = await send(formData);
    console.log("Matricula", valueMatricula)
    console.log("Curp", valueCurp.toUpperCase())
    console.log("Valores desde API: ", response)
    const nodeResponse = document.createElement("div");
    const textNode =     
        response.a_paterno + " " +
        response.a_materno + " " +
        response.nombre + ". Matricula: " +
        response.matricula + " CURP: " +
        response.curp;
        console.log("TextNode: ", textNode)
    nodeResponse.innerText = textNode;
    result.appendChild(nodeResponse)
}

function noValues () {
    alert("Ingresa tu CURP o tu número de matricula antes de presionar Enviar");
}

function mustBeNumber() {
    alert("La matricula deben ser solo numeros. Intenta nuevamente.");
}

async function send(formData) {
    //backend no preparado aun para recibir formdata
    //enviar mientras tanto como un json Stringify para que lo reciba como application/json
    const jsonSend = {
        matricula: formData.get("matricula"),
        curp: formData.get("curp")
    };   
    const response = await fetch( API, {
        method: "POST",
        headers: {
            //"Content-Type": "multipart/form-data"
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonSend)
    })    
    return response.json()
}


formConsult.addEventListener("submit", (e)=> {
    e.preventDefault();    
    const values = new FormData(formConsult);
    const valueCurp = values.get("curp");
    const valueMatricula = values.get("matricula");
    
    if (valueMatricula || valueCurp) {             
        if (Number.isInteger(parseInt(valueMatricula)) || valueMatricula == "") {
            consult(valueMatricula, valueCurp)
        } else {
            mustBeNumber();
        }
    }
    else {
        noValues();
    }
})
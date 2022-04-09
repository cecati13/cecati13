// const curp = document.querySelector("#curp");
// const matricula = document.querySelector("#matricula");
const API = "http://localhost:3000/API/V1/students";

const result = document.querySelector(".consult__info__API")
const formConsult= document.querySelector("#matriculaORcurp");

function consult(valueMatricula, valueCurp) {
    const formData = new FormData();
    formData.set("matricula", valueMatricula)
    formData.set("curp", valueCurp.toUpperCase())
    const response = send(formData);
    console.log("Matricula", valueMatricula)
    console.log("Curp", valueCurp.toUpperCase())
    
}

function noValues () {
    alert("Ingresa tu CURP o tu número de matricula antes de presionar Enviar");
}

function mustBeNumber() {
    alert("La matricula deben ser solo numeros. Intenta nuevamente.");
}

async function send(formData) {
    debugger
    const response = await fetch( API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: formData
    })
    console.log(response)
    return response
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
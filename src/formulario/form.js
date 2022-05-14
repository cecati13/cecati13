//const API = "http://localhost:3000/API/V1/students";
const API = "https://backend-cursos-cecati13.uc.r.appspot.com/API/V1/students";

const result = document.querySelector(".result__API");
const formConsult = document.querySelector("#matriculaORcurp");
const typeRegister = document.querySelector(".typeRegister");

async function consult(valueMatricula, valueCurp) {
    const formData = new FormData();
    formData.set("matricula", valueMatricula)
    formData.set("curp", valueCurp.toUpperCase())
    const response = await send(formData);
    if (response.error) {
        preloader(result);
        console.log("Valores desde API: ", response)
        alert("Hay un error en la información capturada, por favor revisa e intenta nuevamente")
    } else {
        const container = consultSucessful(response);
        const storageResponse = JSON.stringify(response);
        sessionStorage.setItem("pre-registerStudent", storageResponse);        
        cleanInputs()                
        result.appendChild(container);
        preloader(result);
    }
}

function consultSucessful(info){
    const container = document.createElement("div");
    container.id = "result__API--container"    
    container.innerHTML = `
    <p>${info.nombre} ${info.a_paterno}, por favor verifica que los siguientes datos en nuestro sistema correspondan a tú registro.</p>
    <p>No. de Matricula: ${info.matricula}</p>
    <p>${info.email} ¿es un correo actual, al que tienes acceso?</p>
    <p>¿Tú numero telefónico actual tiene terminación ${info.telefono} ?</p>
    <br>
    <p>¿Deseas actualizar algún dato que haya cambiado desde el último curso al que te inscribiste con nosotros?</p>
    <button onclick="updateData()">Deseo actualizar mi información personal</button>
    `;
    return container
}

function removePreviousConsult(){    
    if (result.childElementCount > 0) {
        const node = document.getElementById("result__API--container");
        result.removeChild(node);
    }
}

function removeButtonBack() {
    const node = document.getElementById("dbRegisterButton")
    node.classList.add("registerHide")
}

function inputValue(ubication, value){
    const nodeValue = document.getElementById(ubication)
    nodeValue.value = value
}

function cleanInputs() {
    const curp = document.getElementById("curpOnDB")
    const matricula = document.getElementById("matriculaOnDB")
    curp.value = "";
    matricula.value="";
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

function updateData () {
    const updateRegister = document.querySelector("#updateRegister")
    updateRegister.classList.remove("registerHide");
    removeButtonBack()
}

function studentC13YES () {    
    const dbRegister = document.querySelector("#dbRegister");
    dbRegister.classList.toggle("registerHide");
    typeRegister.classList.toggle("registerHide");    
}
function studentC13NO() {    
    const newRegister = document.querySelector("#newRegister");
    newRegister.classList.toggle("registerHide");
    typeRegister.classList.toggle("registerHide");    
}

function preloader(node) {
    node.classList.toggle("preloader");
}

formConsult.addEventListener("submit", (e)=> {
    e.preventDefault();
    preloader(result);
    removePreviousConsult();
    const values = new FormData(formConsult);
    const valueCurp = values.get("curpOnDB");
    const valueMatricula = values.get("matriculaOnDB");
    
    if (valueMatricula || valueCurp) {             
        if (Number.isInteger(parseInt(valueMatricula)) || valueMatricula == "") {
            consult(valueMatricula, valueCurp)
        } else {
            mustBeNumber();
            preloader(result);
        }
    }
    else {
        noValues();
        preloader(result);
    }
})

//Para usar con VueJS
const estados = {
    AGUASCALIENTES: "AGUASCALIENTES",
    BAJA_CALIFORNIA: "BAJA_CALIFORNIA",
    BAJA_CALIFORNIA_SUR: "BAJA_CALIFORNIA_SUR",
    CAMPECHE: "CAMPECHE",
    COAHUILA: "COAHUILA",
    COLIMA: "COLIMA",
    CHIAPAS: "CHIAPAS",
    CHIHUAHUA: "CHIHUAHUA",
    DISTRITO_FEDERAL: "DISTRITO_FEDERAL",
    CDMX: "CDMX",
    DURANGO: "DURANGO",
    GUANAJUATO: "GUANAJUATO",
    GUERRERO: "GUERRERO",
    HIDALGO: "HIDALGO",
    JALISCO: "JALISCO",
    ESTADO_DE_MEXICO: "ESTADO_DE_MEXICO",
    NO_ESPECIFICADO: "NO_ESPECIFICADO",
    MICHOACAN: "MICHOACAN",
    MORELOS: "MORELOS",
    NAYARIT: "NAYARIT",
    NUEVO_LEON: "NUEVO_LEON",
    OAXACA: "OAXACA",
    PUEBLA: "PUEBLA",
    QUERETARO: "QUERETARO",
    QUINTANA_ROO: "QUINTANA_ROO",
    SAN_LUIS_POTOSI: "SAN_LUIS_POTOSI",
    SINALOA: "SINALOA",
    SONORA: "SONORA",
    TABASCO: "TABASCO",
    TAMAULIPAS: "TAMAULIPAS",
    TLAXCALA: "TLAXCALA",
    VERACRUZ: "VERACRUZ",
    YUCATAN: "YUCATAN",
    ZACATECAS: "ZACATECAS",
}
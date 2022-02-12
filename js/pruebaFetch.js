const azureURL = "https://cecati13api.azurewebsites.net";
const cloudServerURL = "http://svo-5-191.servidoresvirtuales.mx";
const localhost = "http://localhost:3500"
const nodePrueba = document.getElementById("prueba");

async function conexion(URL) {
    try {
        const crud = await fetch(`${URL}/api/v1/educativeOffer`);        
        const response = await crud.json()
        console.log(response);
        const container = document.createElement("div");
        container.className = "educativeOffer__api__containerGral";
        response.forEach(element => {
            container.innerHTML += `<div class="educativeOffer__api__containers">
            Profesor: ${element.profesor} - especialidad: ${element.especialidad}
             curso: ${element.curso} - Horas: ${element.horas}</div>`
        });
        nodePrueba.appendChild(container);
    } catch (error) {
        console.log("falla en el fetch", error)
    }
}

conexion(cloudServerURL);

const title = document.createElement("h2");
title.innerText = "Cursos disponibles:"
title.className="educativeOffer__api--title";

nodePrueba.appendChild(title);
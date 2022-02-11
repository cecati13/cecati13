const azureURL = "https://cecati13api.azurewebsites.net";
const cloudServerURL = "http://svo-5-191.servidoresvirtuales.mx";
const localhost = "http://localhost:3500"
const nodePrueba = document.getElementById("prueba");

async function conexion(URL) {
    try {
        const crud = await fetch(`${URL}/api/v1/educativeOffer`);        
        const response = await crud.json()
        console.log(response);        
        response.forEach(element => {
            nodePrueba.innerHTML += `<div>Profesor: ${element.profesor} - especialidad: ${element.especialidad}
             curso: ${element.curso} - Horas: ${element.horas}</div>`
        });

    } catch (error) {
        console.log("falla en el fetch", error)
    }
}

conexion(cloudServerURL);
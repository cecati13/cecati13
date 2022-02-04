const azureURL = "https://cecati13api.azurewebsites.net";
const cloudServerURL = "http://svo-5-191.servidoresvirtuales.mx";
const nodePrueba = document.getElementById("prueba");

async function conexion(URL) {
    try {
        const crud = await fetch(`${URL}/api/v1/products/`);        
        const response = await crud.json()
        console.log(response);        
        response.forEach(element => {
            nodePrueba.innerHTML += `<div>Nombre: ${element.name} - Precio: ${element.price}
             Departamento: ${element.departament} - URL Para imagen: ${element.image}</div>`
        });

    } catch (error) {
        console.log("falla en el fetch", error)
    }
}

conexion(cloudServerURL);
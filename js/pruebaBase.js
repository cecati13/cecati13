const URL = "https://sheets.googleapis.com/v4/spreadsheets/108FBMScjh_seZ284-T0cZgpW_OpdiU9iJNGlycV4aJU/values/Cursos!A:M?key=AIzaSyA1pfILJrar9ay5u1PoOWVuz4t8VhxA6jE"
const nodeAPI_Offer = document.getElementById("main");

async function conexion(URL) {
    try {
        const info = await fetch(`${URL}`);        
        const infoJSON = await info.json()
        const response = infoJSON.values;
        console.log(response);
        const container = document.createElement("div");
        container.className = `container__Specialties container__Specialties--HIDE`;
        container.id = "containerSpecialties";
        response.forEach(element => {
            container.innerHTML += `
            <div class="Specialties--containers">
                <p>Curso: ${element[0]}.</p>
                <p>Especialidad: ${element[1]}.</p>
                <p class="containerCourse--profesor">Profesor: ${element[8]}</p>
                <br>
                <p>Modalidad del curso: ${element[11]}.</p>
                <p>Horario: ${element[2]} a ${element[3]} hrs.</p>
                <p>El curso inicia el ${element[4]}, y finaliza el ${element[5]}.</p>
                <p>${element[9]} horas de duración.</p>
                <p>Dias de clase: ${element[6]}.</p>
                <p>Costo del curso: $${element[7]}</p>                
                <p>Observaciones: ${element[12]}</p>
                <br><br>
            </div>`
        });
        nodeAPI_Offer.appendChild(container);       
    } catch (error) {
        console.log(error)
    }
}

conexion(URL);
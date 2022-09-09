const nodeForm = document.getElementById('formInput');
const nodeInput = document.getElementById('prueba');
let file;
let file2;

async function sendForInscripcion(formData){    
    console.log(formData.get("estudios"))
    const endpoint = `http://svo-5-191.servidoresvirtuales.mx/files`
    //const endpoint = `http://localhost:3500/files`;
    //const endpoint = `http://localhost:3000/API/V1/students/newStudent/inscription`;
    const response = await fetch( endpoint, {
    method: "post",
    // headers: {
    //     "Content-Type": "multipart/form-data"
    //     "Content-Type": "application/json"
    // },
    //body: JSON.stringify(formData)


    //al subir archivos no usar headers especificando el tipo, y que el navegador determine el boundary adecuado
    //si vamos a subir archivos, se debe usar el formData, y no el json y quitar el headers
    body: formData
    })
    const info = await response.json()      
    console.log(info)    
}

nodeForm.addEventListener('submit', (e) => {
    //file = URL.createObjectURL(nodeInput.files[0])
    //file2 = URL.createObjectURL(e.target.children["prueba"].files[0])
    e.preventDefault()
    const nacimiento = e.target.children["nacimiento"].files[0]
    const domicilio = e.target.children["domicilio"].files[0]
    const estudios = e.target.children["estudios"].files[0]    
    const formData = new FormData()
    formData.append("curp", "VAND870419HDF")
    formData.append("actaNacimiento", nacimiento)
    formData.append("comprobanteDomicilio", domicilio)
    formData.append("comprobanteEstudios", estudios)

    // formData.append("fechaNacimiento", "19-04-1987")
    // formData.append("nombre", "DAmian")
    // formData.append("a_paterno", "valenzuela")
    // formData.append("a_materno", "negrete")
    const response = sendForInscripcion(formData)    
})
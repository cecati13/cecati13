const nodeForm = document.getElementById('formInput');

async function sendForInscripcion(formData){    
    console.log(formData.get("update"));
    //const endpoint = `http://svo-5-191.servidoresvirtuales.mx/files/updateFile`
    const endpoint = `http://localhost:3500/files/updateFile`;
    //const endpoint = `http://localhost:3000/API/V1/students/newStudent/inscription`;
    const response = await fetch( endpoint, {
    method: "post",

    body: formData
    })
    const info = await response.json()      
    console.log(info)    
}

nodeForm.addEventListener('submit', (e) => {    
    e.preventDefault()
    const update = e.target.children["update"].files[0]      
    const formData = new FormData()
    formData.append("update", update)    
    formData.append("a_paterno", "valenzuela")
    formData.append("a_materno", "negrete")
    sendForInscripcion(formData)      
})
const app = Vue.createApp({
    data(){
        return {
            API: "https://backend-cursos-cecati13.uc.r.appspot.com/API/v1",
            //API:"http://localhost:3000/API/v1",
            auth: false,
            //render: false,
            fileSource: ""
        }
    },

    methods: {
        async login(e) {
            e.preventDefault();
            const username = e.target.children.username.children.username.value;
            const password = e.target.children.password.children.password.value;
            const obj = {
                password: password,
                username: username
            };
            const endpoint = `${this.API}/controlStudents/oauth`;
            const response = await this.sendData(endpoint, obj);
            this.auth = response.access;

        },

        async findFile(e) {
            e.preventDefault();
            const form = document.querySelector(".formFile")
            const curp = form.elements.curp.value;
            const typeDocument = form.elements.typeDocument.value;
            const extension = form.elements.extension.value;
            const typeFile = this.typeFile(extension)
            const contentType = this.createContentType(typeFile);
            const obj = {
                curp,
                typeDocument,
                extension,
                contentType,
                typeFile
            }
            const endpoint = `${this.API}/controlStudents/getFile`;
            const res = await this.sendDataFile(endpoint, obj)            
            const fileURL = URL.createObjectURL(res);
            //this.render = true;
            this.fileSource = fileURL;
            window.open(this.fileSource, "_blank")
            // if (typeFile === "application/pdf") {                
            // }
        },

        async sendData(API, obj){
            try {
                const response = await fetch( API, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(obj)
                })
                return response.json();
              } catch (error) {
                console.log("sendData catch");
                console.error(error);
              }
        },

        async sendDataFile(API, obj){
            try {
                const response = await fetch( API, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(obj)
                })
                return response.blob()
              } catch (error) {
                console.log("sendData catch");
                console.error(error);
              }
        },
        
        createContentType(type) {            
            const obj = {
                "Content-Type": type                
            };
            return obj;
        },

        typeFile(extension) {
            let type = "";
            switch (extension) {
                case "jpg":
                    type = "image/jpg";
                    break;
                case "jpeg":
                    type = "image/jpeg";
                    break;
                case "png":
                    type = "image/png";
                    break;
                default: //pdf
                    type = "application/pdf";
                    break;
                }
            return type;
        },

        showRender(){

        },
    },

    template: `
    <h3>Exclusivo del área de control escolar</h3>
    <form         
        v-on:submit="login"
        v-if=!auth
    >
        <label name="username"> Usuario
            <input type="text" name="username">
        </label>
        <label name="password"> Contraseña
            <input type="password" name="password">
        </label>
        <button>Enviar</button>
    </form>
    <form 
        v-if=auth
        v-on:submit="findFile"
        class="formFile"
    >
        <label for="curp">CURP</label>
        <input type="¿Cual es la CURP?" name="curp" id="">
        <label for="">Selecciona el Tipo de Archivo</label>
        <select name="typeDocument">
            <option value="actaNacimiento">Acta de Nacimiento</option>
            <option value="comprobanteDomicilio">Domicilio</option>
            <option value="comprobanteEstudios">Grado de Estudios</option>
        </select>
        <label for="">Seleciona el tipo de archivo</label>
        <select name="extension">
            <option value="jpg">jpg</option>
            <option value="jpeg">jpeg</option>
            <option value="pdf">pdf</option>
            <option value="png">png</option>
        </select>
        <button>Enviar</button>
    </form>
    `
    // <div v-if=render width="500px">
    //     <img
    //         width="100%"
    //         v-bind:src=fileSource
    //         alt="documento"
    //     >
    // </div>    
})

const vm = app.mount("#app");
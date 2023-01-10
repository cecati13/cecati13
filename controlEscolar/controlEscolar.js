const app = Vue.createApp({
    data(){
        return {
            API: "https://backend-cursos-cecati13.uc.r.appspot.com/API/v1/controlStudents",
            //API:"http://localhost:3000/API/v1/controlStudents",
            auth: false,
            fileSource: "",
            username: "",
            message: ""
        }
    },

    methods: {
        async login(e) {
            e.preventDefault();
            const username = e.target.children.username.value;
            const password = e.target.children.password.value;
            const obj = {
                password: password,
                username: username
            };
            const endpoint = `${this.API}/oauth`;
            const response = await this.sendData(endpoint, obj);            
            if (response.token) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("username", response.username)
                this.username = response.username;
                this.auth = true;
                this.clearMessage();
            } else {
                this.message = response.message;
                //this.message = "Acceso NO autorizado."
            }
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
            const endpoint = `${this.API}/getFile`;
            const res = await this.sendData(endpoint, obj)
            if (res.error) {
                this.message = res.error;
            } else{
                //convert base64 to file
                const base64Response = await fetch(`data:${typeFile};base64,${res.file}`);
                const blob = await base64Response.blob();
                const fileURL = URL.createObjectURL(blob);
                this.fileSource = fileURL;
                this.clearMessage();
                window.open(this.fileSource, "_blank")
            }
        },

        async sendData(API, obj){
            try {
                const objHeaders = { "Content-Type": "application/json" }                
                if (!obj.username) {
                    Object.defineProperty(objHeaders, "Authorization",{
                        value: `Bearer ${localStorage.getItem("token")}`,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    })
                }
                const response = await fetch( API, {
                  method: "POST",
                  headers: objHeaders,
                  body: JSON.stringify(obj)
                })
                return response.json();
              } catch (error) {                
                console.error(error);
              }
        },

        async sendFiles(formFiles, API){
            const response = await fetch( API, {
              method: "post",
              headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
              },
              //si vamos a subir archivos, se debe usar el formData, y no el json y quitar el headers
              body: formFiles
            })
            const info = await response.json();
            console.log("regresando de files: ", info)
            return info
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

        clearMessage() {
            this.message = "";
        },

        async uploadFileFI(file){
            const formFiles = new FormData;
            formFiles.append("fileFI", file)
            const enpoint = `${this.API}/fileInformation`
            console.log("uploadFileFI", formFiles)
            const res = await this.sendFiles(formFiles, enpoint)
            console.log(res)
        },
    },

    template: `
    <h3>Exclusivo del área de control escolar</h3>
    <form         
        v-on:submit="login"
        v-if=!auth
    >
        <label for="username"> 
            Usuario
        </label>
        <input 
            type="text"
            name="username" 
            v-on:focus="clearMessage"
        >
        <label for="password"> 
            Contraseña
        </label>
        <input 
            type="password" 
            name="password" 
            v-on:focus="clearMessage"
        >
        <button>Iniciar Sesión</button>
        <p class="message">{{ message }}</p>
    </form>

    <p v-if=auth>
        Bienvenido {{ username.toUpperCase() }} 
    </p>

    <form 
        v-if=auth
        v-on:submit="findFile"
        class="formFile"
    >
        <label for="curp">CURP</label>
        <input name="curp" v-on:focus="clearMessage">
        <label for="typeDocument">Selecciona el Tipo de Archivo</label>
        <select name="typeDocument" v-on:focus="clearMessage">
            <option value="actaNacimiento">Acta de Nacimiento</option>
            <option value="comprobanteDomicilio">Domicilio</option>
            <option value="comprobanteEstudios">Grado de Estudios</option>
        </select>
        <label for="extension">Seleciona el tipo de archivo</label>
        <select name="extension" v-on:focus="clearMessage">
            <option value="jpg">jpg</option>
            <option value="jpeg">jpeg</option>
            <option value="pdf">pdf</option>
            <option value="png">png</option>
        </select>
        <button>Enviar</button>
        <p class="message">{{ message }}</p>
    </form>

    <v-uploadFile
        v-if=auth
        v-on:fileInformation="uploadFileFI"
    >
    `      
})

app.component("v-findFileStudent", {
    template: `
    <form 
        v-if=auth
        v-on:submit="findFile"
        class="formFile"
    >
        <label for="curp">CURP</label>
        <input name="curp" v-on:focus="clearMessage">
        <label for="typeDocument">Selecciona el Tipo de Archivo</label>
        <select name="typeDocument" v-on:focus="clearMessage">
            <option value="actaNacimiento">Acta de Nacimiento</option>
            <option value="comprobanteDomicilio">Domicilio</option>
            <option value="comprobanteEstudios">Grado de Estudios</option>
        </select>
        <label for="extension">Seleciona el tipo de archivo</label>
        <select name="extension" v-on:focus="clearMessage">
            <option value="jpg">jpg</option>
            <option value="jpeg">jpeg</option>
            <option value="pdf">pdf</option>
            <option value="png">png</option>
        </select>
        <button>Enviar</button>
        <p class="message">{{ message }}</p>
    </form>
    `
})

app.component("v-uploadFile", {
    methods: {
        uploadFI(e) {
            e.preventDefault();            
            const file = e.target.fileInformation.files[0];
            this.$emit("fileInformation", file)
        }
    }, 

    template: `
    <form v-on:submit="uploadFI">
        <label>Subir Ficha de información de Curso</label>
        <input
            type="file"
            name="fileInformation"
            accept=".pdf"
        >
        <button>Subir</button>
    </form>
    `
})

app.component("v-information", {
    template: `
    <v-datosGenerales></v-datosGenerales>
    <v-domicilio></v-domicilio>
    <v-contacto></v-contacto>
    <v-curso></v-curso>
    `
})

app.component("v-datosGenerales", {

})

app.component("v-domicilio",{

})

app.component("v-contacto", {
    
})

app.component("v-curso", {

})

const vm = app.mount("#app");
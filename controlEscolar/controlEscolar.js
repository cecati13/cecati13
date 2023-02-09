const app = Vue.createApp({
    data(){
        return {
            //API: "https://backend-cursos-cecati13.uc.r.appspot.com/API/v1/controlStudents",
            API:"http://localhost:3000/API/v1/controlStudents",
            auth: false,
            optionPiecesInformation: false,
            optionFindFiles: false,
            fileSource: "",
            username: "",
            message: "",
            messageFI: false,
            inputCurp: true,
            listButton: true,
            arrayForBlobs: [],
            buttonsBlobs: false,
            listInCloud: false
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

        showFunctionSite(obj){
            this.optionPiecesInformation = obj.fInformation;
            this.optionFindFiles = obj.files;
        },
        
        ShowMenu(){
            this.optionPiecesInformation = false;
            this.optionFindFiles = false;
            this.listInCloud = false;
            this.listButton = true;
            this.clearMessage();            
        },

        async findFilesCURP(e) {
            e.preventDefault();
            while(this.arrayForBlobs.length > 0) {
                this.arrayForBlobs.pop()
            }
            const curp = e.target.curp.value;
            const endpoint = `${this.API}/listBlobs/comprobantes?user=${curp}`;
            const res = await this.getData(endpoint)
            console.log(res.message)
            if (res.status === 404){
                this.arrayForBlobs.push({ name: "NO existe, Revisa Archivos fisicos" })
            }
            if (res.message.length > 1) {
                this.arrayForBlobs.push(...res.message);
                this.buttonsBlobs = true;
                this.inputCurp = false;
            }
        },
            
        async findFile(e){
                e.preventDefault();
                const file = e.target.textContent;                
                const arrayTypeFile = file.split(".");
                const typeFile = this.typeFile(arrayTypeFile[1]);                
                const endpoint = `${this.API}/file/${file}`;                
                //return of endpoint: /file
                const res = await this.getData(endpoint)
                //convert base64 to file
                const base64Response = await fetch(`data:${typeFile};base64,${res.file}`);
                const blob = await base64Response.blob();
                const fileURL = URL.createObjectURL(blob);
                this.fileSource = fileURL;
                this.clearMessage();
                window.open(this.fileSource, "_blank")
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

        async getData(API){
            try {
                const objHeaders = { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                };
                const response = await fetch( API, {                  
                  headers: objHeaders,                  
                })
                if (response.status === 404) {
                    return response;
                }
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
            const messageInfCloud = document.querySelector(".piecesInformationCloud");
            messageInfCloud.innerHTML = "";
            this.cleanArrays();
        },

        async generateList (container) {
            const endpoint = `${this.API}/listBlobs/${container}`;
            const res = await this.getData(endpoint);
            console.log(res.message);
            const totalList = res.message.length;
            this.message = `El sistema tiene ${totalList} fichas de información disponibles`;
            this.messageFI = true;
            this.listInCloud = true;
            this.listOfInformation(res.message);
            this.listButton = false;
            
        },

        listOfInformation(array){
            const container = document.querySelector(".piecesInformationCloud");
            const arrayContainer = [];
            array.forEach( item => {
                const p1 = document.createElement("p");
                p1.innerHTML = `Archivo: <span>${item.name}</span> `;
                p1.dataset.url = item.url;
                p1.addEventListener("click", this.showPDF);
                arrayContainer.push(p1);
            })
            container.append(...arrayContainer);
        },

        showPDF(e){
            e.preventDefault();            
            const elementURL = e.target.dataset.url;
            window.open(elementURL, "_blank")            
        },

        async uploadFileFI(arrayFiles){
            const formFiles = new FormData;
            arrayFiles.forEach( file => {
                formFiles.append("fileFI", file);
            })
            const enpoint = `${this.API}/fileInformation`
            console.log("uploadFileFI", formFiles)
            const res = await this.sendFiles(formFiles, enpoint)
            this.messageFI = true;
            const container = this.showUrlMessageUpload(res.message);
            const node = document.querySelector(".showURLMessage");
            node.append(...container);
            this.listButton = true;
        },
        
        showUrlMessageUpload(array){
            const arrayContainer = [];
            array.forEach( url => {
                const p = document.createElement("p");
                p.innerText = url;
                arrayContainer.push(p);
            });
            return arrayContainer;
        },

        cleanArrays(){
            while (this.arrayForBlobs.length > 0) {
                this.arrayForBlobs.pop();
            }
        }
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

    <v-buttonBack
        v-if=auth&&(optionFindFiles||optionPiecesInformation)
        v-on:click="ShowMenu"
    ></v-buttonBack>

    <v-selectOption
        v-if=auth&&!optionPiecesInformation&&!optionFindFiles
        v-on:selectedFunction="showFunctionSite"
    ></v-selectOption>


    <form 
        v-if=auth&&optionFindFiles
        v-on:submit="findFilesCURP"
        class="formFile"
    >
        <label for="curp">CURP</label>
        <input name="curp">
        
        <button>Enviar</button>
        <p class="message">{{ message }}</p>
    </form>

    <div v-if=optionFindFiles&&buttonsBlobs>
        <div 
            v-for="blob in arrayForBlobs"
            @click="findFile"
            class="blobs--button"
        > {{ blob.name }}</div>
    </div>

    <v-uploadFile
        v-if=auth&&optionPiecesInformation
        v-on:fileInformation="uploadFileFI"
    ></v-uploadFile>

    
    <v-availableFI 
        v-if=auth&&listButton&&optionPiecesInformation
        v-on:listFI="generateList"
    ></v-availableFI>
    
    <v-linkFI
        v-if=messageFI&&optionPiecesInformation&&listInCloud
    >
    </v-linkFI>

    <div 
        v-if=auth
        class="piecesInformationCloud"
    ></div>
    
    `      
})

app.component("v-selectOption", {
    data() {
        return {
            option: {
                files: false,
                fInformation: false
            }
        }
    },
    methods: {
        findFile(){
            this.option.files = true;
            this.option.fInformation = false;
            this.$emit("selectedFunction", this.option)
        },
        
        piecesInformation(){
            this.option.fInformation = true;
            this.option.files = false;
            this.$emit("selectedFunction", this.option)
        }
    },

    template: `
    <p>Selecciona las funciones del sitio que deseas utilizar:</p>
    <div v-on:click="findFile">
        <button>Buscar comprobantes</button>
    </div>
    <div v-on:click="piecesInformation">
        <button>Fichas de información</button>
    </div>
    `
})

app.component("v-buttonBack", {
    template:`
    <div class="buttonBack buttonBack--HIDE">
        <img src="https://storage.googleapis.com/cecati13/assets/arrowBack.svg" alt="Retroceder">
        <span>REGRESAR</span>
    </div>
    `
});

app.component("v-uploadFile", {
    data(){
        return {
            arrayFilesNames : [],
            arrayFilesUpload: [],
            filesShow : false
        }
    },

    methods: {
        uploadFI(e) {
            e.preventDefault();
            const totalFiles = e.target.fileInformation.files.length;
            for (let i = 0; i < totalFiles; i++) {
                const file = e.target.fileInformation.files[i];
                this.arrayFilesUpload.push(file);
            }            
            this.$emit("fileInformation", this.arrayFilesUpload);
            this.cleanArrays();
            document.getElementById("inputFiles").value = "";
        },

        selectedFiles(e){
            this.cleanArrays();
            const totalFiles = e.target.files.length;
            let index = 0;
            while (index < totalFiles) {
                const fileName = e.target.files[index].name;
                this.arrayFilesNames.push(fileName);
                index++;
            }
            this.filesShow = this.arrayFilesNames.length > 0 ? true : false;
        },

        cleanArrays(){
            while (this.arrayFilesNames.length > 0) {
                this.arrayFilesNames.pop();
                this.arrayFilesUpload.pop();
            }
        }
    },

    template: `
    <form v-on:submit="uploadFI">
        <label>Subir Fichas de información de Cursos. Arrastra los archivos al espacio inferior:</label>
        <input
            type="file"
            name="fileInformation"
            id="inputFiles"
            accept=".pdf"
            multiple
            @input="selectedFiles"
        >
        <p Archivos v-if="filesShow"> {{ arrayFilesNames.length }} Archivos seleccionados:</p>
        <p v-for="item in arrayFilesNames" :key="item"> {{ item }} </p>
        <button>Generar URL</button>
    </form>
    `
})

app.component("v-linkFI", {
    template: `
    <p>Archivos disponible en la nube.</p>
    <div class="showURLMessage"></div>
    `
})

app.component("v-availableFI", {
    methods: {
        availableFI(e){
            e.preventDefault();
            const container = "informacion";
            this.$emit("listFI", container)
        }
    },

    template: `
    <p></p>
    <form v-on:submit="availableFI">
        <button>Fichas de Información disponibles.</button>
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
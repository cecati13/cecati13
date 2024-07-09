import { vAvailableFI, vButtonBack, vSelectOption, vTableUsers, vUploadFile } from "./components/index.js";
import { IconEdit } from "./components/icons/IconEdit.js";
import { vUsers } from "./pages/index.js"
import { roles } from "./models/roles.js";

const app = Vue.createApp({
    data() {
        return {
            //API: "https://backend-cursos-cecati13.uc.r.appspot.com/API/v1/controlStudents",
            API: "http://localhost:3000/API/v1/controlStudents",
            auth: false,
            optionPiecesInformation: false,
            optionFindFiles: false,
            optionListUsers: false,
            fileSource: "",
            username: "",
            email: "",
            permissions: {
                role: roles.notFunctions,
            },
            message: "",
            messageFI: false,
            inputCurp: true,
            listButton: true,
            arrayForBlobs: [],
            arrayForLinksFI: [],
            buttonsBlobs: false,
            listInCloud: false,
            uploadPiecesInformation: true,
            loading: true,
            thereAreSesion: this.areThereSession,
        }
    },

    provide() {
        return {
            permissions: this.permissions,
        }
    },

    mounted() {
        this.areThereSession()
    },

    methods: {
        async areThereSession() {
            try {
                areSessionRedirect();
                const accessToken = await this.getToken();
                if (accessToken === null) {
                    signIn();
                    return
                }
                const endpoint = this.API + "/oauth";
                const response = await this.callApi(
                    'GET',
                    endpoint,
                    accessToken
                );
                console.log(await response);
                if (response.token) {
                    console.log(await response.token);
                    localStorage.setItem("token", response.token);
                    localStorage.setItem("username", response.username)
                    this.username = response.username;
                    this.email = response.email;
                    this.permissions.role = this.assignRoleFunctions(response.role);
                    this.auth = true;
                    this.clearMessage();
                    this.preloader();
                } else {
                    this.message = response.message
                }
            } catch (error) {
                console.log(error);
            }
        },

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
                this.preloader();
                this.clearMessage();
            } else {
                this.message = response.message
            }
        },

        closeSession() {
            this.auth = false;
            localStorage.removeItem("token");
            document.cookie = "token_jwt=null";
            signOut();
        },

        showFunctionSite(obj) {
            if (obj.closed) {
                this.closeSession();
            }
            this.optionPiecesInformation = obj.fInformation;
            this.optionFindFiles = obj.files;
            this.optionListUsers = obj.adminUsers;
        },

        ShowMenu() {
            this.optionPiecesInformation = false;
            this.optionFindFiles = false;
            this.optionListUsers = false;
            this.listInCloud = false;
            this.listButton = true;
            this.uploadPiecesInformation = true;
            this.clearMessage();
            this.cleanArrays();
        },

        async findFilesCURP(e) {
            e.preventDefault();
            while (this.arrayForBlobs.length > 0) {
                this.arrayForBlobs.pop()
            }
            const curp = e.target.curp.value;
            const endpoint = `${this.API}/listBlobs/comprobantes?user=${curp}`;
            const res = await this.getData(endpoint)
            if (res.status === 404) {
                //this.arrayForBlobs.push({ name: "NO existe, Revisa Archivos fisicos" })
                this.message = "NO ENCONTRADO. Revisa Archivos fisicos"
            }
            if (res.message.length > 1) {
                this.arrayForBlobs.push(...res.message);
                this.message = "";
                this.buttonsBlobs = true;
                this.inputCurp = false;
            }
        },

        async findFile(e) {
            e.preventDefault();
            const file = e.target.textContent;
            const arrayTypeFile = file.split(".");
            const typeFile = this.typeFile(arrayTypeFile[1]);
            const endpoint = `${this.API}/file/${file}`;
            //return of endpoint: /file
            const res = await this.getData(endpoint)
            const base64Response = await fetch(`data:${typeFile};base64,${res.file}`);
            const blob = await base64Response.blob();
            const fileURL = URL.createObjectURL(blob);
            this.fileSource = fileURL;
            this.clearMessage();
            window.open(this.fileSource, "_blank");
        },

        async sendData(API, obj) {
            try {
                this.preloader();
                const objHeaders = { "Content-Type": "application/json" }
                if (!obj.username) {
                    Object.defineProperty(objHeaders, "Authorization", {
                        value: `Bearer ${localStorage.getItem("token")}`,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                }
                const response = await fetch(API, {
                    method: "POST",
                    headers: objHeaders,
                    body: JSON.stringify(obj)
                });
                this.preloader();
                return response.json();
            } catch (error) {
                console.error(error)
            }
        },

        async getData(API) {
            try {
                this.preloader();
                const objHeaders = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                };
                const response = await fetch(API, {
                    headers: objHeaders,
                })
                if (response.status === 404) {
                    this.preloader();
                    return response;
                }
                this.preloader();
                return response.json();
            } catch (error) {
                this.preloader();
                console.error(error);
            }
        },

        async sendFiles(formFiles, API) {
            this.preloader();
            const response = await fetch(API, {
                method: "post",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: formFiles
            })
            const info = await response.json();
            this.preloader();
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
            if (!(messageInfCloud === null)) {
                messageInfCloud.innerHTML = "";
            }
        },

        async generateList(container) {
            const endpoint = `${this.API}/listBlobs/${container}`;
            const res = await this.getData(endpoint);
            const totalList = res.message.length;
            this.message = `El sistema tiene ${totalList} fichas de información disponibles`;
            this.messageFI = true;
            this.listInCloud = true;
            this.listOfInformation(res.message);
            this.listButton = false;
            this.uploadPiecesInformation = false;

        },

        listOfInformation(array) {
            const container = document.querySelector(".piecesInformationCloud");
            const arrayContainer = [];
            array.forEach(item => {
                const p1 = document.createElement("li");
                p1.innerHTML = ` 
                    <span 
                        data-url="${item.url}">
                    ${item.name}
                    </span> `;
                p1.dataset.url = item.url;
                p1.addEventListener("click", this.showPDF);
                arrayContainer.push(p1);
            })
            container.append(...arrayContainer);
        },

        showPDF(e) {
            e.preventDefault();
            const elementURL = e.target.dataset.url;
            window.open(elementURL, "_blank");
        },

        async uploadFileFI(arrayFiles) {
            const formFiles = new FormData;
            arrayFiles.forEach(file => {
                formFiles.append("fileFI", file);
            })
            const enpoint = `${this.API}/fileInformation`;
            const res = await this.sendFiles(formFiles, enpoint);
            this.messageFI = true;
            this.showUrlMessageUpload(res.message);
            this.listButton = true;
        },

        showUrlMessageUpload(array) {
            array.forEach(url => {
                this.arrayForLinksFI.push(url);
            });
        },

        cleanArrays() {
            while (this.arrayForBlobs.length > 0) {
                this.arrayForBlobs.pop();
            }
            while (this.arrayForLinksFI.length > 0) {
                this.arrayForLinksFI.pop();
            }
        },

        assignRoleFunctions(role) {
            if (String(role) === String(roles.admin)) {
                return roles.admin;
            } else if (String(role) === String(roles.user)) {
                return roles.user;
            } else {
                return roles.notFunctions;
            }
        },

        preloader() {
            this.loading = !this.loading;
        },

        async getToken() {
            let tokenResponse;
            console.log("GET_TOKEN!");
            if (typeof getTokenPopup === 'function') {
                console.log("if typeof getTokenPopup", getTokenPopup);
                tokenResponse = await getTokenPopup({
                    scopes: [],
                    redirectUri: '/redirect'
                });
            } else {
                console.log("else typeof getTokenPopup");
                tokenResponse = await this.getTokenRedirect({
                    scopes: ["User.Read"],
                });
            }

            if (!tokenResponse) {
                return null;
            }
            return tokenResponse.accessToken;
        },

        async callApi(method, endpoint, token, data = null) {
            console.log("-----callApi----", token)
            const headers = new Headers();
            const bearer = `Bearer ${token}`;

            headers.append('Authorization', bearer);

            if (data) {
                headers.append('Content-Type', 'application/json');
            }

            const options = {
                method: method,
                headers: headers,
                body: data ? JSON.stringify(data) : null,
                credentials: "include"
            };

            const response = await fetch(endpoint, options);
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            } else {
                return response;
            }
        },

        getTokenRedirect(request) {
            /**
             * See here for more info on account retrieval:
             * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
             */
            console.log("getTokenRedirect. MI param request: ", request);
            request.account = myMSALObj.getAccountByUsername(username);
            return myMSALObj.acquireTokenSilent(request).catch((error) => {
                console.error(error);
                console.warn('silent token acquisition fails. acquiring token using popup');
                if (error instanceof msal.InteractionRequiredAuthError) {
                    // fallback to interaction when silent call fails
                    return myMSALObj.acquireTokenRedirect(request);
                } else {
                    console.error(error);
                }
            });
        },

    },

    template: `
    <h3>Exclusivo del área de control escolar</h3>

    <div  
        v-if=loading
        v-bind:class="['preloader']"
    ></div>

    <section v-if=!loading>

        <p v-if=auth>
            Bienvenido {{ username.toUpperCase() }} 
        </p>
        <p v-if=auth>
            {{ email }} 
        </p>

        <v-buttonBack
            v-if=auth&&(optionFindFiles||optionPiecesInformation||optionListUsers)
            v-on:click="ShowMenu"
        ></v-buttonBack>

        <p
            class="message"
        >
            {{ message }}
        </p>

        <v-selectOption
            v-if=auth&&!optionPiecesInformation&&!optionFindFiles&&!optionListUsers
            v-on:selectedFunction="showFunctionSite"
        ></v-selectOption>


        <form 
            v-if=auth&&optionFindFiles
            v-on:submit="findFilesCURP"
            class="formFile"
        >
            <h4>Buscar comprobantes...</h4>
            <label for="curp">CURP</label>
            <input 
                name="curp"
                onkeyup="javascript:this.value=this.value.toUpperCase();"
            >
            
            <button>Enviar</button>
        </form>

        <div v-if=optionFindFiles&&buttonsBlobs>
            <div 
                v-for="blob in arrayForBlobs"
                @click="findFile"
                class="blobs--button"
            > {{ blob.name }}</div>
        </div>

        <v-uploadFile
            v-if=auth&&optionPiecesInformation&&uploadPiecesInformation
            v-on:fileInformation="uploadFileFI"
        ></v-uploadFile>

        <div 
            v-if=auth&&optionPiecesInformation&&uploadPiecesInformation
            class="uploadFiles"
        >
            <p 
                v-for="link in arrayForLinksFI"
            >
                {{ link }}
            </p>
        </div>

        
        <v-availableFI 
            v-if=auth&&listButton&&optionPiecesInformation
            v-on:listFI="generateList"
        ></v-availableFI>

        <v-users 
            v-if=auth&&optionListUsers>

        </v-users>
        
        <ol 
            v-if=auth
            class="piecesInformationCloud"
        ></ol>
    </section>
    `
});

app.component("v-selectOption", vSelectOption);
app.component("v-buttonBack", vButtonBack);
app.component("v-uploadFile", vUploadFile);
app.component("v-availableFI", vAvailableFI);
app.component("v-tableUsers", vTableUsers);
app.component("v-users", vUsers);
app.component("IconEdit", IconEdit);

app.mount("#app");
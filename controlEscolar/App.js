import { roles } from "./models/roles.js";
import { callApi, getToken } from "./service/login.js";
import { getData } from "./service/api.js";
const host = base.getFunctionsAPI();

export const App = {
  data() {
    return {
      API: host + "/controlStudents",
      auth: false,
      optionPiecesInformation: false,
      optionFindFiles: false,
      optionListUsers: false,
      fileSource: "",
      username: "",
      email: "",
      permissions: {
        role: roles.notFunctions,
        users: [],
      },
      message: "",
      messageFI: false,
      inputCurp: true,
      listButton: true,
      arrayForBlobs: [],
      arrayForLinksFI: [],
      arrayPiecesInfCloud: [],
      listInCloud: false,
      uploadPiecesInformation: true,
      loading: true,
      thereAreSesion: this.areThereSession,
    };
  },

  provide() {
    return {
      permissions: this.permissions,
    };
  },

  mounted() {
    this.areThereSession();
  },

  methods: {
    async areThereSession() {
      try {
        areSessionRedirect();
        const accessToken = await getToken();
        if (accessToken === null) {
          signIn();
          return;
        }
        const endpoint = this.API + "/oauth";
        const response = await callApi("GET", endpoint, accessToken);
        if (response.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("username", response.username);
          this.username = response.username;
          this.email = response.email;
          this.permissions.role = this.assignRoleFunctions(response.role);
          this.auth = true;
          this.clearMessage();
          this.preloader();
        } else {
          this.message = response.message;
        }
      } catch (error) {
        console.log(error);
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
      if (obj.adminUsers) {
        this.optionListUsers = obj.adminUsers;
        this.getUsers();
      }
      this.optionPiecesInformation = obj.fInformation;
      this.optionFindFiles = obj.files;
    },

    async getUsers() {
      this.preloader();
      const endpoint = `${this.API}/users`;
      const res = await getData(endpoint);
      this.permissions.users = [...res];
      this.preloader();
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

    async findFileCURP(e) {
      e.preventDefault();
      this.preloader();
      const curp = e.target.curp.value;
      const typeDoc = e.target.typeDoc.value;
      const endpoint = `${this.API}/file/${curp}?type=${typeDoc}`;
      const res = await getData(endpoint);
      const type = this.typeFile(res.typeFile);
      console.log(res);
      const base64Response = await fetch(
        `data:${type};base64,${res.file.file}`
      );
      const blob = await base64Response.blob();
      const fileURL = URL.createObjectURL(blob);
      this.fileSource = fileURL;
      this.clearMessage();
      this.preloader();
      window.open(this.fileSource, "_blank");
    },

    async sendFiles(formFiles, API) {
      this.preloader();
      const response = await fetch(API, {
        method: "post",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formFiles,
      });
      const info = await response.json();
      this.preloader();
      return info;
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
      this.preloader();
      const endpoint = `${this.API}/listBlobs/${container}`;
      const res = await getData(endpoint);
      const totalList = res.message.length;
      this.message = `El sistema tiene ${totalList} fichas de información disponibles`;
      this.messageFI = true;
      this.listInCloud = true;
      res.message.forEach((item) => {
        this.arrayPiecesInfCloud.push(item);
      });
      this.listButton = false;
      this.uploadPiecesInformation = false;
      this.preloader();
    },

    async uploadFileFI(arrayFiles) {
      const formFiles = new FormData();
      arrayFiles.forEach((file) => {
        formFiles.append("fileFI", file);
      });
      const enpoint = `${this.API}/fileInformation`;
      const res = await this.sendFiles(formFiles, enpoint);
      this.messageFI = true;
      this.showUrlMessageUpload(res.message);
      this.listButton = true;
    },

    showUrlMessageUpload(array) {
      array.forEach((url) => {
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
      while (this.arrayPiecesInfCloud.length > 0) {
        this.arrayPiecesInfCloud.pop();
      }
    },

    assignRoleFunctions(role) {
      if (
        String(role) === String(roles.admin) ||
        String(role) === String(roles.sAdmin)
      ) {
        return roles.admin;
      } else if (String(role) === String(roles.user)) {
        return roles.user;
      } else {
        return roles.notFunctions;
      }
    },

    async updateRoleSend(params) {
      this.preloader();
      const endpoint = `${this.API}/updateRole/${params}`;
      const res = await getData(endpoint, "PUT");
      this.preloader();
      if (res.statusCode === 405) {
        this.message = res.message;
      }
      if (res.update) {
        this.ShowMenu();
      }
    },

    preloader() {
      this.loading = !this.loading;
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

         <v-users 
            v-if=auth&&optionListUsers
            v-on:updateRole="updateRoleSend"
        />   

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
            v-on:submit="findFileCURP"
            class="formFile"
        >
            <h4>Buscar comprobante.</h4>
            <label for="typeDoc">
                Selecciona el tipo de documento:
            </label>
            <select name="typeDoc" id="typeDocumentSelected">
                <option value="nacimiento">Acta de Nacimiento</option>
                <option value="estudios">Comprobante de Estudios</option>
                <option value="domicilio">Comprobante de Domicilio</option>
            </select>
            <label for="curp">CURP</label>
            <input 
                name="curp"
                onkeyup="javascript:this.value=this.value.toUpperCase();"
            >
            
            <button>Enviar</button>
        </form>     

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

       <ol 
            v-if=auth
            class="piecesInformationCloud"
        >
            <li v-for="item in arrayPiecesInfCloud">
                <a :href="item.url" target="blank">
                    {{ item.name }}
                </a>    
            </li>
        </ol>
    </section>
    `,
};

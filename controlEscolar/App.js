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
      optionGetDB: false,
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
      listArrays: {
        arrayForBlobs: [],
        arrayForLinksFI: [],
        arrayPiecesInfCloud: [],
        linksFI: [],
      },
      loading: true,
      thereAreSesion: this.areThereSession,
    };
  },

  provide() {
    return {
      permissions: this.permissions,
      API: this.API,
      piecesInformation: this.listArrays,
      loader: () => this.preloader()
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
        } else if (response.statusCode === 500 || response.statusCode === 503) {
          throw new Error("Error de Conexión. Intenta iniciar de nuevo")
        } else {
          this.message = response.message;
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "Cerrar",
        });
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
      this.optionGetDB = obj.getDB;
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
      this.optionGetDB = false;
      this.listInCloud = false;
      this.clearMessage();
      this.cleanArrays();
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

    clearMessage() {
      this.message = "";
      const messageInfCloud = document.querySelector(".piecesInformationCloud");
      if (!(messageInfCloud === null)) {
        messageInfCloud.innerHTML = "";
      }
    },    

    showUrlMessageUpload(array) {
      array.forEach((url) => {
        this.listArrays.arrayForLinksFI.push(url);
      });
    },

    cleanArrays() {
      while (this.listArrays.arrayForBlobs.length > 0) {
        this.listArrays.arrayForBlobs.pop();
      }
      while (this.listArrays.arrayForLinksFI.length > 0) {
        this.listArrays.arrayForLinksFI.pop();
      }
      while (this.listArrays.arrayPiecesInfCloud.length > 0) {
        this.listArrays.arrayPiecesInfCloud.pop();
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

  <div>
    <h3>Exclusivo del área de control escolar</h3>

    <div  
        v-if=loading
        v-bind:class="['preloader']"
    ></div>

    <div v-if=!loading class="section-responsive">

        <p v-if=auth>
            Bienvenido {{ username.toUpperCase() }} 
        </p>
        <p v-if=auth>
            {{ email }}
        </p>

        <v-buttonBack
            v-if=auth&&(optionFindFiles||optionPiecesInformation||optionListUsers||optionGetDB)
            v-on:click="ShowMenu"
        ></v-buttonBack>

        
        <p class="message">
        {{ message }}
        </p>
        
        <v-selectOption
        v-if=auth&&!optionPiecesInformation&&!optionFindFiles&&!optionListUsers&&!optionGetDB
        v-on:selectedFunction="showFunctionSite"
        ></v-selectOption>
        
        <v-users 
           v-if=auth&&optionListUsers
           v-on:updateRole="updateRoleSend"
       />

        <v-getDB
          v-if=auth&&optionGetDB
        />

        <v-findFile 
          v-if=auth&&optionFindFiles
        />

       <v-informationFiles 
        v-if=auth&&optionPiecesInformation
       />

      
        
    </div>
    </div>
    `,
};

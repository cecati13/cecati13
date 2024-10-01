import { roles } from "../models/roles.js";

export const vSelectOption = {
  inject: ["permissions"],

  data() {
    return {
      option: {
        files: false,
        fInformation: false,
        adminUsers: false,
        getDB: false,
        closed: false,
      },
      accessAdmin: this.isAdmin(),
      doHaveAccess: this.isAccess(),
    };
  },

  methods: {
    setOptionsFalse() {
      this.option.files = false;
      this.option.fInformation = false;
      this.option.adminUsers = false;
      this.option.closed = false;
    },

    findFile() {
      this.setOptionsFalse();
      this.option.files = true;
      this.$emit("selectedFunction", this.option);
    },

    piecesInformation() {
      this.setOptionsFalse();
      this.option.fInformation = true;
      this.$emit("selectedFunction", this.option);
    },

    adminUsers() {
      this.setOptionsFalse();
      this.option.adminUsers = true;
      this.$emit("selectedFunction", this.option);
    },

    getDB() {
      this.setOptionsFalse();
      this.option.getDB = true;
      this.$emit("selectedFunction", this.option);
    },

    isAdmin() {
      return String(this.permissions.role) === String(roles.admin);
      //|| String(this.permissions.role) === String(roles.sAdmin);
    },

    isAccess() {
      return String(this.permissions.role) !== String(roles.notFunctions);
    },

    closeSession() {
      this.setOptionsFalse();
      this.option.closed = true;
      this.$emit("selectedFunction", this.option);
    },
  },

  template: `
    <p v-if=doHaveAccess>
        Selecciona las funciones del sitio que deseas utilizar:
    </p>

    <div v-if=!doHaveAccess>
        <h3>No tienes ninguna función asignada.</h3>
        <p>Si crees que debes tener acceso a alguna funcionalidad del sitio, solicitala a algún directivo.</p>
    </div>

    <div 
        v-if=doHaveAccess
        v-on:click="findFile" 
        class="functionOption"
    >
        <button>Buscar comprobantes</button>
    </div>
    
    <div 
        v-if=doHaveAccess
        v-on:click="piecesInformation"
        class="functionOption"
    >
        <button>Fichas de información</button>
    </div>

    <div 
        v-if=doHaveAccess
        v-on:click="getDB" 
        class="functionOption"
    >
        <button>Consultar registros en Base de Datos</button>
    </div>
    
    <div 
        v-if=accessAdmin
        v-on:click="adminUsers" 
        class="functionOption"
    >
        <button>Administración de Usuarios</button>
    </div>    

    <div
        v-on:click="closeSession" 
        class="functionOption"
    >
        <button class="closeSession">Cerrar Sesión</button>
    </div>
    `,
};

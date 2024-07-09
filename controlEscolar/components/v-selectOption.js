import { roles } from "../models/roles.js";

export const vSelectOption = {
    inject: ["permissions"],

    data() {
        return {
            option: {
                files: false,
                fInformation: false,
                adminUsers: false,
                closed: false,
            },
            access: this.isAdmin()
        }
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

        isAdmin() {
            return String(this.permissions.role) === String(roles.admin);
        },

        closeSession() {
            this.setOptionsFalse();
            this.option.closed = true;
            this.$emit("selectedFunction", this.option);
        }
    },

    template: `
    <p>Selecciona las funciones del sitio que deseas utilizar:</p>

    <div v-on:click="findFile" class="functionOption">
        <button>Buscar comprobantes</button>
    </div>
    
    <div 
        v-on:click="piecesInformation"
        class="functionOption"
    >
        <button>Fichas de información</button>
    </div>
    
    <div 
        v-on:click="adminUsers" 
        class="functionOption"
        v-if=access
    >
        <button>Administración de Usuarios</button>
    </div>

    <div v-on:click="closeSession" class="functionOption">
        <button>Cerrar Sesión</button>
    </div>
    `
};
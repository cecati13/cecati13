export const vSelectOption = {
    data() {
        return {
            option: {
                files: false,
                fInformation: false,
                closed: false,
            }
        }
    },
    methods: {
        findFile(){
            this.option.files = true;
            this.option.fInformation = false;
            this.$emit("selectedFunction", this.option);
        },
        
        piecesInformation(){
            this.option.fInformation = true;
            this.option.files = false;
            this.$emit("selectedFunction", this.option);
        },

        closeSession(){
            this.option.closed = true;
            this.$emit("selectedFunction", this.option);
        }
    },

    template: `
    <p>Selecciona las funciones del sitio que deseas utilizar:</p>
    <div v-on:click="findFile" class="functionOption">
        <button>Buscar comprobantes</button>
    </div>
    <div v-on:click="piecesInformation" class="functionOption">
        <button>Fichas de información</button>
    </div>
    <div v-on:click="closeSession" class="functionOption">
        <button>Cerrar Sesión</button>
    </div>
    `
};
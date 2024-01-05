export const vAvailableFI =  {
    methods: {
        availableFI(e){
            e.preventDefault();
            const container = "informacion";
            this.$emit("listFI", container)
        }
    },

    template: `
    <h4>Ver Fichas de Información disponibles en el sistema.</h4>
    <form v-on:submit="availableFI">
        <button>Consultar</button>
    </form>
    `
};
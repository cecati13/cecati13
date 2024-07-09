export const vUsers =  {
   
    
    methods: {
        availableFI(e){
            e.preventDefault();
            const container = "informacion";
            this.$emit("listFI", container)
        }
    },

    template: `
    <section className="max-w-2xl">
            <h3 className="text-3xl">Administración de Usuarios</h3>

            <h5 className="text-xl">Usuarios registrados</h5>

            <v-tableUsers/>
         
        </section>
    `
};


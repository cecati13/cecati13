export const vUsers = {

    methods: {
        updateVUsers(params) {
            this.$emit("updateRole", params);
        }
    },

    template: `
    <section>
        <h3>Administración de Usuarios Registrados</h3>
        <v-tableUsers v-on:updateRole="updateVUsers" />
    </section>
    `
};


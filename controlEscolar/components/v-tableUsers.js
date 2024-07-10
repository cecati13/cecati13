export const vTableUsers = {
    inject: ["permissions"],

    data() {
        return {
            users: [],
            
        }
    },

    watch: {
        "permissions.users": {
            handler(newVal) {
                this.users = [...newVal];
            },
            immediate: true
        }
    },

    methods: {
        editRole(array) {
            const params = `${array[0]}?role=${array[1]}`;
            this.$emit("updateRole", params);
        },
    },

    template: `
    <table class="table">
        <thead>
            <tr>
                <th class="table--name">Nombre</th>
                <th class="table--email">E-mail</th>
                <th class="table--role">Permisos</th>
                <th class="table--edit">Editar</th>
            </tr>
        </thead>
        <tbody class="table--body">
            <tr v-for="(user, i) in users" :key="i" >
                <td>{{ user.nameComplete }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <v-rowEditRole 
                    :userID="user.id" 
                    :role="user.role" 
                    v-on:changeNewRole="editRole"
                />
            </tr>
        </tbody>
    </table>`
}
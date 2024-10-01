import { roles, rolesLabel } from "../models/roles.js";

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
                const usersDB = newVal
                    .filter(objUser => objUser.role !== roles.sAdmin)
                this.users = [...usersDB];
            },
            immediate: true
        }
    },

    methods: {
        editRole(array) {
            const params = `${array[0]}?role=${array[1]}`;
            this.$emit("updateRole", params);
        },

        maskRoleLabel(role){
            return rolesLabel.filter(item => item.value === role)[0].label;
            
        },
    },

    template: `
    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th class="">No.</th>
                    <th class="table--name">Nombre</th>
                    <th class="table--email">E-mail</th>
                    <th class="table--role">Permisos</th>
                    <th class="table--edit">Editar</th>
                </tr>
            </thead>
            <tbody class="table--body">
                <tr v-for="(user, i) in users" :key="i" >
                    <td>{{ i + 1 }}</td>
                    <td>{{ user.nameComplete }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ maskRoleLabel(user.role) }}</td>
                    <v-rowEditRole 
                        :userID="user.id" 
                        :role="user.role" 
                        v-on:changeNewRole="editRole"
                    />
                </tr>
            </tbody>
        </table>
    </div>
    `
}
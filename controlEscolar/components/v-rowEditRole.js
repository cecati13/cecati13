export const vRowEditRole = {
    props: {
        userID: {
            type: Number,
            required: true,
        },
        role: {
            type: String,
            required: true,
        }
    },

    data() {
        return {
            isItEdited: false,
            roles: [
                {
                    value: "notFunctions",
                    label: "Sin Funciones"
                },
                {
                    value: "admin",
                    label: "Administrador"
                },
                {
                    value: "user",
                    label: "Usuario"
                },
            ]
        }
    },

    methods: {
        editRole() {
            this.isItEdited = true;
        },

        onChange(event) {
            const newRole = event.target.value;
            if (this.role === newRole) {
                console.log("YA tienes ese rol, no puedes cambiarlo");
                return;
            }
            console.log("cambiando rol a ", newRole);
            //this.$emit("edit")
        },
    },

    computed: {
        filteredRoles() {
            return this.roles.filter(roleOption => roleOption.value !== this.role);
        }
    },

    template: `
    <td v-if=isItEdited class="td--edit">
        <select @change="onChange($event)">
            <option 
                v-for="role in filteredRoles"
                :key="role.value"
                :value="role.value"
            >
                {{ role.label }}
            </option>            
        </select>
    </td>
    <td v-else class="td--edit">
        <IconEdit v-on:edit="editRole"/>
    </td>
    `
}
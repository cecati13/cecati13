import { roles, rolesLabel } from "../models/roles.js";

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
            arrayRoles: rolesLabel,
            changeRole: [this.userID, this.role],

        }
    },

    methods: {
        saveRole() {
            this.$emit("changeNewRole", this.changeRole);
            this.isItEdited = false;

        },
        cancelRole() {
            this.isItEdited = false;
        },
        editRole() {
            this.isItEdited = true;
            this.changeRole[1] = this.filteredRoles[0].value;
        },

        onChange(event) {
            this.changeRole[1] = event.target.value;
        },
    },

    computed: {
        filteredRoles() {
            return this.arrayRoles.filter(roleOption => roleOption.value !== this.role && roleOption.value !== roles.sAdmin);
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
        <IconSave v-on:save="saveRole"/>
        <IconCancel v-on:cancel="cancelRole"/>
    </td>
    <td v-else class="td--edit">
        <IconEdit v-on:edit="editRole"/>
    </td>
    `
}
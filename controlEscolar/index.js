import { App } from "./App.js";
import { vUsers } from "./pages/index.js"
import { vAvailableFI, vButtonBack, vSelectOption, vTableUsers, vUploadFile, vRowEditRole } from "./components/index.js";
import { IconEdit } from "./components/icons/IconEdit.js";

const app = Vue.createApp(App);

app.component("v-selectOption", vSelectOption);
app.component("v-buttonBack", vButtonBack);
app.component("v-uploadFile", vUploadFile);
app.component("v-availableFI", vAvailableFI);
app.component("v-tableUsers", vTableUsers);
app.component("v-users", vUsers);
app.component("IconEdit", IconEdit);
app.component("v-rowEditRole", vRowEditRole);

app.mount("#app");
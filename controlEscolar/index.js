import { ControlStudentApp } from "./ControlStudentApp.js";
import { vFindFile, vGetDB, vUsers } from "./pages/index.js";
import {
  vAvailableFI,
  vButtonBack,
  vSelectOption,
  vTableUsers,
  vUploadFile,
  vRowEditRole,
} from "./components/index.js";
import { IconCancel, IconEdit, IconSave } from "./components/icons/index.js";

const app = Vue.createApp(ControlStudentApp);

/** Pages */
app.component("v-users", vUsers);
app.component("v-findFile", vFindFile);
app.component("v-getDB", vGetDB);

/** Components */
app.component("v-selectOption", vSelectOption);
app.component("v-buttonBack", vButtonBack);
app.component("v-uploadFile", vUploadFile);
app.component("v-availableFI", vAvailableFI);
app.component("v-tableUsers", vTableUsers);
app.component("v-rowEditRole", vRowEditRole);

/** Icons */
app.component("IconCancel", IconCancel);
app.component("IconEdit", IconEdit);
app.component("IconSave", IconSave);

app.mount("#app");

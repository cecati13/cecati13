import { App } from "./App.js";
import { vFindFile, vGetDB, vInformationFiles, vUsers } from "./pages/index.js";
import {
  vAvailableFI,
  vButtonBack,
  vSelectOption,
  vTableUsers,
  vUploadFile,
  vRowEditRole,
  vTablePiecesInfCloud,
} from "./components/index.js";
import { IconCancel, IconEdit, IconSave } from "./components/icons/index.js";

const app = Vue.createApp(App);

/** Pages */
app.component("v-users", vUsers);
app.component("v-findFile", vFindFile);
app.component("v-getDB", vGetDB);
app.component("v-informationFiles", vInformationFiles)

/** Components */
app.component("v-selectOption", vSelectOption);
app.component("v-buttonBack", vButtonBack);
app.component("v-uploadFile", vUploadFile);
app.component("v-availableFI", vAvailableFI);
app.component("v-tablePiecesInfCloud", vTablePiecesInfCloud);
app.component("v-tableUsers", vTableUsers);
app.component("v-rowEditRole", vRowEditRole);

/** Icons */
app.component("IconCancel", IconCancel);
app.component("IconEdit", IconEdit);
app.component("IconSave", IconSave);

app.mount("#app");

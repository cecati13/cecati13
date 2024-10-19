import { InscriptionApp } from "./InscriptionApp.js";
import {
  vAddress,
  vButton,
  vButtonCancel,
  vButtonInscription,
  vButtonUpdate,
  vConexionFailBack,
  vConfirmation,
  vContact,
  vCourse,
  vDataGeneral,
  vDbRegister,
  vDbRegisterLegend,
  vDisability,
  vFirstRegister,
  vForceUpdateDB,
  vInputFile,
  vLegendFiles,
  vLegendUpdateData,
  vNewRegister,
  vNotScholarshipExample,
  vScholarship,
  vTagCurp,
  vTypeRegister,
  vUpdateAddress,
  vUpdateBirthCertificate,
  vUpdateContact,
  vUpdateRegister,
  vUpdateSchool,
  vViewInscriptionNew,
} from "./components/index.js";

const app = Vue.createApp(InscriptionApp);

app.component("v-typeRegister", vTypeRegister);
app.component("v-dbRegister", vDbRegister);
app.component("v-dbRegisterLegend", vDbRegisterLegend);
app.component("v-forceUpdateDB", vForceUpdateDB);
app.component("v-newRegister", vNewRegister);
app.component("v-dataGeneral", vDataGeneral);
app.component("v-contact", vContact);
app.component("v-address", vAddress);
app.component("v-scholarship", vScholarship);
app.component("v-notScholarshipExample", vNotScholarshipExample);
app.component("v-updateContact", vUpdateContact);
app.component("v-updateAddress", vUpdateAddress);
app.component("v-updateSchool", vUpdateSchool);
app.component("v-updateRegister", vUpdateRegister);
app.component("v-firstRegister", vFirstRegister);
app.component("v-button", vButton);
app.component("v-tagCurp", vTagCurp);
app.component("v-viewInscriptionNew", vViewInscriptionNew);
app.component("v-updateBirthCertificate", vUpdateBirthCertificate);
app.component("v-legendUpdateData", vLegendUpdateData);
app.component("v-buttonCancel", vButtonCancel);
app.component("v-inputFile", vInputFile);
app.component("v-course", vCourse);
app.component("v-disability", vDisability);
app.component("v-buttonInscription", vButtonInscription);
app.component("v-buttonUpdate", vButtonUpdate);
app.component("v-confirmation", vConfirmation);
app.component("v-legendFiles", vLegendFiles);
app.component("v-conexionFailBack", vConexionFailBack);

app.mount("#app");

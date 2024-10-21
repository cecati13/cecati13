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
import { API_GET, API_POST } from "./service/api.js";

const host = base.getFunctionsAPI();

const app = Vue.createApp({
  data() {
    return {
      API: host + "/students",
      keyCourseStorage: "CourseCecati13",
      keyStudentStorage: "studentC13",
      curso: {},
      studentLocalStorage: {},
      MAX_SIZE_FILES: 5000000, // 5MB
      sizeFile: "5",
      reactive: {
        studentDB: {
          update: false,
        },
        newStudent: {},
        ageRequeriment: true,
        curp: "",
      },
      infoCourseShow: true,
      isStudentLocalStorage: false,
      isWelcome: true,
      isUserStudent: false,
      isNewStudent: false,
      firstRegisterCompleted: false,
      confirmation: false,
      dataConfirmation: {},
      statusAPIs: false,
    };
  },

  provide() {
    return {
      API: this.API,
      keyCourseStorage: this.keyCourseStorage,
      course: this.getCourse,
      studentLocalStorage: this.getStudentLocalStorage,
      reactive: this.reactive,
      MAX_SIZE_FILES: this.MAX_SIZE_FILES,
      sizeFile: this.sizeFile,
      dataConfirmation: this.dataConfirmation,
    };
  },

  methods: {
    async consult(curp) {
      this.isWelcome = false;
      this.infoCourseShow = false;
      this.preloader();
      const API = `${this.API}/typeRegister/${curp}`;
      const response = await API_GET(API);
      if (response.errorCode === 404) {
        this.isNewStudent = true;
      } else if (response.curp === curp) {
        const storageResponse = JSON.stringify(response);
        sessionStorage.setItem(this.keyStudentStorage, storageResponse);
        this.isStudent();
      } else if (response.message === "Wrong Structure") {
        this.isWelcome = true;
        this.infoCourseShow = true;
        Swal.fire({
          title: "Incorrecto!",
          text: "La Estructura de la CURP es incorrecta, revisa y corrige la información",
          icon: "info",
          confirmButtonText: "Cerrar",
        });
      } else {
        this.isWelcome = true;
        this.infoCourseShow = true;
        Swal.fire({
          title: "Error",
          text: "Hubo un error en la comunicación al servidor",
          icon: "error",
          confirmButtonText: "Cerrar",
        });
      }
      this.preloader();
    },

    preloader() {
      const nodeAPP = document.getElementById("preloader");
      nodeAPP.classList.toggle("preloader");
    },

    /**
     *
     * @param {Object} objInscription - All data
     * @param {Object} objInscription.data - All data (include files)
     * @param {boolean} objInscription.db - Student registered in the system
     */
    async inscription(objInscription) {
      this.preloader();
      this.statusAPIs = false;
      this.isUserStudent = false;
      this.firstRegisterCompleted = false;
      try {
        const objDataInscription = this.addCourseData(objInscription.data);
        const formData = this.buildFormData(objDataInscription);
        const endpoint =
          objInscription.db === true
            ? `${this.API}/DBStudent`
            : `${this.API}/newStudent/inscription`;
        const responseData = await API_POST(endpoint, formData);
        //falta manejo de errores que responda el servidor
        if (responseData.status) {
          (this.dataConfirmation.nombre = objDataInscription.nombre),
            (this.dataConfirmation.matricula = responseData.matricula),
            (this.dataConfirmation.fechaRegistro = responseData.fechaRegistro);
          sessionStorage.removeItem(this.keyCourseStorage);
        }
        if (
          responseData.message === "FILES_TYPE_ERROR" ||
          responseData.message === "LIMIT_FILE_SIZE"
        ) {
          new Error("FILES_TYPE_ERROR");
        } 
        // else {
        //   new Error("Falla al inscribir en BD");
        // }
        this.preloader();
        this.confirmation = true;
        if (responseData.errorCode) {
          this.showErrorInscription();
        }
      } catch (error) {
        this.showErrorInscription();
      }
    },

    addCourseData(objInscription) {
      const dataCourse = JSON.parse(
        sessionStorage.getItem(this.keyCourseStorage)
      );
      return { ...objInscription, ...dataCourse };
    },

    isStudent() {
      const dataSaveStudent = JSON.parse(
        sessionStorage.getItem(this.keyStudentStorage)
      );
      this.reactive.studentDB = { ...dataSaveStudent };

      this.isUserStudent = true;
    },

    saveDataNewRegister(object) {
      for (const key in object) {
        const element = object[key];
        if (this.reactive.newStudent[key] === undefined) {
          Object.defineProperty(this.reactive.newStudent, key, {
            value: element,
            writable: true,
            configurable: false,
            enumerable: true,
          });
        } else {
          this.reactive.newStudent[key] = object[key];
        }
      }
    },

    checkInformation(object) {
      this.saveDataNewRegister(object);
      this.isNewStudent = false;
      this.firstRegisterCompleted = true;
    },

    /**
     * Converts an object to FormData.
     *
     * @param {Object} data - The object to convert.
     * @returns {FormData} - The resulting FormData.
     */
    buildFormData(data) {
      const formData = new FormData();
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          formData.append(key, data[key]);
        }
      }
      return formData;
    },
  },

  computed: {
    getCourse() {
      const getItem = sessionStorage.getItem(this.keyCourseStorage);
      if (!getItem) {
        window.location.href = "../cursos";
        //Si no se ha selecionado un curso redireccionar a /cursos
      }
      const courseInfo = JSON.parse(getItem);
      this.curso = courseInfo;
      return courseInfo;
    },

    getStudentLocalStorage() {
      const getItem = sessionStorage.getItem(this.keyStudentStorage);
      if (getItem) {
        this.studentLocalStorage = JSON.parse(getItem);
        this.reactive.curp = this.studentLocalStorage.curp;
      }
    },

    showErrorInscription() {
      this.preloader();
      this.confirmation = false;
      Swal.fire({
        title: "Error",
        text: "Lo sentimos, se genero un error interno del sitio. Por favor intenta más tarde.",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
      console.log(error);
    },
  },

  template: `
  <section class="seccion__inscription">
    <h3>Inscripción</h3>

    <div id="preloader"></div>

    <h4 v-if="infoCourseShow" class="article__course">
      Bienvenido al proceso de inscripción al curso:
    </h4>
    <v-course
      v-if="infoCourseShow"
    />

    <v-conexionFailBack
      v-if="statusAPIs"
    />

    <v-typeRegister
      v-on:consultCURP="consult"
      v-if="isWelcome"
    />

    <v-dbRegister
      v-if="isUserStudent"
      v-on:eventInscription="inscription"
    />
    
    <v-newRegister
      v-if="isNewStudent"
      v-on:saveDataNewRegister="saveDataNewRegister"
      v-on:completedNewInscription="checkInformation"
    />

    <v-viewInscriptionNew
      v-if="firstRegisterCompleted"
      v-on:saveDataUpdate="saveDataNewRegister"
      v-on:completedNewInscription="inscription"
    />

    <v-conexionFailBack
      v-if="statusAPIs"
    />
    
    <v-confirmation
    v-if="confirmation"
    />

  </section>
    `,
});

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

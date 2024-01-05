import { vAddress } from "./components/v-address.js";
import { vButton } from "./components/v-button.js";
import { vButtonCancel } from "./components/v-buttonCancel.js";
import { vButtonInscription } from "./components/v-buttonInscription.js";
import { vButtonUpdate } from "./components/v-buttonUpdate.js";
import { vConexionFailBack } from "./components/v-conexionFailBack.js";
import { vConfirmation } from "./components/v-confirmation.js";
import { vContact } from "./components/v-contact.js";
import { vCourse } from "./components/v-course.js";
import { vDataGeneral } from "./components/v-dataGeneral.js";
import { vDbRegister } from "./components/v-dbRegister.js";
import { vDbRegisterLegend } from "./components/v-dbRegisterLegend.js";
import { vDisability } from "./components/v-disability.js";
import { vFirstRegister } from "./components/v-firstRegister.js";
import { vForceUpdateDB } from "./components/v-forceUpdateDB.js";
import { vInputFile } from "./components/v-inputFile.js";
import { vLegendFiles } from "./components/v-legendFiles.js";
import { vLegendUpdateData } from "./components/v-legendUpdateData.js";
import { vNewRegister } from "./components/v-newRegister.js";
import { vNotScholarshipExample } from "./components/v-notScholarshipExample.js";
import { vScholarship } from "./components/v-scholarship.js";
import { vTagCurp } from "./components/v-tagCurp.js";
import { vTypeRegister } from "./components/v-typeRegister.js";
import { vUpdateAddress } from "./components/v-updateAddress.js";
import { vUpdateBirthCertificate } from "./components/v-updateBirthCertificate.js";
import { vUpdateContact } from "./components/v-updateContact.js";
import { vUpdateRegister } from "./components/v-updateRegister.js";
import { vUpdateSchool } from "./components/v-updateSchool.js";
import { vViewInscriptionNew } from "./components/v-viewInscriptionNew.js";

const app = Vue.createApp({
  data() {
    return {
      API: "https://backend-cursos-cecati13.uc.r.appspot.com/API/v1",
      API_files: "https://backend-cursos-cecati13.uc.r.appspot.com/API/v1",
      keyCourseStorage: "CourseCecati13",
      keyStudentStorage: "studentC13",
      curso:{},
      studentLocalStorage: {},
      MAX_SIZE_FILES: 5000000, // 5MB
      sizeFile: "5",
      reactive: {
        studentDB: {
          update: false
        },
        newStudent:{},
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
      statusAPIs: false
    };
  },

  provide() {
    return {
      API: this.API,
      API_files: this.API_files,
      keyCourseStorage: this.keyCourseStorage,
      course: this.getCourse,
      studentLocalStorage: this.getStudentLocalStorage,
      reactive: this.reactive,
      MAX_SIZE_FILES: this.MAX_SIZE_FILES,
      sizeFile: this.sizeFile,
      dataConfirmation: this.dataConfirmation
    }
  },

  methods: {
    async consult(formData) {
      this.isWelcome = false;
      this.infoCourseShow = false;
      this.preloader();
      const API = `${this.API}/students/typeRegister`
      const response = await this.sendData(API, formData);
      if (response.error) {
        this.preloader();
        this.isNewStudent = true;
      } else if (response.message === "internal server error") {
        //error generalemente al hacer una primera consulta en SpreedSheets en version 16 nodejs
        this.preloader();
        this.isWelcome = true;
        this.infoCourseShow = true;
        Swal.fire({
          title: "Error",
          text: "Hubo un error en la comunicación al servidor", 
          icon: "error",
          confirmButtonText: "Cerrar"
        })
        //alert("Hubo un error en la comunicación al servidor, por favor vuelve a intentarlo. Si el error persiste intentalo mas tarde.")
      } else if (response.message === "Wrong Structure") {
        this.preloader();
        this.isWelcome = true;
        this.infoCourseShow = true;
        Swal.fire({
          title: "Incorrecto!",
          text: "La Estructura de la CURP es incorrecta, revisa y corrige la información", 
          icon: "info",
          confirmButtonText: "Cerrar"
        })
        //alert("La Estructura de la CURP es incorrecta, revisa y corrige la información");
      // } else if(response.updateContact) {
      //   //usuario existe, pero actualizar datos de contacto es obligatorio
      //   const storageResponse = JSON.stringify(response);
      //   sessionStorage.setItem(this.keyStudentStorage, storageResponse);
      //   //crear un nuevo componente para obligar a actualizar
      } else {
        //el usuario existe en nuestros registros mas recientes
        const storageResponse = JSON.stringify(response);
        sessionStorage.setItem(this.keyStudentStorage, storageResponse);
        this.preloader();
        this.isStudent();
      }
    },

    preloader() {
      const nodeAPP = document.getElementById("preloader");
      nodeAPP.classList.toggle("preloader");
    },

    async verifyCURPofData (){
      //***********Debe traerse desde la funcion verifyDataGeneral() en el componente v-dataGeneral *************/
      const responseFile = await this.sendDataGeneralForm(dataFORM)        
        if (responseFile.curp === undefined ) {
          //temporalmente añadir el blob al objeto de acta de nacimiento
          Object.defineProperty(this.reactive.newStudent, "actaNacimiento", {
            value: birthCertificate,
            writable: true,
            configurable: false,
            enumerable: true
          })          
          this.$emit("continueFirstRegister", responseFile)          
        } else if (responseFile.curp == "false") {
          Swal.fire({
            title: "Incorrecto",
            text: "Verifica la información nuevamente.",
            icon: "warning",
            confirmButtonText: "Cerrar"
          });
          //alert("Error. Verifica la información.")
        } else {
          Swal.fire({
            title: "Error",
            text: "Lo sentimos, estamos teniendo problemas de comunicación con nuestro servidor. Por favor intentalo mas tarde.",
            icon: "error",
            confirmButtonText: "Cerrar"
          });
          //alert("Lo sentimos, estamos teniendo problemas de comunicación con nuestro servidor. Por favor intentalo mas tarde.")
        }
      //***********Debe traerse desde la funcion verifyDataGeneral() en el componente v-dataGeneral *************/
    },

    async inscription(objInscription) {
      this.preloader();
      this.statusAPIs = false;
      this.isUserStudent = false;
      this.firstRegisterCompleted = false;
      try {
        const backendData = await this.checkConnection(this.API);
        if (backendData
           //|| backendFiles
           ) {
          let objLinksFiles = {};
          if (objInscription.formFiles) {
            const formFiles = objInscription.formFiles;
            //const endpoint = `${this.API_files}/files`;   endpoint anterior a servidores virtuales
            const endpoint = `${this.API_files}/students/files`;
            const files = await this.sendFiles(formFiles, endpoint);
            objLinksFiles = {...files};
            //errores en server files
            if (objLinksFiles.error) {
              if (objLinksFiles.error.code === "LIMIT_FILE_SIZE") {
                console.log(`Archivos de mas de ${this.sizeFile} MB`);
                new Error("LIMIT_FILE_SIZE");
              }
              if (objLinksFiles.error.storageErrors["length"] === 0){
                console.log("1 archivo con formato incorrecto");
                new Error("FILES_TYPE_ERROR");
              }
            }
            //errores en server files
          }
          const objOfLinksFiles = {...objInscription.data, ...objLinksFiles}
          const objDataInscription = this.addCourseData(objOfLinksFiles);
          let endpoint = objInscription.db === true ?
            `${this.API}/students/DBStudent` :
            `${this.API}/students/newStudent/inscription`;
    
          const responseData = await this.sendData(endpoint, objDataInscription);
    
          //falta manejo de errores que responda el servidor
          if (responseData.status) {
            this.dataConfirmation.nombre = objDataInscription.nombre,
            this.dataConfirmation.matricula = responseData.matricula,
            this.dataConfirmation.fechaRegistro = responseData.fechaRegistro
            sessionStorage.removeItem(this.keyCourseStorage)
          } else {
            new Error("Falla al inscribir en BD")
          }
          this.preloader();
          this.confirmation = true;          
        }  
      } catch (error) {
        this.preloader();
        Swal.fire({
          title: "Error",
          text: "Lo sentimos, se genero un error interno del sitio. Por favor intenta más tarde.", 
          icon: "error",
          confirmButtonText: "Cerrar"
        })
        console.log(error);
      }
    },

    addCourseData(objInscription){
      const dataCourse = JSON.parse(sessionStorage.getItem(this.keyCourseStorage));
      //sessionStorage
      const inscriptionMoreCourse = {
        ...objInscription,
        ...dataCourse
      };
      return inscriptionMoreCourse;   
    },

    async sendFiles(formFiles, API){
      const response = await fetch( API, {
        method: "post",
        body: formFiles
      })
      const info = await response.json();
      return info;
    },

    async sendData(API, obj = {}){
      try {
        const response = await fetch( API, {
          method: "POST",
          headers: {
            //"Content-Type": "multipart/form-data"
            "Content-Type": "application/json"
          },
          body: JSON.stringify(obj)
        })
        return response.json()        
      } catch (error) {
        console.error(error);
      }
    },

    isStudent(){
      const dataSaveStudent = JSON.parse(sessionStorage.getItem(this.keyStudentStorage));
      this.reactive.studentDB = {
        ...dataSaveStudent,
      }

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
            enumerable: true
          });
        } else {
          this.reactive.newStudent[key] = object[key]
        }
      }      
    },

    checkInformation(object){
      this.saveDataNewRegister(object);
      this.isNewStudent = false;
      this.firstRegisterCompleted = true;
    },

    async checkConnection(API){
      const conexionInfo = await fetch(API);
      let status = false;
      if (conexionInfo.status) {
        status = true;
      }
      return status;
    },   
  },

  computed: {
    getCourse(){
      const getItem = sessionStorage.getItem(this.keyCourseStorage);
      if (!getItem) {
        window.location.href = "../cursos"
        //Si no se ha selecionado un curso redireccionar a /cursos
      }
      const courseInfo = JSON.parse(getItem);
      this.curso = courseInfo;
      return courseInfo;
    },

    getStudentLocalStorage(){
      const getItem = sessionStorage.getItem(this.keyStudentStorage);
      if (getItem) {
        this.studentLocalStorage = JSON.parse(getItem);
        this.reactive.curp = this.studentLocalStorage.curp;
      }
    }
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

app.mount('#app');

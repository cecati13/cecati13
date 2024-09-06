import { CONSTANTS } from "../../shared/constants.js";

export const vScholarship = {
    inject: ["MAX_SIZE_FILES", "sizeFile"],
    data(){
      return {
        listaEscolaridades: CONSTANTS.listaEscolaridades,
      }
    },
  
    methods: {
      scholarshipDetailCompleted(e){
        e.preventDefault();
        const scholarship = document.getElementById("scholarship").value.toUpperCase();
        const studiesCertificate = e.target.children['studiesCertificate'].files[0];
        const studiesCertificateRender = URL.createObjectURL(e.target.children['studiesCertificate'].files[0]);
        const objScholarship = {
          escolaridad: scholarship,
          comprobanteEstudios: studiesCertificate,
          comprobanteEstudiosRender: studiesCertificateRender
        };
        const validateFile = this.validateTypeFile(studiesCertificate);
        if (studiesCertificate.size > `${this.MAX_SIZE_FILES}`) {
          Swal.fire({
            title: "Archivo muy grande.",
            text: `El archivo tiene que ser menor a ${this.sizeFile} MB. Por favor intenta nuevamente.`,
            icon: "warning",
            confirmButtonText: "Aceptar"
          });
          //alert(`El archivo tiene que ser menor a ${this.sizeFile} MB. Por favor intenta nuevamente.`);
        } else if(!validateFile){
          Swal.fire({
            title: "Formato de archivo invalido.",
            text: `Solo puedes subir archivos en formato .pdf .jpeg .jpg. Por favor intenta nuevamente.`,
            icon: "error",
            confirmButtonText: "Aceptar"
          });
          //alert("El tipo de archivono es valido. Solo puedes subir archivos en formato .pdf .jpeg .jpg. Por favor intenta nuevamente.");
        } else{
          this.$emit("scholarshipDetailCompleted", objScholarship)
        }
      },
  
      validateTypeFile(file){
        const format = file.type;
        const arrayFormats = ["application/pdf", "image/jpg", "image/jpeg", "image/png"];
        const validateFormat = arrayFormats.some( type => type === format);
        return validateFormat;
      }
    },
  
    template: `
    <form v-on:submit="scholarshipDetailCompleted">
      <h4>Grado Escolar</h4>
      
      <p>¿Cuál es el máximo grado de estudios que alcanzaste? Selecciona una opción.</p>
      <label for="scholarship">
      <select name="scholarship" id="scholarship">
        <option 
          v-for="item in listaEscolaridades" 
          selected="listaEscolaridades[0]"
          :key="item">
            {{ item }}
        </option>
      </label>  
  
      <label for="studiesCertificate">Adjunta un comprobante del máximo grado de estudios alcanzados.</label>
      <v-legendFiles/>
      <input 
        type="file" 
        name="studiesCertificate"
        accept=".jpg, .jpeg, .pdf"
      >
  
      <v-notScholarshipExample></v-notScholarshipExample>
      
      <v-button></v-button>
    </form>
    `
  };
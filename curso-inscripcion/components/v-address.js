import { CONSTANTS } from "../../shared/constants.js";

export const vAddress = {
    inject: ["MAX_SIZE_FILES", "sizeFile"],
    data(){
      return {
        estadoRepublica: "Aguascalientes",
        valueEstado: CONSTANTS.stateAndMunicipality,
      }
    },
    methods: {
      addressDetailCompleted(e){
        e.preventDefault()
        const calle = e.target.children['calle'].value.toUpperCase();
        const colonia = e.target.children['colonia'].value.toUpperCase();
        const cp = e.target.children['cp'].value;
        const nodeEstado = document.querySelector("#estado");
        const estado = nodeEstado.value.toUpperCase();
        const nodeMunicipio = document.querySelector("#municipio");
        const municipio = nodeMunicipio.value.toUpperCase();
        const addressCertificate = e.target.children["addressCertificate"].files[0]
        const addressCertificateRender = URL.createObjectURL(e.target.children["addressCertificate"].files[0]);
        
        const objAddress = {
          calle: calle,
          colonia: colonia,
          cp: cp,
          estado: estado,
          municipio: municipio,
          comprobanteDomicilio: addressCertificate,
          comprobanteDomicilioRender:addressCertificateRender
        }
        let empty = false;
        for (const key in objAddress) {
          const element = objAddress[key];
          if (element === "") {
            empty = true;
            break;
          }
        }
        const validateFile = this.validateTypeFile(addressCertificate);
        if (empty) {
          Swal.fire({
            title: "Información incompleta",
            text: "Por favor captura toda la inforamción.",
            icon: "warning",
            confirmButtonText: "Aceptar"
          });
          //alert("Por favor proporciona la información completa. Revisa todos los campos")
        } else if (addressCertificate.size > `${this.MAX_SIZE_FILES}`) {
          Swal.fire({
            title: "Archivo muy grande.",
            text: `El archivo tiene que ser menor a ${this.sizeFile} MB. Por favor intenta nuevamente.`,
            icon: "warning",
            confirmButtonText: "Aceptar"
          });
          //alert(`El archivo tiene que ser menor a ${this.sizeFile} MB. Por favor intenta nuevamente.`);
        } else if (!validateFile){
          Swal.fire({
            title: "Formato de archivo invalido.",
            text: `Solo puedes subir archivos en formato .pdf .jpeg .jpg. Por favor intenta nuevamente.`,
            icon: "error",
            confirmButtonText: "Aceptar"
          });
          // alert("El tipo de archivono es valido. Solo puedes subir archivos en formato .pdf .jpeg .jpg. Por favor intenta nuevamente.")
        } else {
          this.$emit("addressDetailCompleted", objAddress)
        }
      },
  
      validateTypeFile(file){
        const format = file.type;
        const arrayFormats = ["application/pdf", "image/jpg", "image/jpeg", "image/png"];
        const validateFormat = arrayFormats.some( type => type === format);
        return validateFormat;
      },
  
      showMunicipio(e){      
        this.estadoRepublica = e.target.value;
      },   
    },
    template: `  
    <form v-on:submit="addressDetailCompleted">
      <h4>Por favor indica tu domicilio:</h4>
      <label for="calle">Calle y número</label>
      <input 
        type="text" 
        name="calle" 
        placeholder="Calle y número..." 
        required
        onkeyup="javascript:this.value=this.value.toUpperCase();"
      >
      
      <label for="colonia">Colonia</label>
      <input 
        type="text" 
        name="colonia" 
        placeholder="Colonia..." 
        required
        onkeyup="javascript:this.value=this.value.toUpperCase();"
      >
      <!-- https://copomex.com/#pricing-section por 330 para agilizar este tramite -->
  
      <label for="cp"> <span>Código Postal</span>
      </label>
      <input 
        type="text" 
        name="cp" 
        placeholder="Código Postal a 5 dígitos..."
        required
        inputmode="numeric" 
        pattern="[0-9]{5}"
        title="Número de 5 dígitos. Ejemplo: 04380"
      />      
      <p>Estado</p>
      <label for="estado">
      <select name="estado" id="estado" v-on:change="showMunicipio">
        <option v-for="(item, i) in valueEstado" v-bind:value="i">
          {{ i }}
        </option>
      </label>      
      <p>Municipio o Alcaldía</p>
      <label for="municipio">
        <select name="municipio" id="municipio">
          <option v-for="item in valueEstado[estadoRepublica]" :key="item" @municipio="municipio"> {{ item }}</option>
        </select>
      </label>
  
      <label for="addressCertificate">Adjuntar Comprobante de Domicilio</label>
      <v-legendFiles/>
      <input 
        type="file" 
        name="addressCertificate" 
        id="addressCertificate"
        accept=".jpg, .jpeg, .pdf"
      >
      <v-button></v-button>
    </form>
    `
  };
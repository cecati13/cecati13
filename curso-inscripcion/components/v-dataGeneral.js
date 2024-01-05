import { CONSTANTS } from "../../shared/constants.js";

export const vDataGeneral = {
    inject: ["API", "reactive", "MAX_SIZE_FILES", "sizeFile"],
    data(){
      return {
        meetsAgeRequirement: true,
        estadoNacimiento: CONSTANTS.onlyStates,
      }
    }, 
  
    methods: {
      isAgeOver15(e){
        const date = e.target.value;
        const dateNow = new Date();
        const yearNow = parseInt(dateNow.getFullYear());
        const monthNow = parseInt(dateNow.getMonth()) + 1;
        const dayNow = parseInt(dateNow.getDate());
  
        // YYYY-MM-DD
        const birthYear = parseInt(String(date).substring(0, 4));
        const birthMonth = parseInt(String(date).substring(5, 7));
        const birthDay = parseInt(String(date).substring(8, 10));
  
        let age = yearNow - birthYear;
        if (monthNow < birthMonth) {
            age--;
        } else if (monthNow === birthMonth) {
            if (dayNow < birthDay) {
                age--;
            }
        }
        
        if (age < 15) {
          this.reactive.ageRequeriment = false;
          this.meetsAgeRequirement = false;
        } else {
          this.reactive.ageRequeriment = true;
          this.meetsAgeRequirement = true;
        }
      },
  
      async verifyDataGeneral(e){
        e.preventDefault();
        const curp = e.target.children['curp'].value
        const birthday = e.target.children['birthday'].value      
        const nombre = e.target.children['nombre'].value
        const a_paterno = e.target.children['a_paterno'].value
        const a_materno = e.target.children['a_materno'].value
        const nodePlaceOfBirth = document.getElementById("placeOfBirth")
        const placeOfBirth = nodePlaceOfBirth.value
        const genero = document.getElementById("genero")
        let gender
        if (genero.checked && genero.value ==="MASCULINO") {
          gender = "MASCULINO"
        } else {
          gender = "FEMENINO"
        }
        
        const birthCertificate = e.target.children["birthCertificate"].files[0]
        const birthCertificateBlob = URL.createObjectURL(e.target.children["birthCertificate"].files[0]);
        
  
        const dataFORM = {
          curp: curp,
          fechaNacimiento: birthday,
          nombre: nombre,
          a_paterno: a_paterno,
          a_materno: a_materno,
          estado: placeOfBirth,
          genero: gender,
          actaNacimientoRender: birthCertificateBlob
        }
        
        if (birthCertificate.size > `${this.MAX_SIZE_FILES}`) {
          Swal.fire({
            title: "Archivo muy grande.",
            text: `El archivo tiene que ser menor a ${this.sizeFile} MB. Por favor intenta nuevamente.`,
            icon: "warning",
            confirmButtonText: "Aceptar"
          });
          //alert(`El archivo tiene que ser menor a ${this.sizeFile} MB. Por favor intenta nuevamente.`);
        } else {
          //***********PARTE TRABAJANDO EN  verifyCURPofData() en el padre de todos*************/
          const responseFile = await this.sendDataGeneralForm(dataFORM);        
          if (responseFile.curp === this.reactive.curp ) {
            //temporalmente añadir el blob al objeto de acta de nacimiento
            Object.defineProperty(this.reactive.newStudent, "actaNacimiento", {
              value: birthCertificate,
              writable: true,
              configurable: false,
              enumerable: true
            })          
            this.$emit("continueFirstRegister", responseFile)
            //VERIFICAR SI USUARIO CAMBIO LA CURP Y VERIFICAR QUE NO ESTE INSCRITO EN EL SISTEMA
            } else if (responseFile.curp == false) {
              const message = responseFile.message;
              Swal.fire({
                title: "Error",
                text: message,
                icon: "error",
                confirmButtonText: "Aceptar"
              });
              //alert("Error. Verifica la información.")
            } else {
              console.warn("comunicacion con servidor exitosa, pero se genero otro error al procesar la respuesta aqui en el Front")
            }
        }
        //***********PARTE TRABAJANDO EN  verifyCURPofData() en el padre de todos*************/
      },
  
      async sendDataGeneralForm(formData){
        //falta trabajar que sea solo uan funcion global para hacer fetch, y solo generar enpoints con su data a enviar      
        const endpoint = `${this.API}/students/newStudent/dataGeneral`;      
        const response = await fetch( endpoint, {
          method: "post",
          headers: {          
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        })
        const info = await response.json()      
        return info
      }
      //****Eliminar funcion sendDataGeneralForm() cuando se migre verifyCURPofData() al componente padre y se mantenga la funcionalidad*/
    },
    
    template: `
    <form v-on:submit="verifyDataGeneral" name="dataGeneral">
      <input v-bind:value="reactive.curp" name="curp" readonly></input>
      <h4>Para Verificar que tú CURP sea correcta y continuar con la inscripción, por favor proporcionanos los siguientes datos personales:</h4>
      <label for="birthday">Fecha de Nacimiento</label>
      <input
        id="birthdate"
        type="date" name="birthday" 
        placeholder="Fecha de nacimiento..."
        v-on:input="isAgeOver15"
        required
      >
      <p v-if="!reactive.ageRequeriment" class="inscription__message">
        Lo sentimos no podemos continuar con tu proceso de inscripción
      </p>
      <p v-if="!reactive.ageRequeriment" class="inscription__message">
      La edad minima para inscribirte son 15 años cumplidos.
      </p>
  
      <label for="nombre" v-if="meetsAgeRequirement">Nombre</label>
      <input 
        v-if="meetsAgeRequirement"
        type="text" 
        name="nombre" 
        placeholder="Escribe tu nombre de pila..."
        required
        onkeyup="javascript:this.value=this.value.toUpperCase();"
      >
  
      <label for="a_paterno" v-if="meetsAgeRequirement">Apellido Paterno</label>
      <input 
        v-if="meetsAgeRequirement"
        type="text" 
        name="a_paterno" 
        placeholder="Tu apellido paterno..."
        required
        onkeyup="javascript:this.value=this.value.toUpperCase();"
      >
  
      <label for="a_materno" v-if="meetsAgeRequirement">Apellido Materno</label>
      <input 
        v-if="meetsAgeRequirement"
        type="text"
        name="a_materno" 
        placeholder="Tu apellido materno..."
        required
        onkeyup="javascript:this.value=this.value.toUpperCase();"
      >
  
      <div class="label__gender" v-if="meetsAgeRequirement">
        <label for="genero" name="MASCULINO" class="label__gender">Hombre 
            <input
              type="radio" 
              value="MASCULINO" 
              name="genero" 
              id="genero"
            >
        </label>
        <label for="genero" name="FEMENINO" class="label__gender">Mujer
            <input
              type="radio" 
              value="FEMENINO" name="genero"
            >
        </label>    
      </div>
      
  
      <br>
  
      <p v-if="meetsAgeRequirement">Lugar de Nacimiento</p>
      <label for="estado" v-if="meetsAgeRequirement">
        <select name="estado" id="placeOfBirth">
          <option v-for="item in estadoNacimiento" :key="item">{{ item }}</option>
      </label>
      <label 
        for="birthCertificate"
        v-if="meetsAgeRequirement"
      >
        Adjuntar Acta de Nacimiento
      </label>
      <v-legendFiles v-if="meetsAgeRequirement"/>
      <input
        v-if="meetsAgeRequirement"       
        type="file" 
        name="birthCertificate"
        accept=".jpg, .jpeg, .pdf" 
      >
  
      <v-button v-if="meetsAgeRequirement"></v-button>
      </form>
      `
};
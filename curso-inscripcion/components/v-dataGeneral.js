import { CONSTANTS } from "../../shared/constants.js";
import { API_POST } from "../service/api.js";

export const vDataGeneral = {
  inject: ["API", "reactive", "MAX_SIZE_FILES", "sizeFile"],
  data() {
    return {
      meetsAgeRequirement: true,
      editRFC: false,
      estadoNacimiento: CONSTANTS.onlyStates,
      form: {
        curp: this.reactive.curp,
        birthdate: "",
        nombre: "",
        a_paterno: "",
        a_materno: "",
        genero: "",
        maritalStatus: "",
        rfc: null,
        estado: "",
        birthCertificate: "",
      }
    };
  },

  methods: {
    isAgeOver15(e) {
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

    fnEditRFC (){
      this.editRFC = !this.editRFC;
      this.form.rfc = this.editRFC ? "" : null;
    },

    handleFileUpload(event) {
      const file = event.target.files[0]; 
      this.form.birthCertificate = file; 
    },

    async verifyDataGeneral(e) {
      e.preventDefault();
      console.log(this.form)
      // debugger;
      // const curp = e.target.children["curp"].value;
      // const birthday = e.target.children["birthday"].value;
      // const nombre = e.target.children["nombre"].value;
      // const a_paterno = e.target.children["a_paterno"].value;
      // const a_materno = e.target.children["a_materno"].value;
      // const nodePlaceOfBirth = document.getElementById("placeOfBirth");
      // const placeOfBirth = nodePlaceOfBirth.value;
      // const genero = document.getElementById("genero");
      // const gender =
      //   genero.checked && genero.value === "MASCULINO"
      //     ? "MASCULINO"
      //     : "FEMENINO";
      // const birthCertificate = e.target.children["birthCertificate"].files[0];
      // const birthCertificateBlob = URL.createObjectURL(
      //   e.target.children["birthCertificate"].files[0]
      // );

      // const formData = new FormData();

      // formData.append("curp", curp),
      //   formData.append("fechaNacimiento", birthday),
      //   formData.append("nombre", nombre),
      //   formData.append("a_paterno", a_paterno),
      //   formData.append("a_materno", a_materno),
      //   formData.append("estado", placeOfBirth),
      //   formData.append("genero", gender),
      //   formData.append("actaNacimientoRender", birthCertificateBlob);

      // if (birthCertificate.size > `${this.MAX_SIZE_FILES}`) {
      //   Swal.fire({
      //     title: "Archivo muy grande.",
      //     text: `El archivo tiene que ser menor a ${this.sizeFile} MB. Por favor intenta nuevamente.`,
      //     icon: "warning",
      //     confirmButtonText: "Aceptar",
      //   });
      // } else {
      //   //***********PARTE TRABAJANDO EN  verifyCURPofData() en el padre de todos*************/
      //   const endpoint = `${this.API}/newStudent/dataGeneral`;
      //   const responseFile = await API_POST(endpoint, formData);
      //   if (responseFile.curp === this.reactive.curp) {
      //     //temporalmente añadir el blob al objeto de acta de nacimiento
      //     Object.defineProperty(this.reactive.newStudent, "actaNacimiento", {
      //       value: birthCertificate,
      //       writable: true,
      //       configurable: false,
      //       enumerable: true,
      //     });
      //     this.$emit("continueFirstRegister", responseFile);
      //     //VERIFICAR SI USUARIO CAMBIO LA CURP Y VERIFICAR QUE NO ESTE INSCRITO EN EL SISTEMA
      //   }
      //   if (responseFile.curp === false) {
      //     Swal.fire({
      //       title: "Error",
      //       text: responseFile.message,
      //       icon: "error",
      //       confirmButtonText: "Aceptar",
      //     });
      //   }
      // }
    },
  },

  template: `
    <form @submit="verifyDataGeneral" name="dataGeneral">
      <input v-bind:value="reactive.curp" readonly/>
      <h4>Para Verificar que tú CURP sea correcta y continuar con la inscripción, por favor proporcionanos los siguientes datos personales:</h4>
      
      <label for="birthday">Fecha de Nacimiento</label>
      <input
        id="birthdate"
        type="date" 
        v-model="form.birthdate" 
        placeholder="Fecha de nacimiento..."
        v-on:input="isAgeOver15"
        required
      />
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
        v-model="form.nombre"  
        placeholder="Escribe tu nombre de pila..."
        required
        onkeyup="javascript:this.value=this.value.toUpperCase();"
      />
  
      <label for="a_paterno" v-if="meetsAgeRequirement">Apellido Paterno</label>
      <input 
        v-if="meetsAgeRequirement"
        type="text" 
        name="a_paterno" 
        v-model="form.a_paterno"  
        placeholder="Tu apellido paterno..."
        required
        onkeyup="javascript:this.value=this.value.toUpperCase();"
      />
  
      <label for="a_materno" v-if="meetsAgeRequirement">Apellido Materno</label>
      <input 
        v-if="meetsAgeRequirement"
        type="text"
        name="a_materno"
        v-model="form.a_materno" 
        placeholder="Tu apellido materno..."
        required
        onkeyup="javascript:this.value=this.value.toUpperCase();"
      />
  
      <div class="label__gender" v-if="meetsAgeRequirement">
        <label class="label__gender">
          Hombre 
          <input
            type="radio" 
            value="MASCULINO" 
            v-model="form.genero"
          >
        </label>
        <label class="label__gender">
          Mujer
          <input
            type="radio" 
            v-model="form.genero"
          >
        </label>
      </div>
      
  
      <br>

      <div class="label__gender" v-if="meetsAgeRequirement">
        <p>Estado Civil</p>
        <label class="label__gender">
          Soltero 
          <input type="radio"  value="SOLTERO" v-model="form.maritalStatus" />
        </label>
        <label for="maritalStatus" name="CASADO/A" class="label__gender">
          Casado/a
          <input type="radio" value="CASADO/A" v-model="form.maritalStatus"/>
        </label>
        <label for="maritalStatus" name="UNION LIBRE" class="label__gender">
          Unión Libre
          <input type="radio" value="UNION LIBRE" v-model="form.maritalStatus"/>
        </label>
        <label for="maritalStatus" name="VIUDO/A" class="label__gender">
          Viudo/a
          <input type="radio" value="VIUDO/A" v-model="form.maritalStatus"/>
        </label>
        <label for="maritalStatus" name="DIVORCIADO/A" class="label__gender">
          Divorciado/a
          <input type="radio" value="DIVORCIADO/A" v-model="form.maritalStatus"/>
        </label>
      </div>

      <div>
        <label for="rfc" >
          Hemos generado tu RFC de manera automatica. Si hay algun error presionar EDITAR y captura el RFC correcto.
        </label>
        <input v-bind:value="reactive.curp" name="rfc" v-if="meetsAgeRequirement && !editRFC" readonly/>
        <input name="rfc" v-if="meetsAgeRequirement && editRFC" v-model="form.rfc"/>
        <button 
          type="button" v-if="meetsAgeRequirement" v-on:click="fnEditRFC"
        >
          {{ meetsAgeRequirement && !editRFC ? "Editar" : "Generar Automaticamente"}}
        </button>
      </div>
  
      <p v-if="meetsAgeRequirement">Lugar de Nacimiento</p>
      <label for="estado" v-if="meetsAgeRequirement">
        <select v-model="form.estado" name="estado" id="placeOfBirth">
        <option value="" disabled>Seleccione un estado</option>
          <option v-for="item in estadoNacimiento" :key="item">{{ item }}</option>
        </select>
      </label>

      <label for="birthCertificate" v-if="meetsAgeRequirement">
        Adjuntar Acta de Nacimiento
      </label>
      <v-legendFiles v-if="meetsAgeRequirement"/>
      <input
        v-if="meetsAgeRequirement"
        type="file" 
        @change="handleFileUpload"
        accept=".jpg, .jpeg, .pdf" 
      />
  
      <v-button v-if="meetsAgeRequirement" type="submit"/>
      </form>
      `,
};

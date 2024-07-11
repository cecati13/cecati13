export const vDbRegister = {
  inject: ["reactive"],

  data() {
    return {
      showInscription: true,
      showForceUpdate: this.reactive.studentDB.updateContact,
      telefonoFormated: this.reactive.studentDB.telefono
    }
  },

  methods: {
    showUpdateFieldOnly() {
      this.showInscription = !this.showInscription
      if (this.showForceUpdate) {
        this.showForceUpdate = !this.showForceUpdate;
        this.showInscription = !this.showInscription;
      }
    },

    updateProperties(object) {
      this.reactive.studentDB.update = true;
      this.saveDataStudentDB(object);
      if (object.forceUpdate) {
        this.showUpdateFieldOnly();
      }
    },

    saveDataStudentDB(object) {
      for (const key in object) {
        const element = object[key];
        Object.defineProperty(this.reactive.studentDB, key, {
          value: element,
          writable: true,
          configurable: false,
          enumerable: true
        });
      }
    },

    async inscription() {
      const data = {
        ...this.reactive.studentDB
      };
      const formFiles = new FormData;
      formFiles.append("curp", this.reactive.studentDB.curp);
      const objInscription = {
        data,
        formFiles,
        db: true,
        files: 0
      }

      if (objInscription.data.update) {
        for (const key in objInscription.data) {
          const element = objInscription.data[key];
          if (typeof (element) === "object") {
            //si es "object" es un archivo (File)
            objInscription.files = + 1;
            formFiles.append(key, objInscription.data[key]);
            delete objInscription.data[key];
          }
        }
      }

      if (objInscription.files === 0) {
        delete objInscription.formFiles;
      }
      delete objInscription.files;
      this.$emit("eventInscription", objInscription);
    }
  },

  template: `  
    <div 
      v-if="showInscription && !showForceUpdate"
      class="register__preSend--db">
        
      <v-dbRegisterLegend/>
        
      <br>
        
      <h5>Datos de contacto.</h5>
      <br>
      <p>Correo electrónico:</p>
      <p class="register__preSend--data">{{ reactive.studentDB.email }}</p>
      <p>Teléfono:</p>
      <p class="register__preSend--data">{{ reactive.studentDB.telefono }}</p>
      <br>
  
      <p>También puedes actualizar la información personal que registraste en tu último curso antes de inscribirte.</p>
      <p class="note">NOTA: Algunos datos no pueden actualizarse desde este sitio. Si necesitas realizar una correción por favor <a href="../contacto">CONTACTANOS</a> antes de inscribirte.</p>
    </div>
    
    <v-forceUpdateDB 
      v-if="showForceUpdate"
      v-on:showUpdateFieldOnly="showUpdateFieldOnly"
      v-on:updateProperties="updateProperties"
    />
  
    <v-updateRegister
      v-if="!showForceUpdate"
      v-on:showUpdateFieldOnly="showUpdateFieldOnly"
      v-on:updateProperties="updateProperties"    
    />
      
    <v-course v-if="showInscription && !showForceUpdate"/>
    
    <div v-if="showInscription && !showForceUpdate">
      <v-buttonInscription
        v-on:click="inscription">
      </-button>
    </div>
    `
};
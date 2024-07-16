export const vUpdateRegister = {
    data() {
      return {
        showButtonBirthCertificate: true,
        buttonUpdateBirthCertificate: false,
        valueButtonBirthCertificate: "Acta de Nacimiento",
  
        showButtonContact: true,
        buttonUpdateContact: false,
        valueButtonContact: "Datos de Contacto",
  
        showButtonAddress: true,
        buttonUpdateAddress: false,
        valueButtonAddress: "Domicilio",
  
        showButtonScholarship: true,
        buttonUpdateScholarship: false,
        valueButtonScholarship: "Escolaridad",
  
        valueCancel: "Cancelar Actualización"
      }
    },
    
    watch: {
      buttonUpdateBirthCertificate(){
        this.showButtonContact = !this.showButtonContact;
        this.showButtonAddress = !this.showButtonAddress;
        this.showButtonScholarship = !this.showButtonScholarship;
        this.showUpdateFieldOnly();
        this.valueButtonBirthCertificate = this.buttonUpdateBirthCertificate  ?
            this.valueCancel : 
            "Acta de Nacimiento";
      },
  
      buttonUpdateContact(value, old){
        this.showButtonBirthCertificate = !this.showButtonBirthCertificate;
        this.showButtonAddress = !this.showButtonAddress;
        this.showButtonScholarship = !this.showButtonScholarship;
        this.showUpdateFieldOnly();
          this.valueButtonContact = this.buttonUpdateContact  ?
            this.valueCancel : 
            "Datos de Contacto";
        },
  
        buttonUpdateAddress(value, old){
          this.showButtonBirthCertificate = !this.showButtonBirthCertificate;
          this.showButtonContact = !this.showButtonContact;
          this.showButtonScholarship = !this.showButtonScholarship;
          this.showUpdateFieldOnly();        
          this.valueButtonAddress = this.buttonUpdateAddress  ?
            this.valueCancel :
            "Domicilio";
        },
  
        buttonUpdateScholarship(value, old){
          this.showButtonBirthCertificate = !this.showButtonBirthCertificate;
          this.showButtonContact = !this.showButtonContact;
          this.showButtonAddress = !this.showButtonAddress;
          this.showUpdateFieldOnly();        
          this.valueButtonScholarship = this.buttonUpdateScholarship  ?
          this.valueCancel :
          "Escolaridad";
        }
    },
  
    methods: {
      updateProperties(object) {
        this.$emit("updateProperties", object);
        this.buttonUpdateBirthCertificate =false;
        this.buttonUpdateContact = false;
        this.buttonUpdateAddress = false;
        this.buttonUpdateScholarship = false;
      },
      showUpdateFieldOnly(){
        this.$emit("showUpdateFieldOnly")
      }
    },
  
    template: `
    <section class="register container--updateRegister">  
      <h5>Actualización de información</h5>    
      <div class="updateRegister">
  
        <v-buttonUpdate
          v-if="showButtonBirthCertificate"
          v-on:click="buttonUpdateBirthCertificate = !buttonUpdateBirthCertificate">
            {{ valueButtonBirthCertificate }}
        </v-buttonUpdate>
        <v-updateBirthCertificate
          v-if="buttonUpdateBirthCertificate"
          v-on:updateProperties="updateProperties"
        />
        
        <v-buttonUpdate 
        v-if="showButtonAddress"
        v-on:click="buttonUpdateAddress = !buttonUpdateAddress">
        {{ valueButtonAddress }}
        </v-buttonUpdate>
        <v-updateAddress
        v-if="buttonUpdateAddress"
        v-on:updateProperties="updateProperties"
        />
        
        <v-buttonUpdate 
        v-if="showButtonScholarship"  
        v-on:click="buttonUpdateScholarship = !buttonUpdateScholarship">
        {{ valueButtonScholarship }}
        </v-buttonUpdate>
        <v-updateSchool
        v-if="buttonUpdateScholarship"
        v-on:updateProperties="updateProperties"
        />
  
        <v-buttonUpdate 
          v-if="showButtonContact"
          v-on:click="buttonUpdateContact = !buttonUpdateContact">
            {{ valueButtonContact }}
        </v-buttonUpdate>    
        <v-updateContact
          v-if="buttonUpdateContact"
          v-on:updateProperties="updateProperties"
        />
      </div>
    </section>
    `
  };
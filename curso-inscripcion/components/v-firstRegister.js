export const vFirstRegister = {
    data() {
      return {
        firstRegisterIsCompletedContact: true,
        firstRegisterIsCompletedAddress: false,
        firstRegisterIsCompletedScholarship: false,
      }
    },
  
    methods: {
      contactDetailCompleted(object){
        this.firstRegisterIsCompletedContact = false;
        this.firstRegisterIsCompletedAddress = true;
        this.$emit("saveData", object);
        
      },
      
      addressDetailCompleted(object){
        this.firstRegisterIsCompletedAddress = false;
        this.firstRegisterIsCompletedScholarship = true;
        this.$emit("saveData", object);
      },
  
      scholarshipDetailCompleted(object){
        const disability = this.nodeDisability();
        const suffering = this.nodeSuffering();
        const newObj = { 
          ...object, 
          discapacidad: disability,
          padecimiento: suffering 
        };
        this.firstRegisterIsCompletedScholarship = false;
        this.$emit("firstRegisterCompleted", newObj);
      },
  
      nodeDisability(){
       const nodeDisability = document.getElementById("disability");
       const disability = nodeDisability.value.toUpperCase();
       return disability;
      },
      
      nodeSuffering(){
        const node = document.getElementById("suffering");
        const suffering = node.value.toUpperCase();
        return suffering;
      }
    },
  
    template: `
    <v-contact
      v-if="firstRegisterIsCompletedContact"
      v-on:contactDetailCompleted="contactDetailCompleted">
    </v-contact>
    <br>
  
    <v-address
      v-if="firstRegisterIsCompletedAddress"
      v-on:addressDetailCompleted="addressDetailCompleted">
    </v-address>
    <br>
  
    <v-disability
        v-if="firstRegisterIsCompletedScholarship">  
    </v-disability>
  
    <v-scholarship
      v-if="firstRegisterIsCompletedScholarship"
      v-on:scholarshipDetailCompleted="scholarshipDetailCompleted">
    </v-scholarship>
  
    `
  };
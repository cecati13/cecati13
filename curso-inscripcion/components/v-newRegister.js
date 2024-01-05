export const vNewRegister = {
    inject: ["reactive"],
    data: function() {
      return {
        showData: {},
        componentDataGeneral: true,
        componentFirstRegister: false,
      }
    },
  
    methods: {
      continueFirstRegister(object){
        this.componentDataGeneral = false;
        this.componentFirstRegister = true;
        this.$emit("saveDataNewRegister", object);
      },
  
      firstRegisterCompleted(object){
        this.componentFirstRegister = false;
        this.$emit("completedNewInscription", object);
      },
  
      saveData(object){
        this.$emit("saveDataNewRegister", object);
      },
    },
  
    template: `
    <section class="register">
      <v-dataGeneral
      v-if="componentDataGeneral"
        v-on:continueFirstRegister="continueFirstRegister"
      />
      
      <v-firstRegister
        v-if="componentFirstRegister"
        v-on:firstRegisterCompleted="firstRegisterCompleted"
        v-on:saveData="saveData"
      />    
  
      </section>
      `
  };
export const vUpdateContact = {
    methods: {
      contactDetailCompleted(object){
        this.$emit("updateProperties", object)
      },
    },
  
    template: `
    <div class="">
      <v-legendUpdateData></v-legendUpdateData>
  
      <v-contact
        v-on:contactDetailCompleted="contactDetailCompleted"
      />
      
    </div>
    `
  };
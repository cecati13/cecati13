export const vUpdateAddress = {
    methods: {
      addressDetailCompleted(object){
        this.$emit("updateProperties", object)
      },
    },
  
    template: `
    <div>
      <v-legendUpdateData></v-legendUpdateData>
  
      <v-address
        v-on:addressDetailCompleted="addressDetailCompleted"
      />
  
    </div>
    `
  };
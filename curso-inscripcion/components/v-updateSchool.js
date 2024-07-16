export const vUpdateSchool = {
    methods: {
      scholarshipDetailCompleted(object){
        this.$emit("updateProperties", object)
      },
    },
    
    template: `
    <div>
      <v-legendUpdateData/>
      <v-scholarship
        v-on:scholarshipDetailCompleted="scholarshipDetailCompleted"
      />
    </div>  `
  };
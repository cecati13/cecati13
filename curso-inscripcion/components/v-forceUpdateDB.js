export const vForceUpdateDB = {
    methods: {
      forceUpdateContact(object){
        const newObj = {
          ...object, 
          forceUpdate: true
        }
        this.$emit("updateProperties", newObj)
      }
    },
  
    template: `
    <div class="register__preSend--db">
      <v-dbRegisterLegend/>
      <p>Estamos actualizando nuestra base de datos.</p>   
      
      <v-updateContact
      v-on:updateProperties="forceUpdateContact"
      />
    </div>
    `
  };
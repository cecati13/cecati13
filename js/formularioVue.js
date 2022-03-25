const vm = Vue.createApp({
  data() {
    return {
      portada: "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes11.jpeg",
    
      image: [
          "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes11.jpeg",
          "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes16.jpeg",
          "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes18.jpg"
      ],

      text: "Tu nombre...",
      firstName: "Damián",
      lastName: "Valenzuela",
      textPuerta: "Puerta Cerrada",
      open: false,
      styles:  {
        backgroundColor: "#e5e5e5"
      }
    };
  },

  watch:{
    open(value){
      if (value) {
        this.textPuerta = "Puerta abierta";
        this.styles.backgroundColor = "#b5e7a0";
      } else {
        this.textPuerta = "Puerta Cerrada";
        this.styles.backgroundColor = "#eca1a6"
      }
    }
  },

  methods: {
    input(e) {
      this.text = e.target.value;
    },
  },

  computed: {
    fullName(){
      return this.firstName + " " + this.lastName;
    },
    label(){
      return this.open ? "cerrar" : " abrir";
    },
  },

  template: `
    <div>
      <p>{{text}}</p>
      <input type="text" 
      v-model="text"
      />

      <p>{{fullName}}</p>
    </div>
    <div class="container" :class="{'open': open, 'closed': !open}">
      <h2>{{textPuerta}}</h2>
      <button @click="open = !open">{{ label }}</button>
    </div>
    `,
}).mount('#app');
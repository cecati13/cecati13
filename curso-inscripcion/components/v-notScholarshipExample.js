export const vNotScholarshipExample = {
    data: function() {
      return {
        example: false,
      }
    },
  
    methods: {
      showExample() {
        this.example = !this.example;
      }
    },
  
    template: `
    <p class="notScholarshipExample">En caso de no contar con ningún comprobante de estudios favor de redactar una carta en la cual menciones que sabes leer y escribir, que incluya tu nombre completo, tu firma y tu CURP. <span v-on:click="showExample" class="notScholarshipExample--span">Ver ejemplo</span></p>
  
    <img
      v-if="example"
      src="https://storage.googleapis.com/cecati13/ejemplo_estudios.png"
      class="notScholarshipExample--img"
      alt="Ejemplo. Carta para comprobar estudios"
    >
    `
  };
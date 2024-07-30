export const vTypeRegister = {
  inject: ["reactive"],
  methods: {
    curpVerify(e) {
      e.preventDefault();
      const nodeCurp = document.querySelector("#valueCurp");
      const curpValue = nodeCurp.value;
      if (curpValue.length === 18) {
        this.reactive.curp = curpValue;
        this.$emit("consultCURP", curpValue);
      } else {
        Swal.fire({
          title: "Revisa nuevamente.",
          text: "La CURP no es correcta",
          icon: "error",
          confirmButtonText: "Cerrar",
        });
      }
    },
  },

  template: `
    <div class="register">
      <form v-on:submit="curpVerify">
      <label for="curp">Para continuar por favor ingresa  tú</label>
      <v-tagCurp/>
      <v-button></v-button>
      </form>
      <p>Si no conoces tu curp, consultar <a href="https://www.gob.mx/curp/" class ="incription__link">https://www.gob.mx/curp/</a> para obtenerla</p>
    </div>
        `,
};

import { getData } from "../service/api.js";

export const vGetSisae = {
  inject: ["API", "records"],

  data() {
    return {
      showTableRecords: false,
    };
  },

  methods: {
    async findRecords(e) {
      e.preventDefault();
      const numberControl = e.target.matricula.value;
      const endpoint = `${this.API}/infosisae/${numberControl}`;
      const res = await getData(endpoint);
      if (res.students.length > 0) {
        this.records.forSisae = [...res.students];
        this.showTableRecords = true;
      }
      console.log(this.records);
      //this.$emit("recordsSisae", res);
    },
  },

  template: `
    <section>
        <h3>Consultar últimos registros de la Base de Datos para carga al SISAE</h3>
        
        <form v-on:submit="findRecords">
            <p>Selecciona la última matricula registrada en el SISAE:</p>            
            <label for="matricula">Número de matricula</label>
            <input 
                name="matricula"
                type="number"
            >
            <button>Buscar últimos registros</button>
        </form>

        <v-tableRecordsSisae v-if=showTableRecords />
    </section>
    `,
};

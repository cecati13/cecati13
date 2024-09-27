export const vTableRecordsSisae = {
  inject: ["records"],
  // data() {
  //   return {
  //     records: [],
  //   };
  // },
  watch: {
    records: {
      handler(newVal) {
        console.log(this.records)
        this.records = [...newVal];
      },
    },
  },

  methods: {},

  template: `
    <table class="table">
        <thead>
            <tr>
                <th>Matricula</th>
                <th>CURP</th>
                <th>Nombre</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Calle</th>
                <th>Colonia</th>
                <th>Alcaldia</th>
                <th>Estado</th>
                <th>C.P.</th>
            </tr>
        </thead>
        <tbody class="table--body">
            <tr v-for="(record, i) in records" :key="i" >
                <td>{{ records.forSisae.numero_matricula }}</td>
                <td>{{ records.forSisae.curp }}</td>
                <td>{{ records.forSisae.apellido_paterno }}</td>
                <td>{{ records.forSisae.apellido_materno }}</td>
                <td>{{ records.forSisae.nombre }}</td>
                <td>{{ records.forSisae.calle }}</td>
                <td>{{ records.forSisae.colonia }}</td>
                <td>{{ records.forSisae.municipio_alcaldia }}</td>
                <td>{{ records.forSisae.estado }}</td>
                <td>{{ records.forSisae.cp }}</td>
            </tr>
        </tbody>
    </table>`,
};

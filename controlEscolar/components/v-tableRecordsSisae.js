export const vTableRecordsSisae = {
  inject: ["records"],
  data() {
    return {
      records: [],
    };
  },
  watch: {
    records: {
      handler(newVal) {
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
                <td>{{ record.numero_matricula }}</td>
                <td>{{ record.curp }}</td>
                <td>{{ record.apellido_paterno }}</td>
                <td>{{ record.apellido_materno }}</td>
                <td>{{ record.nombre }}</td>
                <td>{{ record.calle }}</td>
                <td>{{ record.colonia }}</td>
                <td>{{ record.municipio_alcaldia }}</td>
                <td>{{ record.estado }}</td>
                <td>{{ record.cp }}</td>
            </tr>
        </tbody>
    </table>`,
};

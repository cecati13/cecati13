import { formatDateDB } from "../helpers/formatDateDB.js";
import { getData } from "../service/api.js";

export const vGetDB = {
  inject: ["API"],

  data() {
    return {
      showTableRecords: false,
      records: [],
      showInfoStudent: false,
      recordStudent: {},
      message: "",
      showMessage: false,
    };
  },

  methods: {
    async findRecords(e) {
      e.preventDefault();
      this.resetResults();
      const numberControl = e.target.matricula.value;
      const endpoint = `${this.API}/infosisae/${numberControl}`;
      const res = await getData(endpoint);
      if (res.students.length > 0) {
        this.records = [...res.students];
        this.showTableRecords = true;
      }
      this.message = res.msg;
      this.showMessage = true;
    },

    changeNullToNone(value) {
      return value === null || value === undefined ? "Ninguna" : value;
    },

    resetResults() {
      this.message = "";
      this.showMessage = false;
      this.showTableRecords = false;
      this.showInfoStudent = false;
    },

    async findStudent(e) {
      e.preventDefault();
      this.resetResults();
      const infoSearch = e.target.infoSearch.value;
      const typeSearch = e.target.typeSearch.value;
      const validation =
        typeSearch === "user"
          ? this.validateCurp(infoSearch)
          : this.validateNumberControl(infoSearch);

      if (!validation) {
        alert("Valida que la informacion sea correcta");
      } else {
        const endpoint = `${this.API}/registrationRecord/?${typeSearch}=${infoSearch}`;
        const res = await getData(endpoint);
        if (res.studentRecord) {
          this.recordStudent = {
            ...res.studentRecord,
            padecimiento: this.changeNullToNone(res.studentRecord.padecimiento),
            discapacidad: this.changeNullToNone(res.studentRecord.discapacidad),
          };
          this.showInfoStudent = true;
        } else {
          this.message = res.msg;
          this.showMessage = true;
        }
      }
    },

    validateCurp(value) {
      return value.toString().length === 18;
    },

    validateNumberControl(value) {
      return (
        typeof Number(value) === "number" && value.toString().length === 14
      );
    },

    formatDate(date) {
      return formatDateDB(date);
    },
  },

  template: `
    <section class="flex-column section-getSisae">

      <div class="form-double">
        <form v-on:submit="findRecords" class="flex-column form-records">
          <h4>Consultar últimos registros de la Base de Datos para carga al SISAE</h4>        
          <p>Se mostraran las siguientes matriculas a partir del numero que introduzcas a continuación.</p>
          <label for="matricula">Número:
            <input 
            name="matricula"
            type="number"
            placeholder="Introduce el numero de matricula..."
            >
          </label>
          <button>Buscar últimos registros</button>
        </form>

        <form v-on:submit="findStudent" class="flex-column form-records">
          <h4>Consultar registro de estudiante en la Base de Datos.</h4>
          <p>Selecciona como quieres buscar la información:</p>
          <label for="typeSearch">CURP
            <input 
            name="typeSearch"
            type="radio"
            value="user"
            >
          </label>
          <label for="typeSearch">Matricula
            <input 
            name="typeSearch"
            type="radio"
            value="numberControl"
            >
          </label>
          <input 
            name="infoSearch"
            type="text"
            placeholder="Introduce la información..."
          >
          <button>Consultar estudiante</button>
        </form>

      </div>

      <p v-if=showMessage class="message">
        {{ message }}
      </p>

      <div 
        v-if=showTableRecords
        class="table-responsive"
      >
        <table class="table">
        <thead>
          <tr>
            <th>Matricula</th>
            <th>CURP</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Nombre</th>
            <th>Telefono</th>
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
            <td>{{ record.telefono }}</td>
            <td>{{ record.calle }}</td>
            <td>{{ record.colonia }}</td>
            <td>{{ record.municipio_alcaldia }}</td>
            <td>{{ record.estado }}</td>
            <td>{{ record.cp }}</td>
          </tr>
        </tbody>
        </table> 
      </div>

      <div v-if=showInfoStudent class="list-responsive">
        <ul class="detail-list">
          <li><span>CURP:</span>{{ recordStudent.curp }}</li>
          <li><span>Nombre:</span>{{ recordStudent.nombre }}</li>
          <li><span>Apellido Paterno:</span>{{ recordStudent.apellido_paterno }}</li>
          <li><span>Apellido Materno:</span>{{ recordStudent.apellido_materno }}</li>
          <li><span>Fecha de nacimiento:</span>{{ formatDate(recordStudent.fecha_nacimiento) }}</li>
          <li><span>Correo Electrónico:</span>{{ recordStudent.email }}</li>
          <li><span>Telefono:</span>{{ recordStudent.telefono }}</li>
          <li><span>Sexo:</span>{{ recordStudent.sexo }}</li>
          <li><span>Escolaridad:</span>{{ recordStudent.escolaridad }}</li>
        </ul>
        <ul class="detail-list">
          <li><span>Matricula:</span>{{ recordStudent.numero_matricula }}</li>
          <li><span>Padecimiento:</span>{{ recordStudent.padecimiento }}</li>
          <li><span>Discapacidad:</span>{{ recordStudent.discapacidad }}</li>
          <li><span>Calle:</span>{{ recordStudent.calle }}</li>
          <li><span>Colonia:</span>{{ recordStudent.colonia }}</li>
          <li><span>Alcaldia:</span>{{ recordStudent.municipio_alcaldia }}</li>
          <li><span>CP:</span>{{ recordStudent.cp }}</li>
          <li><span>Estado:</span>{{ recordStudent.estado }}</li>
        </ul>
      </div>

    </section>
    `,
};

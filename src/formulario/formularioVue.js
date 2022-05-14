import newRegister from "./components/newRegister/index.js"

const app = Vue.createApp({
  data() {
    return {
      portada: "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes11.jpeg",
    
      image: [
          "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes11.jpeg",
          "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes16.jpeg",
          "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes18.jpg"
      ],

      estados: {
        AGUASCALIENTES: "AGUASCALIENTES",
        BAJA_CALIFORNIA: "BAJA_CALIFORNIA",
        BAJA_CALIFORNIA_SUR: "BAJA_CALIFORNIA_SUR",
        CAMPECHE: "CAMPECHE",
        COAHUILA: "COAHUILA",
        COLIMA: "COLIMA",
        CHIAPAS: "CHIAPAS",
        CHIHUAHUA: "CHIHUAHUA",
        DISTRITO_FEDERAL: "DISTRITO_FEDERAL",
        CDMX: "CDMX",
        DURANGO: "DURANGO",
        GUANAJUATO: "GUANAJUATO",
        GUERRERO: "GUERRERO",
        HIDALGO: "HIDALGO",
        JALISCO: "JALISCO",
        ESTADO_DE_MEXICO: "ESTADO_DE_MEXICO",
        NO_ESPECIFICADO: "NO_ESPECIFICADO",
        MICHOACAN: "MICHOACAN",
        MORELOS: "MORELOS",
        NAYARIT: "NAYARIT",
        NUEVO_LEON: "NUEVO_LEON",
        OAXACA: "OAXACA",
        PUEBLA: "PUEBLA",
        QUERETARO: "QUERETARO",
        QUINTANA_ROO: "QUINTANA_ROO",
        SAN_LUIS_POTOSI: "SAN_LUIS_POTOSI",
        SINALOA: "SINALOA",
        SONORA: "SONORA",
        TABASCO: "TABASCO",
        TAMAULIPAS: "TAMAULIPAS",
        TLAXCALA: "TLAXCALA",
        VERACRUZ: "VERACRUZ",
        YUCATAN: "YUCATAN",
        ZACATECAS: "ZACATECAS",
      },

      arrayEscolaridad:[
        "Primaria",
        "Primaria inconclusa",
        "Secundaria",
        "Secundaria incompleta",
        "Básico",
        "Medio Superior",
        "Medio Superior incompleto",
        "Superior incompleto",
        "Superior",
        "Maestria",
        "Doctorado",
        "Tecnico",
      ],

      text: "Tu nombre...",      
      styles:  {
        backgroundColor: "#e5e5e5"
      },
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
    prueba() {
      console.log("prueba para consulta de api")
    },

    async consult(valueMatricula, valueCurp) {
      const formData = new FormData();
      formData.set("matricula", valueMatricula)
      formData.set("curp", valueCurp.toUpperCase())
      const response = await send(formData);
      if (response.error) {
          preloader(result);
          console.log("Valores desde API: ", response)
          alert("Hay un error en la información capturada, por favor revisa e intenta nuevamente")
      } else {
          const container = consultSucessful(response);
          const storageResponse = JSON.stringify(response);
          sessionStorage.setItem("pre-registerStudent", storageResponse);        
          cleanInputs()                
          result.appendChild(container);
          preloader(result);
      }
    },

    isStudent(){
      console.log("Hola Vue, Si eres estudiante")
    },    

    input(e) {
      this.text = e.target.value;
    },
  },

  computed: {
    arrayEstados(){
      const newArray = []
      for (const key in this.estados) {
        if (Object.hasOwnProperty.call(this.estados, key)) {
          const element = this.estados[key];
          newArray.push(element)
        }
      }
      return newArray
    },

    fullName(){
      return this.firstName + " " + this.lastName;
    },
    label(){
      return this.open ? "cerrar" : " abrir";
    },
  },

  template: `
  <section>
    <h3>Formulario de inscripción</h3>
    
    <typeRegister></typeRegister>
    
    <newRegister></newRegister>

    <dbRegister></dbRegister>

    <updateRegister></updateRegister>
    
  </section>
    `,
})

app.component("typeRegister", {
  props: {

  },
  methods:{
    pruebaLog(){
      console.log("Hola Vue, Si eres estudiante");
    },
    fetchCURP(e){
      console.log(e.target);
      e.preventDefault();
    },
    curpVerify(e) {
      e.preventDefault()
      const nodeCurp = document.querySelector("#curp")
      const curpValue = nodeCurp.value;      
      if (curpValue.length === 18) {
        console.log("verificar CURP en API")
        this.$emit("prueba()")
      } else {
        console.log("corrige tu curp a 18 posiciones")
      }
      
      //const values = new FormData(formConsult);
      // const valueCurp = values.get("curpOnDB");      
      
      // if (valueCurp) {                       
      //         preloader(result);
      //         //fetch
      // } else {
      //   noValues();
      //   preloader(result);
      // }
    },
  },

  template: `
  <div class="typeRegister">
    <form v-on:submit="curpVerify">
    <label for="curp">Para iniciar tu pre-inscripcion, por favor ingresa lo siguiente: </label>
    <tagCurp></tagCurp>
    <button>Enviar</button>
    </form>      
    <p>Si no conoces tu curp, consultar https://www.gob.mx/curp/ para obtenerla</p>
  </div>
      `
    //<input type="text" id="curp" name="curp" placeholder="CURP...">
})

app.component("dbRegister", {
  template: `
  <div id="dbRegister" class="register registerHide">
      <button onclick="studentC13YES()" id="dbRegisterButton">NO he estado inscrito antes en el CECATI 13</button>
      <h4>Para identificarte, por favor ingresa tu CURP o el numero de control o matricula que te fue asignado:</h4>
      <form id="matriculaORcurp">
          <label for="curpOnDB">Captura tu CURP:</label>
          <input type="text" name="curpOnDB" id="curpOnDB" placeholder="Tu CURP...">
          <span>ó</span>
          <label for="matriculaOnDB">Captura tu número de control:</label>
          <input type="text" name="matriculaOnDB" id="matriculaOnDB" placeholder="Tu número de matrícula...">
          <input type="submit" value="Recuperar información"></input>
      </form>
      <div class="result__API"></div>
  </div>
  `
})

app.component("updateRegister", {
  template: `
  <div id="updateRegister" class="registerHide">
      <h4>¿Qué tipo de información deseas actualizar?</h4>
      <p id="updateContact">Presiona aqui si deseas actualizar tus datos de <b>Contacto</b>.</p>
      <form id="updateContact">
          <label for="updateEmail">Confirma o actualiza tu correo electrónico</label><span class="required">*</span>
          <input type="email" name="updateEmail" placeholder="tu correo electrónico...">
          <label for="updateTelefono">Confirma o actualiza tu número telefónico</label><span class="required">*</span>
          <input type="tel" name="updateTelefono" placeholder="Número Telefónico....">
          <p>Recuerda que la mayoria de los docentes crean grupos de WhatsApp para dar instrucciones a sus estudiantes, verifica que tus datos esten actualizados.</p>
      </form>
      <form id="updateForm">                
      <p id="updateAddress">Presiona aqui si deseas actualizar tu <b>Domicilio</b>.</p>
      <form action="">
          <label for="updateCalle">Calle y número</label><span class="required">*</span>
          <input type="text" id="updateCalle" name="updateCalle" placeholder="Calle y número...">
          <label for="updateColonia">Colonia</label><span class="required">*</span>
          <input type="text" id="updateColonia" name="updateColonia" placeholder="Colonia...">
          <label for="updateAlcaldia">Municipio o Alcaldía</label><span class="required">*</span>
          <input type="text" id=updateAalcaldia" name="updateAlcaldia" placeholder="Municipio o Alcaldía...">                
          <label for="updateCP">Código Postal</label><span class="required">*</span>
          <input type="number" id="updateCP" name="updateCP" placeholder="Código Postal...">
          <label for="updateEstado">Estado</label><span class="required">*</span>
          <input type="text" id="updateEstado" name="updateEstado" placeholder="Estado...">

          <label for="updateAddressCertificate">Adjuntar Comprobante de Domicilio</label>
          <input type="file" name="updateAddressCertificate">
      </form>
      <p id="updateSchool">Presiona aqui si deseas actualizar tu <b>maximo grado de estudios</b>.</p>
      <form action="">
          <label for="updateScholarship">Escolaridad</label>
          <input type="text" name="updateScholarship" id="updateScholarship" placeholder="Escribe el grado maximo de estudios.">
          <label for="updateStudiesCertificate">Adjuntar Comprobante de máximo grado de estudios</label>
          <input type="file" name="updateStudiesCertificate" >
      </form>
  </div>
  `
})

app.component("newRegister", {
  template: `
  <div id="newRegister" class="register">
    <button onclick="studentC13NO()">NO he estado inscrito antes en el CECATI 13</button>
    <h4>Por favor proporciona la siguiente información personal para tu inscripción</h4>
    <form id="dataGeneral">
      <tagCurp></tagCurp>
      <p>Los siguientes datos los usaremos para verificar que tu CURP sea correcta:</p>
      <label for="nombre">Nombre</label><span class="required">*</span>
      <input type="text" id="nombre" name="nombre" placeholder="Escribe tu nombre de pila...">
      <label for="a_paterno">Apellido Paterno</label><span class="required">*</span>
      <input type="text" id="a_paterno" name="a_paterno" placeholder="Tu apellido paterno...">
      <label for="a_materno">Apellido Materno</label><span class="required">*</span>
      <input type="text" id="a_materno" name="a_materno" placeholder="Tu apellido materno...">
      <label for="genero">Hombre 
          <input type="radio" id="genero" name="genero" value="MASCULINO">
      </label>
      <label for="genero">Mujer
          <input type="radio" id="genero" name="genero" value="FEMENINO">
      </label>
      <label for="birthday">Fecha de Nacimiento</label><span class="required">*</span>
      <input type="date" name="birthday" placeholder="Fecha de nacimiento...">
      <label for="estado">
          <span>Lugar de Nacimiento</span>
          <input list="estado">
          <datalist id="estado">
              <option v-for="item in estados" :key="item">{{ item }}</option>                
          </datalist>
      </label>
      <p class="Edad Minima">Lo sentimos, la edad minima para poder inscribirte a alguno de nuestros cursos es 15 años cumplidos</p>
      <label for="email">Correo Electrónico</label>
      <input type="email" name="email" placeholder="Escribe un correo electronico válido...">
      <label for="telefono">Teléfono</label><span class="required">*</span>
      <input type="tel" name="telefono" placeholder="Número Telefónico donde podamos contactarte...">
      <p>La mayoría de los docentes crean grupos de WhatsApp para dar instrucciones a sus estudiantes, por verifica que sea correcto.</p>
      <p>Domicilio.</p>
      <label for="calle">Calle y número</label><span class="required">*</span>
      <input type="text" id="calle" name="calle" placeholder="Calle y número...">
      <label for="colonia">Colonia</label><span class="required">*</span>
      <input type="text" id="colonia" name="colonia" placeholder="Colonia...">
      <label for="alcaldia">Municipio o Alcaldía</label><span class="required">*</span>
      <input type="text" id="alcaldia" name="alcaldia" placeholder="Municipio o Alcaldía...">
      <!-- https://copomex.com/#pricing-section por 330 para agilizar este tramite -->
      <label for="cp">Código Postal</label><span class="required">*</span>
      <input type="number" id="cp" name="cp" placeholder="Código Postal...">
      <label for="estado">Estado</label><span class="required">*</span>
      <input type="text" id="estado" name="estado" placeholder="Estado...">
      
      <label for="escolaridad">
          <span>Escolaridad</span>
          <select name="escolaridad" id="scholarship">            
            <option v-for="item in arrayEscolaridad" :key="item">{{ item }}</option>
          
      </label>

      <p>¿Presenta alguna discapacidad? <span class="required">*</span></p>
      <label for="disability">visual</label>
      <input type="radio" name="disability" id="" value="visual">
      <label for="disability">auditiva</label>
      <input type="radio" name="disability" id="" value="auditiva">
      <label for="disability">de comunicación</label>
      <input type="radio" name="disability" id="" value="comunicacion">
      <label for="disability">motriz</label>
      <input type="radio" name="disability" id="" value="motriz">
      <label for="disability">intelectual</label>
      <input type="radio" name="disability" id="" value="intelectual">
      <label for="disability">ninguna</label>
      <input type="radio" name="disability" id="" value="ninguna">
      <p>Documentos necesarios para tu inscripción:</p>
      <ul>
          <li>Acta de Nacimiento</li>                    
          <li>Comprobante de Domicilio</li>
          <li>Escolaridad</li>
      </ul>
      
      <label for="birthCertificate">Adjuntar Acta de Nacimiento</label>
      <input type="file" name="birthCertificate" >

      <label for="addressCertificate">Adjuntar Comprobante de Domicilio</label>
      <input type="file" name="addressCertificate" >

      <label for="studiesCertificate">Adjuntar Comprobante de máximo grado de estudios</label>
      <input type="file" name="studiesCertificate" >
      
      <p>Usaremos esta información para pre-inscribirte al curso, y contactarte si fuera necesario<span id="selectedCourse"></span></p>
      <input type="submit" value="Pre-inscribirse"></input>
    </form>
  </div>
  `
})

app.component("tagCurp", {
  template: `
  <label for="curp">CURP</label><span class="required">*</span>
  <input type="text" id="curp" name="curp" placeholder="CURP...">
  `
})

const vm = app.mount('#app');
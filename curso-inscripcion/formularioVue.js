const app = Vue.createApp({
  data() {
    return {
      //API: "https://backend-cursos-cecati13.uc.r.appspot.com/API/v1/students",
      API: "http://localhost:3000/API/V1",
      API_files: "http://svo-5-191.servidoresvirtuales.mx",
      //API_files: "http://localhost:3500",
      keyCourseStorage: "CourseCecati13",
      keyStudentStorage: "studentC13",       
      curso:{},
      MAX_SIZE_FILES: 3000000, // 3MB
      reactive: {
        studentDB: {
          update: false
        },
        newStudent:{},        
        ageRequeriment: true,        
        curp: "",        
      },
      infoCourseShow: true,
      isWelcome: true,
      isUserStudent: false,
      isNewStudent: false,
      confirmation: false,
      dataConfirmation: {}
    };
  },

  provide() {
    return {
      API: this.API,
      API_files: this.API_files,
      keyCourseStorage: this.keyCourseStorage,
      course: this.getCourse,
      reactive: this.reactive,
      MAX_SIZE_FILES: this.MAX_SIZE_FILES,
      dataConfirmation: this.dataConfirmation
    }
  },

  methods: {
    async consult(formData) {
      const API = `${this.API}/students/typeRegister`      
      const response = await this.sendData(formData, API);
      console.log("consult reponse desde API",response);
      if (response.error) {
        //preloader(result);        
        this.isWelcome = false;
        this.infoCourseShow = false;
        this.isNewStudent = true;
      } else if (response.message === "internal server error") {
        //error generalemente al hacer una primera consulta en SpreedSheets
        alert("Hubo un error en la comunicación al servidor, por favor vuelve a intentarlo. Si el error persiste intentalo mas tarde.")
      } else if (response.message === "Wrong Structure") {
        alert("La Estructura de la CURP es incorrecta, revisa y corrige la información")
      } else {
        //el usuario existe en nuestros registros
        const storageResponse = JSON.stringify(response);
        sessionStorage.setItem(this.keyStudentStorage, storageResponse);
        this.isStudent();        
        // preloader(result);
      }
    },   

    async inscription(objInscription) {
      let objLinksFiles = {};
      if (objInscription.formFiles) {
        const formFiles = objInscription.formFiles;
        const endpoint = `${this.API_files}/files`;
        const files = await this.sendFiles(formFiles, endpoint);
        objLinksFiles = {...files};
      }
      //*****Pendiente manejo de respuestas ante errores en Files Server */
      //************ */
      const objOfLinksFiles = {...objInscription.data, ...objLinksFiles}
      console.log(objOfLinksFiles);

      const objDataInscription = this.addCourseData(objOfLinksFiles);
      let endpoint = objInscription.db === true ?
        `${this.API}/students/DBStudent` :
        `${this.API}/students/newStudent/inscription`;

      const responseData = await this.sendData(objDataInscription, endpoint);
      console.log(responseData);
      this.isUserStudent = false;
      this.isNewStudent = false;
      if (responseData.status) {
        this.dataConfirmation.nombre = objDataInscription.nombre,
        this.dataConfirmation.matricula = responseData.matricula,
        this.dataConfirmation.fechaRegistro = responseData.fechaRegistro
      }      
      this.confirmation = true;
    },

    addCourseData(objInscription){
      const dataCourse = JSON.parse(sessionStorage.getItem(this.keyCourseStorage));
      //sessionStorage
      const inscriptionMoreCourse = {
        ...objInscription,
        ...dataCourse
      };
      return inscriptionMoreCourse;   
    },

    async sendFiles(formFiles, API){
      const response = await fetch( API, {
        method: "post",        
        //si vamos a subir archivos, se debe usar el formData, y no el json y quitar el headers
        body: formFiles
      })
      const info = await response.json()
      return info
    },

    async sendData(obj, API){
      const response = await fetch( API, {
        method: "POST",
        headers: {
          //"Content-Type": "multipart/form-data"
          "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
      })
      return response.json()
    },

    isStudent(){
      console.log("Bienvenido, Ya tenemos tus datos registrados de un curso anterior")
      const dataSaveStudent = JSON.parse(sessionStorage.getItem(this.keyStudentStorage));
      this.reactive.studentDB = {
        ...dataSaveStudent
      }
      this.isWelcome = false;
      this.infoCourseShow = false;
      this.isUserStudent = true;
      //copiar datos de estudiante en session Storage a variable studentDB
    },        
  },

  computed: {
    getCourse(){
      const getItem = sessionStorage.getItem(this.keyCourseStorage);
      if (!getItem) {        
        window.location.href = "/cursos"
        //Si no se ha selecionado un curso redireccionar a /cursos
      }
      const courseInfo = JSON.parse(getItem);      
      this.curso = courseInfo;
      return courseInfo;
    },
  },

  template: `
  <section>
    <h3>Formulario de inscripción</h3>

    <v-course 
      id="header__course"
      v-if="infoCourseShow"
    />

    <v-typeRegister
      v-on:consultCURP="consult"
      v-if="isWelcome"
    />

    <v-dbRegister
      v-if="isUserStudent"
      v-on:eventInscription="inscription"
    />
    
    <v-newRegister
      v-if="isNewStudent"
      v-on:eventInscription="inscription"
    />

    <v-confirmation
      v-if="confirmation"
    />

    </section>
    `,

})

app.component("v-typeRegister", {
  inject: ["reactive"],
  methods:{
    curpVerify(e) {
      e.preventDefault()      
      const nodeCurp = document.querySelector("#valueCurp")
      const curpValue = nodeCurp.value;      
      if (curpValue.length === 18) {        
        const objCurp = {
          curp: curpValue
        }
        this.reactive.curp = curpValue;
        this.$emit("consultCURP", objCurp);
      } else {
        alert("Revisa que tu CURP este completa. Deben ser 18 posiciones")        
      }      
    },
  
  },

  template: `
  <div class="typeRegister">
    <form v-on:submit="curpVerify">
    <label for="curp">Para continuar por favor ingresa </label>
    <v-tagCurp/>
    <button>Enviar</button>
    </form>
    <p>Si no conoces tu curp, consultar <a href="https://www.gob.mx/curp/">https://www.gob.mx/curp/</a> para obtenerla</p>
  </div>
      `
    //<input type="text" id="curp" name="curp" placeholder="CURP...">
})

app.component("v-dbRegister", {
  inject: ["API", "reactive"],
  
  data(){
    return {
      showInscription: true,      
    }
  },

  methods : {
    showUpdateFieldOnly() {
      this.showInscription = !this.showInscription
    },

    updateProperties(object) {
      this.reactive.studentDB.update = true;
      this.saveDataStudentDB(object);
    },

    saveDataStudentDB(object) {
      for (const key in object) {
        const element = object[key];
        Object.defineProperty(this.reactive.studentDB, key, {
          value: element,
          writable: true,
          configurable: false,
          enumerable: true
        });
      }
    },
    
    async inscription() {
      const data ={
        ...this.reactive.studentDB
      };
      const formFiles = new FormData;
      formFiles.append("curp", this.reactive.studentDB.curp);
      const objInscription = {
        data,
        formFiles,
        db: true,
        files: 0
      }
      
      if(objInscription.data.update){
        for (const key in objInscription.data) {
          const element = objInscription.data[key];
          if (typeof(element) === "object") {
            objInscription.files = + 1;
            //si es "object" es un archivo (File)
            formFiles.append(key, objInscription.data[key]);
            delete objInscription.data[key];
          }
        }       
      }
      
      if (objInscription.files === 0) {
        delete objInscription.formFiles;
      }
      delete objInscription.files;
      this.$emit("eventInscription", objInscription);
    }

  },


  template: `  
  <div 
    v-if="showInscription"    
    class="result__API register">
      <h4>Bienvenido a un nuevo curso en CECATI 13, {{ reactive.studentDB.nombre }} {{reactive.studentDB.a_paterno}}</h4>
      <p>Por favor verifica que la siguiente información en nuestro sistema correspondan a tú registro.</p>
      <p>Por tú seguridad, ocultamos parte de la información que a continuación te pedimos que verifiques</p>
      
      <br>

      <p>Correo electrónico registrado: {{ reactive.studentDB.email }}</p>
      <p>Numero telefónico:  {{ reactive.studentDB.telefono }}</p>
      
      <br>
    
      <v-course></v-course>
      <p>Si deseas continuar con tu inscripción presiona el siguiente boton</p>
      <button
        v-on:click="inscription">
          Pre-inscribir
      </button>
  </div>

  <v-updateRegister
    v-on:showUpdateFieldOnly="showUpdateFieldOnly"
    v-on:updateProperties="updateProperties"
  />    
  ` 
})

app.component("v-newRegister", {
  inject: ["reactive"],
  data: function() {
    return {
      showData: {},
      componentDataGeneral: true,
      componentFirstRegister: false,
      registerCompleted: false,
    }
  },

  methods: {
    continueFirstRegister(object){
      this.saveDataNewRegister(object)
      this.componentDataGeneral = false;
      this.componentFirstRegister = true;
    },
    firstRegisterCompleted(object){
      this.saveDataNewRegister(object)
      this.componentFirstRegister = false;
      this.registerCompleted = true;
      console.log("scholarshipDetailCompleted. Object:")
      console.log("Valor de new.student: ", this.reactive.newStudent)
      console.log("finalizando: firstRegisterCompleted, valor de registerCompleted", this.registerCompleted)
    },

    saveDataNewRegister(object) {
      for (const key in object) {        
        const element = object[key];
        if (this.reactive.newStudent[key] === undefined) {
          Object.defineProperty(this.reactive.newStudent, key, {
            value: element,
            writable: true,
            configurable: false,
            enumerable: true
          });        
        } else {
          this.reactive.newStudent[key] = object[key]
        }
        
      }
      console.log("valores de newStudent despues de actualizar", this.reactive.newStudent)
    },

    eventInscription(objInscription){
      console.log("El eventInscription esta en newRegister", objInscription)
      this.$emit("eventInscription", objInscription)
    }
  },

  template: `
  <section id="newRegister" class="register">
    <v-dataGeneral
    v-if="componentDataGeneral"
      v-on:continueFirstRegister="continueFirstRegister"
    />
    
    <v-firstRegister
      v-if="componentFirstRegister"
      v-on:firstRegisterCompleted="firstRegisterCompleted"
      v-on:saveData="saveDataNewRegister"
    />    

    <v-inscription-newRegister
      v-if="registerCompleted"
      v-on:saveData="saveDataNewRegister"
      v-on:eventInscription="eventInscription"
    />
  </section>
  `
})
    
app.component("v-dataGeneral", {
  inject: ["API", "reactive", "MAX_SIZE_FILES"],
  data(){
    return {
      passesAgeRequirement: false,
      estadoNacimiento: {
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
      }
    }
  }, 

  methods: {
    isAgeOver15(e){
      const date = e.target.value;
      const dateNow = new Date();
      const yearNow = parseInt(dateNow.getFullYear());
      const monthNow = parseInt(dateNow.getMonth()) + 1;
      const dayNow = parseInt(dateNow.getDate());

      // YYYY-MM-DD
      const birthYear = parseInt(String(date).substring(0, 4));
      const birthMonth = parseInt(String(date).substring(5, 7));
      const birthDay = parseInt(String(date).substring(8, 10));

      let age = yearNow - birthYear;
      if (monthNow < birthMonth) {
          age--;
      } else if (monthNow === birthMonth) {
          if (dayNow < birthDay) {
              age--;
          }
      }
      
      if (age <= 15) {
        this.reactive.ageRequeriment = false;
      } else {
        this.reactive.ageRequeriment = true;
        this.passesAgeRequirement = true;
      }
    },

    async verifyDataGeneral(e){
      e.preventDefault();
      const curp = e.target.children['curp'].value
      const birthday = e.target.children['birthday'].value      
      const nombre = e.target.children['nombre'].value
      const a_paterno = e.target.children['a_paterno'].value
      const a_materno = e.target.children['a_materno'].value
      const nodePlaceOfBirth = document.getElementById("placeOfBirth")
      const placeOfBirth = nodePlaceOfBirth.value
      const genero = document.getElementById("genero")
      let gender
      if (genero.checked && genero.value ==="MASCULINO") {
        gender = "MASCULINO"
      } else {
        gender = "FEMENINO"
      }
      
      const birthCertificate = e.target.children["birthCertificate"].files[0]
      const birthCertificateBlob = URL.createObjectURL(e.target.children["birthCertificate"].files[0]);
      

      const dataFORM = {
        curp: curp,
        fechaNacimiento: birthday,
        nombre: nombre,
        a_paterno: a_paterno,
        a_materno: a_materno,
        estado: placeOfBirth,
        genero: gender,
        actaNacimientoRender: birthCertificateBlob
      }
      
      if (birthCertificate.size > `${this.MAX_SIZE_FILES}`) {
        alert("El archivo tiene que ser menor a 3MB")
      } else {
        const responseFile = await this.sendDataGeneralForm(dataFORM)        
        if (responseFile.responseObj !== undefined ) {
          //temporalmente añadir el blob al objeto de acta de nacimiento
          Object.defineProperty(this.reactive.newStudent, "actaNacimiento", {
            value: birthCertificate,
            writable: true,
            configurable: false,
            enumerable: true
          })          
          console.log("continuar inscripcion", responseFile);
          this.$emit("continueFirstRegister", responseFile.responseObj)
          //VERIFICAR SI USUARIO CAMBIO LA CURP Y VERIFICAR QUE NO ESTE INSCRITO EN EL SISTEMA
        } else if (responseFile.curp == "false") {
          console.log("La CURP no corresponde con los datos enviados. Verifica la información.")
          alert("Error. Verifica la información.")
        } else {
          console.log("no se ha obtenido respuesta del servidor")
        }
      }
    },

    async sendDataGeneralForm(formData){
      //falta trabajar que sea solo uan funcion global para hacer fetch, y solo generar enpoints con su data a enviar      
      const endpoint = `${this.API}/students/newStudent/dataGeneral`;      
      const response = await fetch( endpoint, {
        method: "post",
        headers: {          
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      const info = await response.json()      
      return info
    }   
  },
  
  template: `
  <form class="dataGeneral" v-on:submit="verifyDataGeneral" name="dataGeneral">
    <v-tagCurp/>
    <h4>Para Verificar que tú CURP sea correcta por favor proporciona los siguientes datos personales:</h4>
    <label for="birthday">Fecha de Nacimiento</label><span class="required">*</span>
    <input
      id="birthdate"
      type="date" name="birthday" 
      placeholder="Fecha de nacimiento..."
      v-on:input="isAgeOver15"
    >
    <p v-if="!reactive.ageRequeriment">
      Lo sentimos, la edad minima para poder inscribirte a alguno de nuestros cursos es 15 años cumplidos
    </p>
    <label for="nombre">Nombre</label><span class="required">*</span>
    <input type="text" name="nombre" placeholder="Escribe tu nombre de pila...">

    <label for="a_paterno">Apellido Paterno</label><span class="required">*</span>
    <input type="text" name="a_paterno" placeholder="Tu apellido paterno...">

    <label for="a_materno">Apellido Materno</label><span class="required">*</span>
    <input type="text" name="a_materno" placeholder="Tu apellido materno...">
    
    <label for="genero" name="MASCULINO">Hombre 
        <input type="radio" value="MASCULINO" name="genero" id="genero">
    </label>
    <label for="genero" name="FEMENINO">Mujer
        <input type="radio" value="FEMENINO" name="genero">
    </label>
    <br>
    <label for="estado">
      <span>Lugar de Nacimiento</span>
      <select name="estado" id="placeOfBirth">
        <option v-for="item in estadoNacimiento" :key="item">{{ item }}</option>
    </label>
    <label for="birthCertificate">Adjuntar Acta de Nacimiento</label>
    <input 
      type="file" 
      name="birthCertificate" 
       
      accept=".jpg, .jpeg, .pdf" 
      capture="environment"
    >

    <v-button v-if="passesAgeRequirement"></v-button>
  </form>
  `
})

app.component("v-contact", {

  methods:{
    contactDetailCompleted(e){
      e.preventDefault()
      const email = e.target.children['email'].value
      const phone = e.target.children['telefono'].value
      const expReg= /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
      const validateEmail = expReg.test(email)
      if (phone.length >= 10 && validateEmail) {        
        const objContact = {
          email: email,
          telefono: phone
        }
        this.$emit("contactDetailCompleted", objContact)
      } else {
        console.log("verificar telefono o email")
        alert("Error. Verifica que tu teléfono y correo electrónico sean correctos.")
      }
    }
  },

  template: `
  <form v-on:submit="contactDetailCompleted">
    <h4>Datos de contacto:</h4>
    <label for="email">Correo Electrónico</label>
    <input type="email" name="email" placeholder="Escribe un correo electronico válido...">
    <label for="telefono">Teléfono</label><span class="required">*</span>
    <input type="tel" name="telefono" placeholder="Número Telefónico donde podamos contactarte...">
    <p>La mayoría de los docentes crean grupos de WhatsApp para dar instrucciones a sus estudiantes, por verifica que sea correcto.</p>
    <v-button></v-button>
  </form>
  `
})

app.component("v-address", {
  data(){
    return {
      estadoRepublica: "Aguascalientes",
      valueEstado: {
        "Aguascalientes": ["Aguascalientes","Asientos","Calvillo","Cosio","El Llano","Jesus Maria","Pabellon de Arteaga","Rincon de Romos","San Francisco de los Romo","San Jose de Gracia","Tepezala"],
        "Baja California": ["Ensenada","Mexicali","Playas de Rosarito","Tecate","Tijuana"],
        "Baja California Sur": ["Comondu","La Paz","Loreto","Los Cabos","Mulege"],
        "Campeche": ["Calakmul","Calkini","Campeche","Candelaria","Carmen","Champoton","Escarcega","Hecelchakan","Hopelchen","Palizada","Tenabo"],
        "Coahuila": ["Abasolo","Acuna","Allende","Arteaga","Candela","Castanos","Cuatro Cienegas","Escobedo","Francisco I. Madero","Frontera","General Cepeda","Guerrero","Hidalgo","Jimenez","Juarez","Lamadrid","Matamoros","Monclova","Morelos","Muzquiz","Nadadores","Nava","Ocampo","Parras","Piedras Negras","Progreso","Ramos Arizpe","Sabinas","Sacramento","Saltillo","San Buenaventura","San Juan de Sabinas","San Pedro","Sierra Mojada","Torreon","Viesca","Villa Union","Zaragoza"],
        "Colima": ["Armeria","Colima","Comala","Coquimatlan","Cuauhtemoc","Ixtlahuacan","Manzanillo","Minatitlan","Tecoman","Villa de Alvarez"],
        "Chiapas": ["Acacoyagua","Acala","Acapetahua","Aldama","Altamirano","Amatenango de la Frontera","Amatenango del Valle","Amatan","Angel Albino Corzo","Arriaga","Bejucal de Ocampo","Bella Vista","Benemerito de las Americas","Berriozabal","Bochil","Cacahoatan","Capitan Luis Angel Vidal","Catazaja","Chalchihuitan","Chamula","Chanal","Chapultenango","Chenalho","Chiapa de Corzo","Chiapilla","Chicoasen","Chicomuselo","Chilon","Cintalapa","Coapilla","Comitan de Dominguez","Copainala","El Bosque","El Parral","El Porvenir","Emiliano Zapata","Escuintla","Francisco Leon","Frontera Comalapa","Frontera Hidalgo","Huehuetan","Huitiupan","Huixtla","Huixtan","Ixhuatan","Ixtacomitan","Ixtapa","Ixtapangajoya","Jiquipilas","Jitotol","Juarez","La Concordia","La Grandeza","La Independencia","La Libertad","La Trinitaria","Larrainzar","Las Margaritas","Las Rosas","Mapastepec","Maravilla Tenejapa","Marques de Comillas","Mazapa de Madero","Mazatan","Metapa","Mezcalapa","Mitontic","Montecristo de Guerrero","Motozintla","Nicolas Ruiz","Ocosingo","Ocotepec","Ocozocoautla de Espinosa","Ostuacan","Osumacinta","Oxchuc","Palenque","Pantelho","Pantepec","Pichucalco","Pijijiapan","Pueblo Nuevo Solistahuacan","Rayon","Reforma","Rincon Chamula San Pedro","Sabanilla","Salto de Agua","San Andres Duraznal","San Cristobal de las Casas","San Fernando","San Juan Cancuc","San Lucas","Santiago el Pinar","Siltepec","Simojovel","Sitala","Socoltenango","Solosuchiapa","Soyalo","Suchiapa","Suchiate","Sunuapa","Tapachula","Tapalapa","Tapilula","Tecpatan","Tenejapa","Teopisca","Tila","Tonala","Totolapa","Tumbala","Tuxtla Chico","Tuxtla Gutierrez","Tuzantan","Tzimol","Union Juarez","Venustiano Carranza","Villa Comaltitlan","Villa Corzo","Villaflores","Yajalon","Zinacantan"],
        "Chihuahua": ["Ahumada","Aldama","Allende","Aquiles Serdan","Ascension","Bachiniva","Balleza","Batopilas de Manuel Gomez Morin","Bocoyna","Buenaventura","Camargo","Carichi","Casas Grandes","Chihuahua","Chinipas","Coronado","Coyame del Sotol","Cuauhtemoc","Cusihuiriachi","Delicias","Dr. Belisario Dominguez","El Tule","Galeana","Gran Morelos","Guachochi","Guadalupe y Calvo","Guadalupe","Guazapares","Guerrero","Gomez Farias","Hidalgo del Parral","Huejotitan","Ignacio Zaragoza","Janos","Jimenez","Julimes","Juarez","La Cruz","Lopez","Madera","Maguarichi","Manuel Benavides","Matachi","Matamoros","Meoqui","Morelos","Moris","Namiquipa","Nonoava","Nuevo Casas Grandes","Ocampo","Ojinaga","Praxedis G. Guerrero","Riva Palacio","Rosales","Rosario","San Francisco de Borja","San Francisco de Conchos","San Francisco del Oro","Santa Barbara","Santa Isabel","Satevo","Saucillo","Temosachic","Urique","Uruachi","Valle de Zaragoza"],
        "Ciudad de Mexico": ["Alvaro Obregón","Azcapotzalco","Benito Juárez","Coyoacán","Cuajimalpa de Morelos","Cuahutémoc","Gustavo A. Madero","Iztacalco","Iztapalapa","La Magdalena Contreras","Miguel Hidalgo","Milpa Alta","Tlalpan","Tláhuac","Venustiano Carranza","Xochimilco"],
        "Durango": ["Canatlan","Canelas","Coneto de Comonfort","Cuencame","Durango","El Oro","General Simon Bolivar","Gomez Palacio","Guadalupe Victoria","Guanacevi","Hidalgo","Inde","Lerdo","Mapimi","Mezquital","Nazas","Nombre de Dios","Nuevo Ideal","Ocampo","Otaez","Panuco de Coronado","Penon Blanco","Poanas","Pueblo Nuevo","Rodeo","San Bernardo","San Dimas","San Juan de Guadalupe","San Juan del Rio","San Luis del Cordero","San Pedro del Gallo","Santa Clara","Santiago Papasquiaro","Suchil","Tamazula","Tepehuanes","Tlahualilo","Topia","Vicente Guerrero"],
        "Guanajuato": ["Abasolo","Acambaro","Apaseo el Alto","Apaseo el Grande","Atarjea","Celaya","Comonfort","Coroneo","Cortazar","Cueramaro","Doctor Mora","Dolores Hidalgo Cuna de la Independencia Nacional","Guanajuato","Huanimaro","Irapuato","Jaral del Progreso","Jerecuaro","Leon","Manuel Doblado","Moroleon","Ocampo","Penjamo","Pueblo Nuevo","Purisima del Rincon","Romita","Salamanca","Salvatierra","San Diego de la Union","San Felipe","San Francisco del Rincon","San Jose Iturbide","San Luis de la Paz","San Miguel de Allende","Santa Catarina","Santa Cruz de Juventino Rosas","Santiago Maravatio","Silao de la Victoria","Tarandacuao","Tarimoro","Tierra Blanca","Uriangato","Valle de Santiago","Victoria","Villagran","Xichu","Yuriria"],
        "Guerrero": ["Acapulco de Juarez","Acatepec","Ahuacuotzingo","Ajuchitlan del Progreso","Alcozauca de Guerrero","Alpoyeca","Apaxtla","Arcelia","Atenango del Rio","Atlamajalcingo del Monte","Atlixtac","Atoyac de Alvarez","Ayutla de los Libres","Azoyu","Benito Juarez","Buenavista de Cuellar","Chilapa de Alvarez","Chilpancingo de los Bravo","Coahuayutla de Jose Maria Izazaga","Cochoapa el Grande","Cocula","Copala","Copalillo","Copanatoyac","Coyuca de Benitez","Coyuca de Catalan","Cuajinicuilapa","Cualac","Cuautepec","Cuetzala del Progreso","Cutzamala de Pinzon","Eduardo Neri","Florencio Villarreal","General Canuto A. Neri","General Heliodoro Castillo","Huamuxtitlan","Huitzuco de los Figueroa","Iguala de la Independencia","Igualapa","Iliatenco","Ixcateopan de Cuauhtemoc","Jose Joaquin de Herrera","Juan R. Escudero","Juchitan","La Union de Isidoro Montes de Oca","Leonardo Bravo","Malinaltepec","Marquelia","Martir de Cuilapan","Metlatonoc","Mochitlan","Olinala","Ometepec","Pedro Ascencio Alquisiras","Petatlan","Pilcaya","Pungarabato","Quechultenango","San Luis Acatlan","San Marcos","San Miguel Totolapan","Taxco de Alarcon","Tecoanapa","Tecpan de Galeana","Teloloapan","Tepecoacuilco de Trujano","Tetipac","Tixtla de Guerrero","Tlacoachistlahuaca","Tlacoapa","Tlalchapa","Tlalixtaquilla de Maldonado","Tlapa de Comonfort","Tlapehuala","Xalpatlahuac","Xochihuehuetlan","Xochistlahuaca","Zapotitlan Tablas","Zihuatanejo de Azueta","Zirandaro","Zitlala"],
        "Hidalgo": ["Acatlan","Acaxochitlan","Actopan","Agua Blanca de Iturbide","Ajacuba","Alfajayucan","Almoloya","Apan","Atitalaquia","Atlapexco","Atotonilco de Tula","Atotonilco el Grande","Calnali","Cardonal","Chapantongo","Chapulhuacan","Chilcuautla","Cuautepec de Hinojosa","El Arenal","Eloxochitlan","Emiliano Zapata","Epazoyucan","Francisco I. Madero","Huasca de Ocampo","Huautla","Huazalingo","Huehuetla","Huejutla de Reyes","Huichapan","Ixmiquilpan","Jacala de Ledezma","Jaltocan","Juarez Hidalgo","La Mision","Lolotla","Metepec","Metztitlan","Mineral de la Reforma","Mineral del Chico","Mineral del Monte","Mixquiahuala de Juarez","Molango de Escamilla","Nicolas Flores","Nopala de Villagran","Omitlan de Juarez","Pachuca de Soto","Pacula","Pisaflores","Progreso de Obregon","San Agustin Metzquititlan","San Agustin Tlaxiaca","San Bartolo Tutotepec","San Felipe Orizatlan","San Salvador","Santiago Tulantepec de Lugo Guerrero","Santiago de Anaya","Singuilucan","Tasquillo","Tecozautla","Tenango de Doria","Tepeapulco","Tepehuacan de Guerrero","Tepeji del Rio de Ocampo","Tepetitlan","Tetepango","Tezontepec de Aldama","Tianguistengo","Tizayuca","Tlahuelilpan","Tlahuiltepa","Tlanalapa","Tlanchinol","Tlaxcoapan","Tolcayuca","Tula de Allende","Tulancingo de Bravo","Villa de Tezontepec","Xochiatipan","Xochicoatlan","Yahualica","Zacualtipan de Angeles","Zapotlan de Juarez","Zempoala","Zimapan"],
        "Jalisco": ["Acatic","Acatlan de Juarez","Ahualulco de Mercado","Amacueca","Amatitan","Ameca","Arandas","Atemajac de Brizuela","Atengo","Atenguillo","Atotonilco el Alto","Atoyac","Autlan de Navarro","Ayotlan","Ayutla","Bolanos","Cabo Corrientes","Canadas de Obregon","Casimiro Castillo","Chapala","Chimaltitan","Chiquilistlan","Cihuatlan","Cocula","Colotlan","Concepcion de Buenos Aires","Cuautitlan de Garcia Barragan","Cuautla","Cuquio","Degollado","Ejutla","El Arenal","El Grullo","El Limon","El Salto","Encarnacion de Diaz","Etzatlan","Gomez Farias","Guachinango","Guadalajara","Hostotipaquillo","Huejucar","Huejuquilla el Alto","Ixtlahuacan de los Membrillos","Ixtlahuacan del Rio","Jalostotitlan","Jamay","Jesus Maria","Jilotlan de los Dolores","Jocotepec","Juanacatlan","Juchitlan","La Barca","La Huerta","La Manzanilla de la Paz","Lagos de Moreno","Magdalena","Mascota","Mazamitla","Mexticacan","Mezquitic","Mixtlan","Ocotlan","Ojuelos de Jalisco","Pihuamo","Poncitlan","Puerto Vallarta","Quitupan","San Cristobal de la Barranca","San Diego de Alejandria","San Gabriel","San Ignacio Cerro Gordo","San Juan de los Lagos","San Juanito de Escobedo","San Julian","San Marcos","San Martin Hidalgo","San Martin de Bolanos","San Miguel el Alto","San Pedro Tlaquepaque","San Sebastian del Oeste","Santa Maria de los Angeles","Santa Maria del Oro","Sayula","Tala","Talpa de Allende","Tamazula de Gordiano","Tapalpa","Tecalitlan","Techaluta de Montenegro","Tecolotlan","Tenamaxtlan","Teocaltiche","Teocuitatlan de Corona","Tepatitlan de Morelos","Tequila","Teuchitlan","Tizapan el Alto","Tlajomulco de Zuniga","Toliman","Tomatlan","Tonala","Tonaya","Tonila","Totatiche","Tototlan","Tuxcacuesco","Tuxcueca","Tuxpan","Union de San Antonio","Union de Tula","Valle de Guadalupe","Valle de Juarez","Villa Corona","Villa Guerrero","Villa Hidalgo","Villa Purificacion","Yahualica de Gonzalez Gallo","Zacoalco de Torres","Zapopan","Zapotiltic","Zapotitlan de Vadillo","Zapotlan del Rey","Zapotlan el Grande","Zapotlanejo"],
        "Estado de Mexico": ["Acambay de Ruiz Castaneda","Acolman","Aculco","Almoloya de Alquisiras","Almoloya de Juarez","Almoloya del Rio","Amanalco","Amatepec","Amecameca","Apaxco","Atenco","Atizapan de Zaragoza","Atizapan","Atlacomulco","Atlautla","Axapusco","Ayapango","Calimaya","Capulhuac","Chalco","Chapa de Mota","Chapultepec","Chiautla","Chicoloapan","Chiconcuac","Chimalhuacan","Coacalco de Berriozabal","Coatepec Harinas","Cocotitlan","Coyotepec","Cuautitlan Izcalli","Cuautitlan","Donato Guerra","Ecatepec de Morelos","Ecatzingo","El Oro","Huehuetoca","Hueypoxtla","Huixquilucan","Isidro Fabela","Ixtapaluca","Ixtapan de la Sal","Ixtapan del Oro","Ixtlahuaca","Jaltenco","Jilotepec","Jilotzingo","Jiquipilco","Jocotitlan","Joquicingo","Juchitepec","La Paz","Lerma","Luvianos","Malinalco","Melchor Ocampo","Metepec","Mexicaltzingo","Morelos","Naucalpan de Juarez","Nextlalpan","Nezahualcoyotl","Nicolas Romero","Nopaltepec","Ocoyoacac","Ocuilan","Otumba","Otzoloapan","Otzolotepec","Ozumba","Papalotla","Polotitlan","Rayon","San Antonio la Isla","San Felipe del Progreso","San Jose del Rincon","San Martin de las Piramides","San Mateo Atenco","San Simon de Guerrero","Santo Tomas","Soyaniquilpan de Juarez","Sultepec","Tecamac","Tejupilco","Temamatla","Temascalapa","Temascalcingo","Temascaltepec","Temoaya","Tenancingo","Tenango del Aire","Tenango del Valle","Teoloyucan","Teotihuacan","Tepetlaoxtoc","Tepetlixpa","Tepotzotlan","Tequixquiac","Texcaltitlan","Texcalyacac","Texcoco","Tezoyuca","Tianguistenco","Timilpan","Tlalmanalco","Tlalnepantla de Baz","Tlatlaya","Toluca","Tonanitla","Tonatico","Tultepec","Tultitlan","Valle de Bravo","Valle de Chalco Solidaridad","Villa Guerrero","Villa Victoria","Villa de Allende","Villa del Carbon","Xalatlaco","Xonacatlan","Zacazonapan","Zacualpan","Zinacantepec","Zumpahuacan","Zumpango"],
        "Michoacan": ["Acuitzio","Aguililla","Alvaro Obregon","Angamacutiro","Angangueo","Apatzingan","Aporo","Aquila","Ario","Arteaga","Brisenas","Buenavista","Caracuaro","Charapan","Charo","Chavinda","Cheran","Chilchota","Chinicuila","Chucandiro","Churintzio","Churumuco","Coahuayana","Coalcoman de Vazquez Pallares","Coeneo","Cojumatlan de Regules","Contepec","Copandaro","Cotija","Cuitzeo","Ecuandureo","Epitacio Huerta","Erongaricuaro","Gabriel Zamora","Hidalgo","Huandacareo","Huaniqueo","Huetamo","Huiramba","Indaparapeo","Irimbo","Ixtlan","Jacona","Jimenez","Jiquilpan","Jose Sixto Verduzco","Juarez","Jungapeo","La Huacana","La Piedad","Lagunillas","Lazaro Cardenas","Los Reyes","Madero","Maravatio","Marcos Castellanos","Morelia","Morelos","Mugica","Nahuatzen","Nocupetaro","Nuevo Parangaricutiro","Nuevo Urecho","Numaran","Ocampo","Pajacuaran","Panindicuaro","Paracho","Paracuaro","Patzcuaro","Penjamillo","Periban","Purepero","Puruandiro","Querendaro","Quiroga","Sahuayo","Salvador Escalante","San Lucas","Santa Ana Maya","Senguio","Susupuato","Tacambaro","Tancitaro","Tangamandapio","Tangancicuaro","Tanhuato","Taretan","Tarimbaro","Tepalcatepec","Tingambato","Tinguindin","Tiquicheo de Nicolas Romero","Tlalpujahua","Tlazazalca","Tocumbo","Tumbiscatio","Turicato","Tuxpan","Tuzantla","Tzintzuntzan","Tzitzio","Uruapan","Venustiano Carranza","Villamar","Vista Hermosa","Yurecuaro","Zacapu","Zamora","Zinaparo","Zinapecuaro","Ziracuaretiro","Zitacuaro"],
        "Morelos": ["Amacuzac","Atlatlahucan","Axochiapan","Ayala","Coatlan del Rio","Cuautla","Cuernavaca","Emiliano Zapata","Huitzilac","Jantetelco","Jiutepec","Jojutla","Jonacatepec de Leandro Valle","Mazatepec","Miacatlan","Ocuituco","Puente de Ixtla","Temixco","Temoac","Tepalcingo","Tepoztlan","Tetecala","Tetela del Volcan","Tlalnepantla","Tlaltizapan de Zapata","Tlaquiltenango","Tlayacapan","Totolapan","Xochitepec","Yautepec","Yecapixtla","Zacatepec","Zacualpan de Amilpas"],
        "Nayarit": ["Acaponeta","Ahuacatlan","Amatlan de Canas","Bahia de Banderas","Compostela","Del Nayar","Huajicori","Ixtlan del Rio","Jala","La Yesca","Rosamorada","Ruiz","San Blas","San Pedro Lagunillas","Santa Maria del Oro","Santiago Ixcuintla","Tecuala","Tepic","Tuxpan","Xalisco"],
        "Nuevo Leon": ["Abasolo","Agualeguas","Allende","Anahuac","Apodaca","Aramberri","Bustamante","Cadereyta Jimenez","Cerralvo","China","Cienega de Flores","Doctor Arroyo","Doctor Coss","Doctor Gonzalez","El Carmen","Galeana","Garcia","General Bravo","General Escobedo","General Teran","General Trevino","General Zaragoza","General Zuazua","Guadalupe","Hidalgo","Higueras","Hualahuises","Iturbide","Juarez","Lampazos de Naranjo","Linares","Los Aldamas","Los Herreras","Los Ramones","Marin","Melchor Ocampo","Mier y Noriega","Mina","Montemorelos","Monterrey","Paras","Pesqueria","Rayones","Sabinas Hidalgo","Salinas Victoria","San Nicolas de los Garza","San Pedro Garza Garcia","Santa Catarina","Santiago","Vallecillo","Villaldama"],
        "Oaxaca": ["Abejones","Acatlan de Perez Figueroa","Animas Trujano","Asuncion Cacalotepec","Asuncion Cuyotepeji","Asuncion Ixtaltepec","Asuncion Nochixtlan","Asuncion Ocotlan","Asuncion Tlacolulita","Ayoquezco de Aldama","Ayotzintepec","Calihuala","Candelaria Loxicha","Capulalpam de Mendez","Chahuites","Chalcatongo de Hidalgo","Chiquihuitlan de Benito Juarez","Cienega de Zimatlan","Ciudad Ixtepec","Coatecas Altas","Coicoyan de las Flores","Concepcion Buenavista","Concepcion Papalo","Constancia del Rosario","Cosolapa","Cosoltepec","Cuilapam de Guerrero","Cuna de la Independencia de Oaxaca","Cuyamecalco Villa de Zaragoza","El Barrio de la Soledad","El Espinal","Eloxochitlan de Flores Magon","Fresnillo de Trujano","Guadalupe Etla","Guadalupe de Ramirez","Guelatao de Juarez","Guevea de Humboldt","Heroica Ciudad de Ejutla de Crespo","Heroica Ciudad de Huajuapan de Leon","Heroica Ciudad de Juchitan de Zaragoza","Heroica Ciudad de Tlaxiaco","Heroica Villa Tezoatlan de Segura y Luna","Huautepec","Huautla de Jimenez","Ixpantepec Nieves","Ixtlan de Juarez","La Compania","La Pe","La Reforma","La Trinidad Vista Hermosa","Loma Bonita","Magdalena Apasco","Magdalena Jaltepec","Magdalena Mixtepec","Magdalena Ocotlan","Magdalena Penasco","Magdalena Teitipac","Magdalena Tequisistlan","Magdalena Tlacotepec","Magdalena Yodocono de Porfirio Diaz","Magdalena Zahuatlan","Mariscala de Juarez","Martires de Tacubaya","Matias Romero Avendano","Mazatlan Villa de Flores","Mesones Hidalgo","Miahuatlan de Porfirio Diaz","Mixistlan de la Reforma","Monjas","Natividad","Nazareno Etla","Nejapa de Madero","Nuevo Zoquiapam","Oaxaca de Juarez","Ocotlan de Morelos","Pinotepa de Don Luis","Pluma Hidalgo","Putla Villa de Guerrero","Reforma de Pineda","Reyes Etla","Rojas de Cuauhtemoc","Salina Cruz","San Agustin Amatengo","San Agustin Atenango","San Agustin Chayuco","San Agustin Etla","San Agustin Loxicha","San Agustin Tlacotepec","San Agustin Yatareni","San Agustin de las Juntas","San Andres Cabecera Nueva","San Andres Dinicuiti","San Andres Huaxpaltepec","San Andres Huayapam","San Andres Ixtlahuaca","San Andres Lagunas","San Andres Nuxino","San Andres Paxtlan","San Andres Sinaxtla","San Andres Solaga","San Andres Teotilalpam","San Andres Tepetlapa","San Andres Yaa","San Andres Zabache","San Andres Zautla","San Antonino Castillo Velasco","San Antonino Monte Verde","San Antonino el Alto","San Antonio Acutla","San Antonio Huitepec","San Antonio Nanahuatipam","San Antonio Sinicahua","San Antonio Tepetlapa","San Antonio de la Cal","San Baltazar Chichicapam","San Baltazar Loxicha","San Baltazar Yatzachi el Bajo","San Bartolo Coyotepec","San Bartolo Soyaltepec","San Bartolo Yautepec","San Bartolome Ayautla","San Bartolome Loxicha","San Bartolome Quialana","San Bartolome Yucuane","San Bartolome Zoogocho","San Bernardo Mixtepec","San Blas Atempa","San Carlos Yautepec","San Cristobal Amatlan","San Cristobal Amoltepec","San Cristobal Lachirioag","San Cristobal Suchixtlahuaca","San Dionisio Ocotepec","San Dionisio Ocotlan","San Dionisio del Mar","San Esteban Atatlahuca","San Felipe Jalapa de Diaz","San Felipe Tejalapam","San Felipe Usila","San Francisco Cahuacua","San Francisco Cajonos","San Francisco Chapulapa","San Francisco Chindua","San Francisco Huehuetlan","San Francisco Ixhuatan","San Francisco Jaltepetongo","San Francisco Lachigolo","San Francisco Logueche","San Francisco Nuxano","San Francisco Ozolotepec","San Francisco Sola","San Francisco Telixtlahuaca","San Francisco Teopan","San Francisco Tlapancingo","San Francisco del Mar","San Gabriel Mixtepec","San Ildefonso Amatlan","San Ildefonso Sola","San Ildefonso Villa Alta","San Jacinto Amilpas","San Jacinto Tlacotepec","San Jeronimo Coatlan","San Jeronimo Silacayoapilla","San Jeronimo Sosola","San Jeronimo Taviche","San Jeronimo Tecoatl","San Jeronimo Tlacochahuaya","San Jorge Nuchita","San Jose Ayuquila","San Jose Chiltepec","San Jose Estancia Grande","San Jose Independencia","San Jose Lachiguiri","San Jose Tenango","San Jose del Penasco","San Jose del Progreso","San Juan Achiutla","San Juan Atepec","San Juan Bautista Atatlahuca","San Juan Bautista Coixtlahuaca","San Juan Bautista Cuicatlan","San Juan Bautista Guelache","San Juan Bautista Jayacatlan","San Juan Bautista Lo de Soto","San Juan Bautista Suchitepec","San Juan Bautista Tlachichilco","San Juan Bautista Tlacoatzintepec","San Juan Bautista Tuxtepec","San Juan Bautista Valle Nacional","San Juan Cacahuatepec","San Juan Chicomezuchil","San Juan Chilateca","San Juan Cieneguilla","San Juan Coatzospam","San Juan Colorado","San Juan Comaltepec","San Juan Cotzocon","San Juan Diuxi","San Juan Evangelista Analco","San Juan Guelavia","San Juan Guichicovi","San Juan Ihualtepec","San Juan Juquila Mixes","San Juan Juquila Vijanos","San Juan Lachao","San Juan Lachigalla","San Juan Lajarcia","San Juan Lalana","San Juan Mazatlan","San Juan Mixtepec","San Juan Mixtepec","San Juan Numi","San Juan Ozolotepec","San Juan Petlapa","San Juan Quiahije","San Juan Quiotepec","San Juan Sayultepec","San Juan Tabaa","San Juan Tamazola","San Juan Teita","San Juan Teitipac","San Juan Tepeuxila","San Juan Teposcolula","San Juan Yaee","San Juan Yatzona","San Juan Yucuita","San Juan de los Cues","San Juan del Estado","San Juan del Rio","San Lorenzo Albarradas","San Lorenzo Cacaotepec","San Lorenzo Cuaunecuiltitla","San Lorenzo Texmelucan","San Lorenzo Victoria","San Lorenzo","San Lucas Camotlan","San Lucas Ojitlan","San Lucas Quiavini","San Lucas Zoquiapam","San Luis Amatlan","San Marcial Ozolotepec","San Marcos Arteaga","San Martin Huamelulpam","San Martin Itunyoso","San Martin Lachila","San Martin Peras","San Martin Tilcajete","San Martin Toxpalan","San Martin Zacatepec","San Martin de los Cansecos","San Mateo Cajonos","San Mateo Etlatongo","San Mateo Nejapam","San Mateo Penasco","San Mateo Pinas","San Mateo Rio Hondo","San Mateo Sindihui","San Mateo Tlapiltepec","San Mateo Yoloxochitlan","San Mateo Yucutindoo","San Mateo del Mar","San Melchor Betaza","San Miguel Achiutla","San Miguel Ahuehuetitlan","San Miguel Aloapam","San Miguel Amatitlan","San Miguel Amatlan","San Miguel Chicahua","San Miguel Chimalapa","San Miguel Coatlan","San Miguel Ejutla","San Miguel Huautla","San Miguel Mixtepec","San Miguel Panixtlahuaca","San Miguel Peras","San Miguel Piedras","San Miguel Quetzaltepec","San Miguel Santa Flor","San Miguel Soyaltepec","San Miguel Suchixtepec","San Miguel Tecomatlan","San Miguel Tenango","San Miguel Tequixtepec","San Miguel Tilquiapam","San Miguel Tlacamama","San Miguel Tlacotepec","San Miguel Tulancingo","San Miguel Yotao","San Miguel del Puerto","San Miguel del Rio","San Miguel el Grande","San Nicolas Hidalgo","San Nicolas","San Pablo Coatlan","San Pablo Cuatro Venados","San Pablo Etla","San Pablo Huitzo","San Pablo Huixtepec","San Pablo Macuiltianguis","San Pablo Tijaltepec","San Pablo Villa de Mitla","San Pablo Yaganiza","San Pedro Amuzgos","San Pedro Apostol","San Pedro Atoyac","San Pedro Cajonos","San Pedro Comitancillo","San Pedro Coxcaltepec Cantaros","San Pedro Huamelula","San Pedro Huilotepec","San Pedro Ixcatlan","San Pedro Ixtlahuaca","San Pedro Jaltepetongo","San Pedro Jicayan","San Pedro Jocotipac","San Pedro Juchatengo","San Pedro Martir Quiechapa","San Pedro Martir Yucuxaco","San Pedro Martir","San Pedro Mixtepec","San Pedro Mixtepec","San Pedro Molinos","San Pedro Nopala","San Pedro Ocopetatillo","San Pedro Ocotepec","San Pedro Pochutla","San Pedro Quiatoni","San Pedro Sochiapam","San Pedro Tapanatepec","San Pedro Taviche","San Pedro Teozacoalco","San Pedro Teutila","San Pedro Tidaa","San Pedro Topiltepec","San Pedro Totolapam","San Pedro Yaneri","San Pedro Yolox","San Pedro Yucunama","San Pedro el Alto","San Pedro y San Pablo Ayutla","San Pedro y San Pablo Teposcolula","San Pedro y San Pablo Tequixtepec","San Raymundo Jalpan","San Sebastian Abasolo","San Sebastian Coatlan","San Sebastian Ixcapa","San Sebastian Nicananduta","San Sebastian Rio Hondo","San Sebastian Tecomaxtlahuaca","San Sebastian Teitipac","San Sebastian Tutla","San Simon Almolongas","San Simon Zahuatlan","San Vicente Coatlan","San Vicente Lachixio","San Vicente Nunu","Santa Ana Ateixtlahuaca","Santa Ana Cuauhtemoc","Santa Ana Tavela","Santa Ana Tlapacoyan","Santa Ana Yareni","Santa Ana Zegache","Santa Ana del Valle","Santa Ana","Santa Catalina Quieri","Santa Catarina Cuixtla","Santa Catarina Ixtepeji","Santa Catarina Juquila","Santa Catarina Lachatao","Santa Catarina Loxicha","Santa Catarina Mechoacan","Santa Catarina Minas","Santa Catarina Quiane","Santa Catarina Quioquitani","Santa Catarina Tayata","Santa Catarina Ticua","Santa Catarina Yosonotu","Santa Catarina Zapoquila","Santa Cruz Acatepec","Santa Cruz Amilpas","Santa Cruz Itundujia","Santa Cruz Mixtepec","Santa Cruz Nundaco","Santa Cruz Papalutla","Santa Cruz Tacache de Mina","Santa Cruz Tacahua","Santa Cruz Tayata","Santa Cruz Xitla","Santa Cruz Xoxocotlan","Santa Cruz Zenzontepec","Santa Cruz de Bravo","Santa Gertrudis","Santa Ines Yatzeche","Santa Ines de Zaragoza","Santa Ines del Monte","Santa Lucia Miahuatlan","Santa Lucia Monteverde","Santa Lucia Ocotlan","Santa Lucia del Camino","Santa Magdalena Jicotlan","Santa Maria Alotepec","Santa Maria Apazco","Santa Maria Atzompa","Santa Maria Camotlan","Santa Maria Chachoapam","Santa Maria Chilchotla","Santa Maria Chimalapa","Santa Maria Colotepec","Santa Maria Cortijo","Santa Maria Coyotepec","Santa Maria Ecatepec","Santa Maria Guelace","Santa Maria Guienagati","Santa Maria Huatulco","Santa Maria Huazolotitlan","Santa Maria Ipalapa","Santa Maria Ixcatlan","Santa Maria Jacatepec","Santa Maria Jalapa del Marques","Santa Maria Jaltianguis","Santa Maria Lachixio","Santa Maria Mixtequilla","Santa Maria Nativitas","Santa Maria Nduayaco","Santa Maria Ozolotepec","Santa Maria Papalo","Santa Maria Penoles","Santa Maria Petapa","Santa Maria Quiegolani","Santa Maria Sola","Santa Maria Tataltepec","Santa Maria Tecomavaca","Santa Maria Temaxcalapa","Santa Maria Temaxcaltepec","Santa Maria Teopoxco","Santa Maria Tepantlali","Santa Maria Texcatitlan","Santa Maria Tlahuitoltepec","Santa Maria Tlalixtac","Santa Maria Tonameca","Santa Maria Totolapilla","Santa Maria Xadani","Santa Maria Yalina","Santa Maria Yavesia","Santa Maria Yolotepec","Santa Maria Yosoyua","Santa Maria Yucuhiti","Santa Maria Zacatepec","Santa Maria Zaniza","Santa Maria Zoquitlan","Santa Maria del Rosario","Santa Maria del Tule","Santa Maria la Asuncion","Santiago Amoltepec","Santiago Apoala","Santiago Apostol","Santiago Astata","Santiago Atitlan","Santiago Ayuquililla","Santiago Cacaloxtepec","Santiago Camotlan","Santiago Chazumba","Santiago Choapam","Santiago Comaltepec","Santiago Huajolotitlan","Santiago Huauclilla","Santiago Ihuitlan Plumas","Santiago Ixcuintepec","Santiago Ixtayutla","Santiago Jamiltepec","Santiago Jocotepec","Santiago Juxtlahuaca","Santiago Lachiguiri","Santiago Lalopa","Santiago Laollaga","Santiago Laxopa","Santiago Llano Grande","Santiago Matatlan","Santiago Miltepec","Santiago Minas","Santiago Nacaltepec","Santiago Nejapilla","Santiago Niltepec","Santiago Nundiche","Santiago Nuyoo","Santiago Pinotepa Nacional","Santiago Suchilquitongo","Santiago Tamazola","Santiago Tapextla","Santiago Tenango","Santiago Tepetlapa","Santiago Tetepec","Santiago Texcalcingo","Santiago Textitlan","Santiago Tilantongo","Santiago Tillo","Santiago Tlazoyaltepec","Santiago Xanica","Santiago Xiacui","Santiago Yaitepec","Santiago Yaveo","Santiago Yolomecatl","Santiago Yosondua","Santiago Yucuyachi","Santiago Zacatepec","Santiago Zoochila","Santiago del Rio","Santo Domingo Albarradas","Santo Domingo Armenta","Santo Domingo Chihuitan","Santo Domingo Ingenio","Santo Domingo Ixcatlan","Santo Domingo Nuxaa","Santo Domingo Ozolotepec","Santo Domingo Petapa","Santo Domingo Roayaga","Santo Domingo Tehuantepec","Santo Domingo Teojomulco","Santo Domingo Tepuxtepec","Santo Domingo Tlatayapam","Santo Domingo Tomaltepec","Santo Domingo Tonala","Santo Domingo Tonaltepec","Santo Domingo Xagacia","Santo Domingo Yanhuitlan","Santo Domingo Yodohino","Santo Domingo Zanatepec","Santo Domingo de Morelos","Santo Tomas Jalieza","Santo Tomas Mazaltepec","Santo Tomas Ocotepec","Santo Tomas Tamazulapan","Santos Reyes Nopala","Santos Reyes Papalo","Santos Reyes Tepejillo","Santos Reyes Yucuna","Silacayoapam","Sitio de Xitlapehua","Soledad Etla","Tamazulapam del Espiritu Santo","Tanetze de Zaragoza","Taniche","Tataltepec de Valdes","Teococuilco de Marcos Perez","Teotitlan de Flores Magon","Teotitlan del Valle","Teotongo","Tepelmeme Villa de Morelos","Tlacolula de Matamoros","Tlacotepec Plumas","Tlalixtac de Cabrera","Totontepec Villa de Morelos","Trinidad Zaachila","Union Hidalgo","Valerio Trujano","Villa Diaz Ordaz","Villa Hidalgo","Villa Sola de Vega","Villa Talea de Castro","Villa Tejupam de la Union","Villa de Chilapa de Diaz","Villa de Etla","Villa de Tamazulapam del Progreso","Villa de Tututepec","Villa de Zaachila","Yaxe","Yogana","Yutanduchi de Guerrero","Zapotitlan Lagunas","Zapotitlan Palmas","Zimatlan de Alvarez"],
        "Puebla": ["Acajete","Acateno","Acatlan","Acatzingo","Acteopan","Ahuacatlan","Ahuatlan","Ahuazotepec","Ahuehuetitla","Ajalpan","Albino Zertuche","Aljojuca","Altepexi","Amixtlan","Amozoc","Aquixtla","Atempan","Atexcal","Atlequizayan","Atlixco","Atoyatempan","Atzala","Atzitzihuacan","Atzitzintla","Axutla","Ayotoxco de Guerrero","Calpan","Caltepec","Camocuautla","Canada Morelos","Caxhuacan","Chalchicomula de Sesma","Chapulco","Chiautla","Chiautzingo","Chichiquila","Chiconcuautla","Chietla","Chigmecatitlan","Chignahuapan","Chignautla","Chila de la Sal","Chila","Chilchotla","Chinantla","Coatepec","Coatzingo","Cohetzala","Cohuecan","Coronango","Coxcatlan","Coyomeapan","Coyotepec","Cuapiaxtla de Madero","Cuautempan","Cuautinchan","Cuautlancingo","Cuayuca de Andrade","Cuetzalan del Progreso","Cuyoaco","Domingo Arenas","Eloxochitlan","Epatlan","Esperanza","Francisco Z. Mena","General Felipe Angeles","Guadalupe Victoria","Guadalupe","Hermenegildo Galeana","Honey","Huaquechula","Huatlatlauca","Huauchinango","Huehuetla","Huehuetlan el Chico","Huehuetlan el Grande","Huejotzingo","Hueyapan","Hueytamalco","Hueytlalpan","Huitzilan de Serdan","Huitziltepec","Ixcamilpa de Guerrero","Ixcaquixtla","Ixtacamaxtitlan","Ixtepec","Izucar de Matamoros","Jalpan","Jolalpan","Jonotla","Jopala","Juan C. Bonilla","Juan Galindo","Juan N. Mendez","La Magdalena Tlatlauquitepec","Lafragua","Libres","Los Reyes de Juarez","Mazapiltepec de Juarez","Mixtla","Molcaxac","Naupan","Nauzontla","Nealtican","Nicolas Bravo","Nopalucan","Ocotepec","Ocoyucan","Olintla","Oriental","Pahuatlan","Palmar de Bravo","Pantepec","Petlalcingo","Piaxtla","Puebla","Quecholac","Quimixtlan","Rafael Lara Grajales","San Andres Cholula","San Antonio Canada","San Diego la Mesa Tochimiltzingo","San Felipe Teotlalcingo","San Felipe Tepatlan","San Gabriel Chilac","San Gregorio Atzompa","San Jeronimo Tecuanipan","San Jeronimo Xayacatlan","San Jose Chiapa","San Jose Miahuatlan","San Juan Atenco","San Juan Atzompa","San Martin Texmelucan","San Martin Totoltepec","San Matias Tlalancaleca","San Miguel Ixitlan","San Miguel Xoxtla","San Nicolas Buenos Aires","San Nicolas de los Ranchos","San Pablo Anicano","San Pedro Cholula","San Pedro Yeloixtlahuaca","San Salvador Huixcolotla","San Salvador el Seco","San Salvador el Verde","San Sebastian Tlacotepec","Santa Catarina Tlaltempan","Santa Ines Ahuatempan","Santa Isabel Cholula","Santiago Miahuatlan","Santo Tomas Hueyotlipan","Soltepec","Tecali de Herrera","Tecamachalco","Tecomatlan","Tehuacan","Tehuitzingo","Tenampulco","Teopantlan","Teotlalco","Tepanco de Lopez","Tepango de Rodriguez","Tepatlaxco de Hidalgo","Tepeaca","Tepemaxalco","Tepeojuma","Tepetzintla","Tepexco","Tepexi de Rodriguez","Tepeyahualco de Cuauhtemoc","Tepeyahualco","Tetela de Ocampo","Teteles de Avila Castillo","Teziutlan","Tianguismanalco","Tilapa","Tlachichuca","Tlacotepec de Benito Juarez","Tlacuilotepec","Tlahuapan","Tlaltenango","Tlanepantla","Tlaola","Tlapacoya","Tlapanala","Tlatlauquitepec","Tlaxco","Tochimilco","Tochtepec","Totoltepec de Guerrero","Tulcingo","Tuzamapan de Galeana","Tzicatlacoyan","Venustiano Carranza","Vicente Guerrero","Xayacatlan de Bravo","Xicotepec","Xicotlan","Xiutetelco","Xochiapulco","Xochiltepec","Xochitlan Todos Santos","Xochitlan de Vicente Suarez","Yaonahuac","Yehualtepec","Zacapala","Zacapoaxtla","Zacatlan","Zapotitlan de Mendez","Zapotitlan","Zaragoza","Zautla","Zihuateutla","Zinacatepec","Zongozotla","Zoquiapan","Zoquitlan"],
        "Queretaro": ["Amealco de Bonfil","Arroyo Seco","Cadereyta de Montes","Colon","Corregidora","El Marques","Ezequiel Montes","Huimilpan","Jalpan de Serra","Landa de Matamoros","Pedro Escobedo","Penamiller","Pinal de Amoles","Queretaro","San Joaquin","San Juan del Rio","Tequisquiapan","Toliman"],
        "Quintana Roo": ["Bacalar","Benito Juarez","Cozumel","Felipe Carrillo Puerto","Isla Mujeres","Jose Maria Morelos","Lazaro Cardenas","Othon P. Blanco","Puerto Morelos","Solidaridad","Tulum"],
        "San Luis Potosi": ["Ahualulco","Alaquines","Aquismon","Armadillo de los Infante","Axtla de Terrazas","Cardenas","Catorce","Cedral","Cerritos","Cerro de San Pedro","Charcas","Ciudad Fernandez","Ciudad Valles","Ciudad del Maiz","Coxcatlan","Ebano","El Naranjo","Guadalcazar","Huehuetlan","Lagunillas","Matehuala","Matlapa","Mexquitic de Carmona","Moctezuma","Rayon","Rioverde","Salinas","San Antonio","San Ciro de Acosta","San Luis Potosi","San Martin Chalchicuautla","San Nicolas Tolentino","San Vicente Tancuayalab","Santa Catarina","Santa Maria del Rio","Santo Domingo","Soledad de Graciano Sanchez","Tamasopo","Tamazunchale","Tampacan","Tampamolon Corona","Tamuin","Tancanhuitz","Tanlajas","Tanquian de Escobedo","Tierra Nueva","Vanegas","Venado","Villa Hidalgo","Villa Juarez","Villa de Arista","Villa de Arriaga","Villa de Guadalupe","Villa de Ramos","Villa de Reyes","Villa de la Paz","Xilitla","Zaragoza"],
        "Sinaloa": ["Ahome","Angostura","Badiraguato","Choix","Concordia","Cosala","Culiacan","El Fuerte","Elota","Escuinapa","Guasave","Mazatlan","Mocorito","Navolato","Rosario","Salvador Alvarado","San Ignacio","Sinaloa"],
        "Sonora": ["Aconchi","Agua Prieta","Alamos","Altar","Arivechi","Arizpe","Atil","Bacadehuachi","Bacanora","Bacerac","Bacoachi","Bacum","Banamichi","Baviacora","Bavispe","Benito Juarez","Benjamin Hill","Caborca","Cajeme","Cananea","Carbo","Cucurpe","Cumpas","Divisaderos","Empalme","Etchojoa","Fronteras","General Plutarco Elias Calles","Granados","Guaymas","Hermosillo","Huachinera","Huasabas","Huatabampo","Huepac","Imuris","La Colorada","Magdalena","Mazatan","Moctezuma","Naco","Nacori Chico","Nacozari de Garcia","Navojoa","Nogales","Onavas","Opodepe","Oquitoa","Pitiquito","Puerto Penasco","Quiriego","Rayon","Rosario","Sahuaripa","San Felipe de Jesus","San Ignacio Rio Muerto","San Javier","San Luis Rio Colorado","San Miguel de Horcasitas","San Pedro de la Cueva","Santa Ana","Santa Cruz","Saric","Soyopa","Suaqui Grande","Tepache","Trincheras","Tubutama","Ures","Villa Hidalgo","Villa Pesqueira","Yecora"],
        "Tabasco": ["Balancan","Cardenas","Centla","Centro","Comalcalco","Cunduacan","Emiliano Zapata","Huimanguillo","Jalapa","Jalpa de Mendez","Jonuta","Macuspana","Nacajuca","Paraiso","Tacotalpa","Teapa","Tenosique"],
        "Tamaulipas": ["Abasolo","Aldama","Altamira","Antiguo Morelos","Burgos","Bustamante","Camargo","Casas","Ciudad Madero","Cruillas","El Mante","Gomez Farias","Gonzalez","Guemez","Guerrero","Gustavo Diaz Ordaz","Hidalgo","Jaumave","Jimenez","Llera","Mainero","Matamoros","Mendez","Mier","Miguel Aleman","Miquihuana","Nuevo Laredo","Nuevo Morelos","Ocampo","Padilla","Palmillas","Reynosa","Rio Bravo","San Carlos","San Fernando","San Nicolas","Soto la Marina","Tampico","Tula","Valle Hermoso","Victoria","Villagran","Xicotencatl"],
        "Tlaxcala": ["Acuamanala de Miguel Hidalgo","Amaxac de Guerrero","Apetatitlan de Antonio Carvajal","Apizaco","Atlangatepec","Atltzayanca","Benito Juarez","Calpulalpan","Chiautempan","Contla de Juan Cuamatzi","Cuapiaxtla","Cuaxomulco","El Carmen Tequexquitla","Emiliano Zapata","Espanita","Huamantla","Hueyotlipan","Ixtacuixtla de Mariano Matamoros","Ixtenco","La Magdalena Tlaltelulco","Lazaro Cardenas","Mazatecochco de Jose Maria Morelos","Munoz de Domingo Arenas","Nanacamilpa de Mariano Arista","Nativitas","Panotla","Papalotla de Xicohtencatl","San Damian Texoloc","San Francisco Tetlanohcan","San Jeronimo Zacualpan","San Jose Teacalco","San Juan Huactzinco","San Lorenzo Axocomanitla","San Lucas Tecopilco","San Pablo del Monte","Sanctorum de Lazaro Cardenas","Santa Ana Nopalucan","Santa Apolonia Teacalco","Santa Catarina Ayometla","Santa Cruz Quilehtla","Santa Cruz Tlaxcala","Santa Isabel Xiloxoxtla","Tenancingo","Teolocholco","Tepetitla de Lardizabal","Tepeyanco","Terrenate","Tetla de la Solidaridad","Tetlatlahuca","Tlaxcala","Tlaxco","Tocatlan","Totolac","Tzompantepec","Xaloztoc","Xaltocan","Xicohtzinco","Yauhquemehcan","Zacatelco","Ziltlaltepec de Trinidad Sanchez Santos"],
        "Veracruz": ["Acajete","Acatlan","Acayucan","Actopan","Acula","Acultzingo","Agua Dulce","Alamo Temapache","Alpatlahuac","Alto Lucero de Gutierrez Barrios","Altotonga","Alvarado","Amatitlan","Amatlan de los Reyes","Angel R. Cabada","Apazapan","Aquila","Astacinga","Atlahuilco","Atoyac","Atzacan","Atzalan","Ayahualulco","Banderilla","Benito Juarez","Boca del Rio","Calcahualco","Camaron de Tejeda","Camerino Z. Mendoza","Carlos A. Carrillo","Carrillo Puerto","Castillo de Teayo","Catemaco","Cazones de Herrera","Cerro Azul","Chacaltianguis","Chalma","Chiconamel","Chiconquiaco","Chicontepec","Chinameca","Chinampa de Gorostiza","Chocaman","Chontla","Chumatlan","Citlaltepetl","Coacoatzintla","Coahuitlan","Coatepec","Coatzacoalcos","Coatzintla","Coetzala","Colipa","Comapa","Cordoba","Cosamaloapan de Carpio","Cosautlan de Carvajal","Coscomatepec","Cosoleacaque","Cotaxtla","Coxquihui","Coyutla","Cuichapa","Cuitlahuac","El Higo","Emiliano Zapata","Espinal","Filomeno Mata","Fortin","Gutierrez Zamora","Hidalgotitlan","Huatusco","Huayacocotla","Hueyapan de Ocampo","Huiloapan de Cuauhtemoc","Ignacio de la Llave","Ilamatlan","Isla","Ixcatepec","Ixhuacan de los Reyes","Ixhuatlan de Madero","Ixhuatlan del Cafe","Ixhuatlan del Sureste","Ixhuatlancillo","Ixmatlahuacan","Ixtaczoquitlan","Jalacingo","Jalcomulco","Jaltipan","Jamapa","Jesus Carranza","Jilotepec","Jose Azueta","Juan Rodriguez Clara","Juchique de Ferrer","La Antigua","La Perla","Landero y Coss","Las Choapas","Las Minas","Las Vigas de Ramirez","Lerdo de Tejada","Los Reyes","Magdalena","Maltrata","Manlio Fabio Altamirano","Mariano Escobedo","Martinez de la Torre","Mecatlan","Mecayapan","Medellin de Bravo","Miahuatlan","Minatitlan","Misantla","Mixtla de Altamirano","Moloacan","Nanchital de Lazaro Cardenas del Rio","Naolinco","Naranjal","Naranjos Amatlan","Nautla","Nogales","Oluta","Omealca","Orizaba","Otatitlan","Oteapan","Ozuluama de Mascarenas","Pajapan","Panuco","Papantla","Paso de Ovejas","Paso del Macho","Perote","Platon Sanchez","Playa Vicente","Poza Rica de Hidalgo","Pueblo Viejo","Puente Nacional","Rafael Delgado","Rafael Lucio","Rio Blanco","Saltabarranca","San Andres Tenejapan","San Andres Tuxtla","San Juan Evangelista","San Rafael","Santiago Sochiapan","Santiago Tuxtla","Sayula de Aleman","Sochiapa","Soconusco","Soledad Atzompa","Soledad de Doblado","Soteapan","Tamalin","Tamiahua","Tampico Alto","Tancoco","Tantima","Tantoyuca","Tatahuicapan de Juarez","Tatatila","Tecolutla","Tehuipango","Tempoal","Tenampa","Tenochtitlan","Teocelo","Tepatlaxco","Tepetlan","Tepetzintla","Tequila","Texcatepec","Texhuacan","Texistepec","Tezonapa","Tierra Blanca","Tihuatlan","Tlachichilco","Tlacojalpan","Tlacolulan","Tlacotalpan","Tlacotepec de Mejia","Tlalixcoyan","Tlalnelhuayocan","Tlaltetela","Tlapacoyan","Tlaquilpa","Tlilapan","Tomatlan","Tonayan","Totutla","Tres Valles","Tuxpan","Tuxtilla","Ursulo Galvan","Uxpanapa","Vega de Alatorre","Veracruz","Villa Aldama","Xalapa","Xico","Xoxocotla","Yanga","Yecuatla","Zacualpan","Zaragoza","Zentla","Zongolica","Zontecomatlan de Lopez y Fuentes","Zozocolco de Hidalgo"],
        "Yucatan": ["Abala","Acanceh","Akil","Baca","Bokoba","Buctzotz","Cacalchen","Calotmul","Cansahcab","Cantamayec","Celestun","Cenotillo","Chacsinkin","Chankom","Chapab","Chemax","Chichimila","Chicxulub Pueblo","Chikindzonot","Chochola","Chumayel","Conkal","Cuncunul","Cuzama","Dzan","Dzemul","Dzidzantun","Dzilam Gonzalez","Dzilam de Bravo","Dzitas","Dzoncauich","Espita","Halacho","Hocaba","Hoctun","Homun","Huhi","Hunucma","Ixil","Izamal","Kanasin","Kantunil","Kaua","Kinchil","Kopoma","Mama","Mani","Maxcanu","Mayapan","Merida","Mococha","Motul","Muna","Muxupip","Opichen","Oxkutzcab","Panaba","Peto","Progreso","Quintana Roo","Rio Lagartos","Sacalum","Samahil","San Felipe","Sanahcat","Santa Elena","Seye","Sinanche","Sotuta","Sucila","Sudzal","Suma","Tahdziu","Tahmek","Teabo","Tecoh","Tekal de Venegas","Tekanto","Tekax","Tekit","Tekom","Telchac Pueblo","Telchac Puerto","Temax","Temozon","Tepakan","Tetiz","Teya","Ticul","Timucuy","Tinum","Tixcacalcupul","Tixkokob","Tixmehuac","Tixpehual","Tizimin","Tunkas","Tzucacab","Uayma","Ucu","Uman","Valladolid","Xocchel","Yaxcaba","Yaxkukul","Yobain"],
        "Zacatecas": ["Apozol","Apulco","Atolinga","Benito Juarez","Calera","Canitas de Felipe Pescador","Chalchihuites","Concepcion del Oro","Cuauhtemoc","El Plateado de Joaquin Amaro","El Salvador","Fresnillo","Genaro Codina","General Enrique Estrada","General Francisco R. Murguia","General Panfilo Natera","Guadalupe","Huanusco","Jalpa","Jerez","Jimenez del Teul","Juan Aldama","Juchipila","Loreto","Luis Moya","Mazapil","Melchor Ocampo","Mezquital del Oro","Miguel Auza","Momax","Monte Escobedo","Morelos","Moyahua de Estrada","Nochistlan de Mejia","Noria de Angeles","Ojocaliente","Panuco","Pinos","Rio Grande","Sain Alto","Santa Maria de la Paz","Sombrerete","Susticacan","Tabasco","Tepechitlan","Tepetongo","Teul de Gonzalez Ortega","Tlaltenango de Sanchez Roman","Trancoso","Trinidad Garcia de la Cadena","Valparaiso","Vetagrande","Villa Garcia","Villa Gonzalez Ortega","Villa Hidalgo","Villa de Cos","Villanueva","Zacatecas"]
      },
    }
  },
  methods: {
    addressDetailCompleted(e){
      e.preventDefault()
      const calle = e.target.children['calle'].value;
      const colonia = e.target.children['colonia'].value;
      const cp = e.target.children['cp'].value;
      const nodeEstado = document.querySelector("#estado");
      const estado = nodeEstado.value;
      const nodeMunicipio = document.querySelector("#municipio");
      const municipio = nodeMunicipio.value;      
      const addressCertificate = e.target.children["addressCertificate"].files[0]
      const addressCertificateRender = URL.createObjectURL(e.target.children["addressCertificate"].files[0]);

      const objAddress = {
        calle: calle,
        colonia: colonia,
        cp: cp,
        estado: estado,
        municipio: municipio,
        comprobanteDomicilio: addressCertificate,
        comprobanteDomicilioRender:addressCertificateRender
      }
      this.$emit("addressDetailCompleted", objAddress)

      const dataFORM = new FormData();
      dataFORM.append("domicilio", addressCertificate)
    },

    showMunicipio(e){      
      this.estadoRepublica = e.target.value;
    },   
  },
  template: `  
  <form v-on:submit="addressDetailCompleted">
    <h4>Por favor indica tu domicilio:</h4>
    <label for="calle">Calle y número</label><span class="required">*</span>
    <input type="text" name="calle" placeholder="Calle y número...">
    <label for="colonia">Colonia</label><span class="required">*</span>
    <input type="text" name="colonia" placeholder="Colonia...">
    <!-- https://copomex.com/#pricing-section por 330 para agilizar este tramite -->
    <label for="cp"> <span>Código Postal</span><span class="required">*</span>
    </label>
    <input 
      type="number" 
      name="cp" 
      placeholder="Código Postal..."
      min="01000"
      max="99999"
    />      
    <label for="estado">
    <span>Estado</span>
    <select name="estado" id="estado" v-on:change="showMunicipio">
      <option v-for="(item, i) in valueEstado" v-bind:value="i">
        {{ i }}
      </option>
    </label>      
    <label for="municipio">
      <span class="required">Municipio o Alcaldía*</span>      
      <select name="municipio" id="municipio">
        <option v-for="item in valueEstado[estadoRepublica]" :key="item" @municipio="municipio"> {{ item }}</option>
      </select>
    </label>

    <label for="addressCertificate">Adjuntar Comprobante de Domicilio</label>
    <input type="file" name="addressCertificate" id="addressCertificate">
    <v-button></v-button>
  </form>
  `
})

app.component("v-scholarship", {
  data(){
    return {
      listaEscolaridades:[      
        "Solo sabe leer y escribir",
        "Primaria inconclusa",
        "Primaria concluida",
        "Secundaria inconclusa",
        "Secundaria concluida",
        "Bachillerato o equivalente inconcluso",
        "Bachillerato o equivalente concluido",
        "Educación superior inconclusa",
        "Educación superior concluida",
        "Postgrado (maestría, doctorado)"
      ],
    }
  },

  methods: {
    scholarshipDetailCompleted(e){
      e.preventDefault()      
      const scholarship = document.getElementById("scholarship").value;
      const studiesCertificate = e.target.children['studiesCertificate'].files[0]
      const studiesCertificateRender = URL.createObjectURL(e.target.children['studiesCertificate'].files[0]);
      const objScholarship = {
        escolaridad: scholarship,
        comprobanteEstudios: studiesCertificate,
        comprobanteEstudiosRender: studiesCertificateRender
      }
      this.$emit("scholarshipDetailCompleted", objScholarship)
    }
  },

  template: `
  <form v-on:submit="scholarshipDetailCompleted">
    <h4>Grado Escolar</h4>
    <label for="scholarship">
    <span>Escolaridad</span>
    <select name="scholarship" id="scholarship">            
      <option v-for="item in listaEscolaridades" :key="item">{{ item }}</option>
    </label>  

    <label for="studiesCertificate">Adjuntar Comprobante de máximo grado de estudios</label>
    <input type="file" name="studiesCertificate">
    <v-button></v-button>
  </form>
  `
})

app.component("v-updateContact", {
  methods: {
    contactDetailCompleted(object){      
      this.$emit("updateProperties", object)    
    },
  },

  template: `
  <div class="" id="updateContact">
    <v-legendUpdateData></v-legendUpdateData>

    <v-contact
      v-on:contactDetailCompleted="contactDetailCompleted"
    />
    
  </div>
  `
})

app.component("v-updateAddress", {
  methods: {
    addressDetailCompleted(object){      
      this.$emit("updateProperties", object)
    },
  },

  template: `
  <div id="updateAddress">
    <v-legendUpdateData></v-legendUpdateData>

    <v-address
      v-on:addressDetailCompleted="addressDetailCompleted"
    />

  </div>
  `
})

app.component("v-updateSchool", {
  methods: {
    scholarshipDetailCompleted(object){      
      this.$emit("updateProperties", object)    
    },
  },
  
  template: `
  <div class="" id="updateScholarship">
    <v-legendUpdateData/>
    <v-scholarship
      v-on:scholarshipDetailCompleted="scholarshipDetailCompleted"
    />
  </div>  `
})

app.component("v-updateRegister", {
  //inject: ["reactive"],
  data() {
    return {      
      showButtonBirthCertificate: true,
      buttonUpdateBirthCertificate: false,
      valueButtonBirthCertificate: "Actualizar Acta de Nacimiento",

      showButtonContact: true,
      buttonUpdateContact: false,
      valueButtonContact: "Actualizar Datos de Contacto",

      showButtonAddress: true,
      buttonUpdateAddress: false,
      valueButtonAddress: "Actualizar Domicilio",

      showButtonScholarship: true,      
      buttonUpdateScholarship: false,
      valueButtonScholarship: "Actualizar Grado de Estudios",

      valueCancel: "Cancelar Actualización"
    }
  },
  
  watch: {
    buttonUpdateBirthCertificate(){
      this.showButtonContact = !this.showButtonContact;
      this.showButtonAddress = !this.showButtonAddress;
      this.showButtonScholarship = !this.showButtonScholarship;
      this.showUpdateFieldOnly();
      this.valueButtonBirthCertificate = this.buttonUpdateBirthCertificate  ?
          this.valueCancel : 
          "Actualizar Acta de Nacimiento";
    },

    buttonUpdateContact(value, old){
      this.showButtonBirthCertificate = !this.showButtonBirthCertificate;
      this.showButtonAddress = !this.showButtonAddress;
      this.showButtonScholarship = !this.showButtonScholarship;
      this.showUpdateFieldOnly();
        this.valueButtonContact = this.buttonUpdateContact  ?
          this.valueCancel : 
          "Actualizar Datos de Contacto";
      },

      buttonUpdateAddress(value, old){
        this.showButtonBirthCertificate = !this.showButtonBirthCertificate;
        this.showButtonContact = !this.showButtonContact;
        this.showButtonScholarship = !this.showButtonScholarship;
        this.showUpdateFieldOnly();        
        this.valueButtonAddress = this.buttonUpdateAddress  ?
          this.valueCancel :
          "Actualizar Domicilio";
      },

      buttonUpdateScholarship(value, old){
        this.showButtonBirthCertificate = !this.showButtonBirthCertificate;
        this.showButtonContact = !this.showButtonContact;
        this.showButtonAddress = !this.showButtonAddress;
        this.showUpdateFieldOnly();        
        this.valueButtonScholarship = this.buttonUpdateScholarship  ?
        this.valueCancel :
        "Actualizar Grado de Estudios";
      }
  },

  methods: {
    updateProperties(object) {
      this.$emit("updateProperties", object);
      this.buttonUpdateBirthCertificate =false;
      this.buttonUpdateContact = false;
      this.buttonUpdateAddress = false;
      this.buttonUpdateScholarship = false;
    },
    showUpdateFieldOnly(){
      this.$emit("showUpdateFieldOnly")
    }
  },

  template: `
  <div id="updateRegister">
  <p>Si deseas corregir o actualizar algún que nos hayas proporcionado, selecciona cual sería:</p>

    <button 
      v-if="showButtonBirthCertificate"
      v-on:click="buttonUpdateBirthCertificate = !buttonUpdateBirthCertificate">
        {{ valueButtonBirthCertificate }}
    </button>
    <v-updateBirthCertificate
      v-if="buttonUpdateBirthCertificate"
      v-on:updateProperties="updateProperties"
    />

    <button 
      v-if="showButtonContact"
      v-on:click="buttonUpdateContact = !buttonUpdateContact">
        {{ valueButtonContact }}
    </button>    
    <v-updateContact
      v-if="buttonUpdateContact"
      v-on:updateProperties="updateProperties"
    />

    <button 
      v-if="showButtonAddress"
      v-on:click="buttonUpdateAddress = !buttonUpdateAddress">
        {{ valueButtonAddress }}
    </button>
    <v-updateAddress
      v-if="buttonUpdateAddress"
      v-on:updateProperties="updateProperties"
    />

    <button 
      v-if="showButtonScholarship"  
      v-on:click="buttonUpdateScholarship = !buttonUpdateScholarship">
      {{ valueButtonScholarship }}
    </button>
    <v-updateSchool
      v-if="buttonUpdateScholarship"
      v-on:updateProperties="updateProperties"
    />
  </div>
  `
})

app.component("v-firstRegister", {
  data() {
    return {
      firstRegisterIsCompletedContact: true,
      firstRegisterIsCompletedAddress: false,
      firstRegisterIsCompletedScholarship: false,      
    }
  },

  methods: {
    contactDetailCompleted(object){      
      this.firstRegisterIsCompletedContact = false;
      this.firstRegisterIsCompletedAddress = true;
      this.$emit("saveData", object)
      
    },
    
    addressDetailCompleted(object){      
      this.firstRegisterIsCompletedAddress = false;
      this.firstRegisterIsCompletedScholarship = true;
      this.$emit("saveData", object)
    },

    scholarshipDetailCompleted(object){
      //incluir disability
      const disability = this.nodeDisability();
      const newObj = { 
        ...object, 
        discapacidad: disability }
      this.firstRegisterIsCompletedScholarship = false;      
      this.$emit("firstRegisterCompleted", newObj)
    },

    nodeDisability(){
     const nodeDisability = document.getElementById("disability")
     const disability = nodeDisability.value;
     return disability
    }
  },

  template: `
  <v-contact
    v-if="firstRegisterIsCompletedContact"
    v-on:contactDetailCompleted="contactDetailCompleted">
  </v-contact>
  <br>

  <v-address
    v-if="firstRegisterIsCompletedAddress"
    v-on:addressDetailCompleted="addressDetailCompleted">
  </v-address>
  <br>

  <v-disability
      v-if="firstRegisterIsCompletedScholarship">  
  </v-disability>

  <v-scholarship
    v-if="firstRegisterIsCompletedScholarship"
    v-on:scholarshipDetailCompleted="scholarshipDetailCompleted">
  </v-scholarship>

  `
})

app.component("v-button", {
  template: `
  <button>Continuar</button>
  `
})

app.component("v-tagCurp", {
  inject: ["reactive"],
  template: `
  <label for="curp">CURP</label>
  <input 
      type="text" 
      id="valueCurp" 
      name="curp" 
      placeholder="CURP..." 
      v-bind:value=reactive.curp
      onkeyup="javascript:this.value=this.value.toUpperCase();"
  >
  `
})

app.component("v-inscription-newRegister", {
  inject: ["API", "API_files", "keyCourseStorage","reactive"],

  data(){
    return {
      showInscription: true,      
    }
  },

  methods: {
    showUpdateFieldOnly(){      
      this.showInscription = !this.showInscription
    },

    updateProperties(object){      
      this.$emit("saveData", object)      
    },

    isDocumentUpload(name){
      if (this.reactive.newStudent[name] == undefined) {
        return ""
      } else {
        return this.reactive.newStudent[name]
      }
    },

    async inscription(e){
      e.preventDefault()
      const data = {
        curp: this.reactive.newStudent.curp,
        fechaNacimiento: this.reactive.newStudent.birthdate,
        nombre: this.reactive.newStudent.nombre,
        a_paterno: this.reactive.newStudent.a_paterno,
        a_materno: this.reactive.newStudent.a_materno,
        estado: this.reactive.newStudent.placeOfBirth,
        genero: this.reactive.newStudent.gender,
        municipio: this.reactive.newStudent.municipio,
        calle: this.reactive.newStudent.calle,
        colonia: this.reactive.newStudent.colonia,
        cp: this.reactive.newStudent.cp,
        email: this.reactive.newStudent.email,
        escolaridad: this.reactive.newStudent.escolaridad,
        discapacidad: this.reactive.newStudent.discapacidad,
        estado: this.reactive.newStudent.estado,
        telefono: this.reactive.newStudent.telefono
      }
      //formFiles
      const formFiles = new FormData();
      formFiles.append("curp", this.reactive.newStudent.curp);
      formFiles.append("actaNacimiento", this.reactive.newStudent.actaNacimiento);
      formFiles.append("comprobanteDomicilio", this.reactive.newStudent.comprobanteDomicilio);
      formFiles.append("comprobanteEstudios", this.reactive.newStudent.comprobanteEstudios);

      const objInscription = {        
        data,
        formFiles,
        db: false,        
      }
      this.$emit("eventInscription", objInscription);      
    }    
  },
 
  template: `
  <section v-if="showInscription" id="v-inscription-newRegister">
    <p>Gracias por proporcionarnos tus datos {{ reactive.newStudent.nombre }} {{ reactive.newStudent.a_paterno }} {{ reactive.newStudent.a_materno }}</p>
    <p>Verificaremos que la información que proporcionaste coincida con los documentos que adjuntaste, y en un plazo de entre 48 y 72 horas hábiles te daremos mas instrucciones</p>
    <br>    
    <p>Te recordamos que te estas inscribiendo al curso:</p>
    
    <v-course/>
    
    <br>
    <div>
      <p>Esta es la información que proporcionaste: </p>
      <p>CURP: {{ reactive.newStudent.curp }}</p>
      <figure>
        <img v-bind:src=isDocumentUpload("actaNacimientoRender") alt="Acta de nacimiento">
        <figcaption>Acta de nacimiento</figcaption>
      </figure>
      <br>
      <p>Domicilio: {{ reactive.newStudent.calle}}, {{ reactive.newStudent.colonia }}, en 
        {{ reactive.newStudent.municipio }}, {{ reactive.newStudent.estado  }}, 
        Código Postal {{ reactive.newStudent.cp }}
      </p>
      <figure>
        <img v-bind:src=isDocumentUpload("comprobanteDomicilioRender") alt="Comprobante de Domicilio">
        <figcaption>Comprobante de Domicilio</figcaption>
      </figure>
      <br>
      <p>Teléfono de contacto: {{ reactive.newStudent.telefono }}</p>
      <p>Correo electrónico: {{ reactive.newStudent.email }}</p>
      <br>
      <p>Grado escolar: {{ this.reactive.newStudent.escolaridad}}</p>
      <figure>
        <img v-bind:src=isDocumentUpload("comprobanteEstudiosRender") alt="Comprobante de Estudios">
        <figcaption>Comprobante de Estudios</figcaption>
      </figure>            
    </div>
      <br>      
    </section>

    <v-updateRegister
      v-on:showUpdateFieldOnly="showUpdateFieldOnly"
      v-on:updateProperties="updateProperties"
    />
    <v-updateActaNacimiento></v-updateActaNacimiento>

    <button 
      v-if="showInscription"
      v-on:click="inscription">
      Inscribirme
    </button>
  `
})

app.component("v-updateBirthCertificate", {
  methods: {
    updateFile(e){
      e.preventDefault();
      const birthCertificate = e.target.children["birthCertificate"].files[0]
      const birthCertificateBlob = URL.createObjectURL(e.target.children["birthCertificate"].files[0]);
      const objBirthCertificate = {
        actaNacimientoRender: birthCertificateBlob,
        actaNacimiento: birthCertificate
      }
      this.$emit("updateProperties", objBirthCertificate)
    }
  },

  template:`
  <form v-on:submit="updateFile">
    <label for="birthCertificate">Adjuntar Acta de Nacimiento</label>
    <input 
      type="file" 
      name="birthCertificate" 
      id="birthCertificate" 
      accept=".jpg, .jpeg, .pdf" 
      capture="environment"
    >
    <button>Actualizar</button>  
  </form>
  `
})

app.component("v-legendUpdateData", {
  template: `
    <p>Debes llenar todos los campos para poder actualizar este rubro</p>
  `
})

app.component("v-buttonCancel", {
  template: `
    <button> Cancelar actualización de información</button>
  `
})

app.component("v-inputFile", {
  //input falta implementar en los luagres donde se subiran archivos
  data(){
    return {
      propertie: ""
    }
  },
  template:`
    <input 
    type="file" 
    name="{{ propertie }}"
    accept=".jpg, .jpeg, .pdf" 
    capture="environment"
>
  `
})

app.component("v-course", { 
  inject: ["course"],
  template: `
  <article class="register">
    <div v-bind:value="course">
      <p>Has iniciando el proceso de preinscripción al curso: {{ course.curso }},
      de la especialidad {{ course.especialidad }}.</p>
      <p>Impartido por {{ course.profesor }}.</p>
      <p>El curso inicia el {{ course.fecha_inicio }}.
      </p>    
    </div>    
  </article>
  `
})

app.component("v-disability", {
  data() {
    return {
      discapacidades: [
        "Ninguna", "Visual", "Auditiva", "de Comunicación", "motriz", "Intelectual"
      ]
    }
  },

  template: `
  <p>¿Presenta alguna discapacidad? <span class="required">*</span></p>
    <label for="disability">
      <select name="disability" id="disability">
        <option v-for= "disability in discapacidades">{{ disability }}</option>
      </select>
    </label>
  `
})

app.component("v-confirmation", {
  inject: ["course", "dataConfirmation"],
  template: `
  <div class="register">
    <p> {{this.dataConfirmation.nombre}}, has sido preinscrito en el curso {{ this.course.curso }} que inicia el {{ this.course.fecha_inicio }}.</p>
    <p>Revisaremos la información que acabas de enviar y nos pondremos en contacto contigo para indicarte que puedes realizar el pago del curso por $ {{ this.course.costo }}</p>
    <p>Te contactaremos en el numero telefonico que nos indicaste.</p>
    <br>
    
    <p></p>
    <p>El numero de matricula que tienes asignado es el siguiente:</p>
    <p>{{ this.dataConfirmation.matricula }}</p>
    <p>¡Gracias por tu preferencia!</p>
  </div>
  `
})

const vm = app.mount('#app');
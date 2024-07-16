export const vViewInscriptionNew = {
    inject: ["reactive"],
  
    data(){
      return {
        renderPDF: {
          actaNacimiento: false,
          comprobanteDomicilio: false,
          comprobanteEstudios: false
        },
        nameFilePDF: {
          actaNacimiento: "",
          comprobanteDomicilio: "",
          comprobanteEstudios: ""
        },
        //temporal hasta mostrar render pdf
        showInscription: true,
        arrayActa : ["actaNacimientoRender", "actaNacimiento"],
        arrayDomicilio : ["comprobanteDomicilioRender", "comprobanteDomicilio"],
        arrayEstudios : ["comprobanteEstudiosRender", "comprobanteEstudios"],
      }
    },
    watch:{
      
    },
  
    methods: {
      showUpdateFieldOnly(){
        this.showInscription = !this.showInscription
      },
  
      updateTypeFile(){
        this.isDocumentUpload(this.arrayActa);
        this.isDocumentUpload(this.arrayDomicilio);
        this.isDocumentUpload(this.arrayEstudios);
      },
  
      updateProperties(object){      
        this.$emit("saveDataUpdate", object)
        this.updateTypeFile();
      },
  
      isDocumentUpload(array){
        const fileRender = this.reactive.newStudent[array[0]];
        const file = this.reactive.newStudent[array[1]];
        this.nameFilePDF[array[1]] = file.name;
        this.renderPDF[array[1]] = file.type === 'application/pdf' ? true : false;
        const render = fileRender == undefined ? "" : fileRender;
        return render;
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
          padecimiento: this.reactive.newStudent.padecimiento,
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
        this.$emit("completedNewInscription", objInscription);
      }
    },
   
    template: `
    <p>Por favor revisa tú información una vez más antes de inscribirte.</p>
    <section v-if="showInscription" class="container__register__preSend">
      
      <div class="register__preSend">
        <h5>Datos personales.</h5>
        <p>Nombre: <span class="register__preSend--data">{{ reactive.newStudent.nombre }} {{ reactive.newStudent.a_paterno }} {{ reactive.newStudent.a_materno }}</span>.</p>
        <p>CURP: <span class="register__preSend--data">{{ reactive.newStudent.curp }}</span></p>
        <br>
        <p>Acta de nacimiento:</p>
        
        <figure v-if="!renderPDF.actaNacimiento">
          <img v-bind:src=isDocumentUpload(arrayActa) alt="Acta de nacimiento">
        </figure>
        
        <iframe 
          v-if="renderPDF.actaNacimiento"
          v-bind:src=isDocumentUpload(arrayActa)
          type="application/pdf">
        </iframe>      
        <p>Nombre del archivo seleccionado: {{nameFilePDF.actaNacimiento}}</p>
      </div>    
  
      <div class="register__preSend">
        <h5>Domicilio.</h5>
        <p>{{ reactive.newStudent.calle}}, {{ reactive.newStudent.colonia }}, en {{ reactive.newStudent.municipio }}, {{ reactive.newStudent.estado  }}, Código Postal {{ reactive.newStudent.cp }}</p>
        <br>
        <p>Comprobante de Domicilio:</p>
        
        <figure v-if="!renderPDF.comprobanteDomicilio">
          <img v-bind:src=isDocumentUpload(arrayDomicilio) alt="Comprobante de Domicilio">
        </figure>
  
        <iframe 
          v-if="renderPDF.comprobanteDomicilio"
          v-bind:src=isDocumentUpload(arrayDomicilio)
          type="application/pdf">
        </iframe>
        <p>Nombre del archivo seleccionado: {{nameFilePDF.comprobanteDomicilio}}</p>
      </div>
          
        
      <div class="register__preSend">
        <h5>Escolaridad.</h5>
        <p>Máximo grado de estudios alcanzados: <span class="register__preSend--data">{{ this.reactive.newStudent.escolaridad}}</span></p>
        <br>
        <p>Comprobante de Estudios:</p>
        
        <figure v-if="!renderPDF.comprobanteEstudios">
          <img v-bind:src=isDocumentUpload(arrayEstudios) alt="Comprobante de Estudios">        
        </figure>
  
        <iframe 
          v-if="renderPDF.comprobanteEstudios"
          v-bind:src=isDocumentUpload(arrayEstudios)
          type="application/pdf">
        </iframe>
        <p>Nombre del archivo seleccionado: {{nameFilePDF.comprobanteEstudios}}</p>
      </div>
  
      <div class="register__preSend">
        <h5>Datos de Contacto.</h5>
        <p>Correo electrónico: </p>
        <p class="register__preSend--data">{{ reactive.newStudent.email }}</p>
        <p>Teléfono de contacto: </p>
        <p class="register__preSend--data">{{ reactive.newStudent.formatPhone }}</p>
      </div>
      
    </section>
  
    <v-updateRegister
      v-on:showUpdateFieldOnly="showUpdateFieldOnly"
      v-on:updateProperties="updateProperties"
    />
         
    <v-course v-if="showInscription"/>
  
    <v-buttonInscription
      v-if="showInscription"
      v-on:click="inscription">
    </v-buttonInscription>
    `
  };
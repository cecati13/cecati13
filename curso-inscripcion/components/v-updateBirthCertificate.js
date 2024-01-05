export const vUpdateBirthCertificate = {
    inject: ["MAX_SIZE_FILES", "sizeFile"],
    methods: {
      updateFile(e){
        e.preventDefault();
        const birthCertificate = e.target.children["birthCertificate"].files[0];
        const birthCertificateBlob = URL.createObjectURL(e.target.children["birthCertificate"].files[0]);
        const objBirthCertificate = {
          actaNacimientoRender: birthCertificateBlob,
          actaNacimiento: birthCertificate
        };
        const validateFile = this.validateTypeFile(birthCertificate);
        if (birthCertificate.size > `${this.MAX_SIZE_FILES}`) {
          Swal.fire({
            title: "Archivo muy grande.",
            text: `El archivo tiene que ser menor a ${this.sizeFile} MB. Por favor intenta nuevamente.`,
            icon: "warning",
            confirmButtonText: "Aceptar"
          });
          //alert(`El archivo tiene que ser menor a ${this.sizeFile} MB. Por favor intenta nuevamente.`);
        } else if (!validateFile) {
          Swal.fire({
            title: "Formato de archivo invalido.",
            text: `Solo puedes subir archivos en formato .pdf .jpeg .jpg. Por favor intenta nuevamente.`,
            icon: "error",
            confirmButtonText: "Aceptar"
          });
          //alert("El tipo de archivono es valido. Solo puedes subir archivos en formato .pdf .jpeg .jpg. Por favor intenta nuevamente.");
        } else {
          this.$emit("updateProperties", objBirthCertificate);
        }
      },
  
      validateTypeFile(file){
        const format = file.type;
        const arrayFormats = ["application/pdf", "image/jpg", "image/jpeg", "image/png"];
        const validateFormat = arrayFormats.some( type => type === format);
        return validateFormat;
      }
    },
  
    template:`
    <form v-on:submit="updateFile">
      <label for="birthCertificate">Adjuntar Acta de Nacimiento</label>
      <v-legendFiles/>
      <input 
        type="file" 
        name="birthCertificate" 
        id="birthCertificate" 
        accept=".jpg, .jpeg, .pdf"
      >
      <v-button>Actualizar</v-button>
    </form>
    `
  }
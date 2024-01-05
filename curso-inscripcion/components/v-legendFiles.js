export const vLegendFiles = {
    inject: ["MAX_SIZE_FILES", "sizeFile"],
    
    template: `
      <p class="legendFiles" v-bind=size>
        Tamaño máximo de archivos: {{ this.sizeFile }} MB
      </p>
      <p class="legendFiles">Formatos aceptados: .pdf, .jpeg y .jpg</p>
    `
  };
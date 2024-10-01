import { typeFile } from "../helpers/typeFile.js";
import { getData } from "../service/api.js";

export const vFindFile = {
  inject: ["API"],

  data() {
    return {
      message: "",
    };
  },

  methods: {
    async findFileCURP(e) {
      e.preventDefault();
      this.message = "Buscando...";
      const curp = e.target.curp.value;
      const typeDoc = e.target.typeDoc.value;
      const endpoint = `${this.API}/file/${curp}?type=${typeDoc}`;
      const res = await getData(endpoint);
      if (res.file) {
        const type = typeFile(res.typeFile);
        console.log(res);
        const base64Response = await fetch(
          `data:${type};base64,${res.file.file}`
        );
        const blob = await base64Response.blob();
        const fileURL = URL.createObjectURL(blob);
        this.fileSource = fileURL;
        this.message = "";
        window.open(this.fileSource, "_blank");
      }
      if (res.errorCode) {
        this.message = res.msg;
      }
    },
  },

  template: `
    <form 
        v-on:submit="findFileCURP"
        class="formFile"
    >
        <h4>Buscar comprobante.</h4>
        <label for="typeDoc">
            Selecciona el tipo de documento:
        </label>
        <select name="typeDoc" id="typeDocumentSelected">
            <option value="nacimiento">Acta de Nacimiento</option>
            <option value="estudios">Comprobante de Estudios</option>
            <option value="domicilio">Comprobante de Domicilio</option>
        </select>
        <label for="curp">CURP</label>
        <input 
            name="curp"
            onkeyup="javascript:this.value=this.value.toUpperCase();"
        >
        
        <button>Enviar</button>
    </form>

    <p
        class="message"
    >
        {{ message }}
    </p>
    `,
};

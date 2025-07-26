import { getData } from "../service/api.js";

export const vAvailableFI = {
    inject: ["API", "loader", "piecesInformation"],

    methods: {
        async generateList() {
            const container = "informacion";
            this.loader();
            const endpoint = `${this.API}/listBlobs/${container}`;
            const res = await getData(endpoint);
            this.piecesInformation.linksFI = [...res.message];
            this.loader();
        },
        async deleteFile(file) {
            const endpoint = this.API + file.url;
            const res = await getData(endpoint, "DELETE");
            if (res.file) {
              const filterPiecesInformation =  this.piecesInformation.linksFI.filter(item => item.name !== file.name)
              this.piecesInformation.linksFI = [...filterPiecesInformation];
            }
        },
    },

    template: `
        <div class="section-files">
            <h4>Ver Fichas de Información disponibles en el sistema.</h4>

            <div>
                <button v-on:click="generateList">Consultar</button>
            </div>

            <v-tablePiecesInfCloud
                @deleteFile="deleteFile"
                class="piecesInformationCloud"
            />
        </div>
    `
};
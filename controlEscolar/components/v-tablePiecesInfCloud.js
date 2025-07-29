export const vTablePiecesInfCloud = {
    inject: ["piecesInformation"],

    data() {
        return {
            showTable: this.piecesInformation.linksFI.length > 0
        }
    },

    methods: {
        deleteFI(name) {
            const deleteFile = {
                url: `/fileInformation/${name}`,
                name: name
            }
            this.$emit("deleteFile", deleteFile);
        },

        showFI(url) {
            window.open(url, 'blank')
        }
    },

    template: `
    <div class="table-responsive">
        <table 
            v-if="showTable"
            class="table"
        >
            <thead>
                <tr>
                    <th class="table--FI">Fichas de Información en el sistema: {{this.piecesInformation.linksFI.length}}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody class="table--body">
                <tr v-for="(itemFI, i) in piecesInformation.linksFI" :key="i" >
                    <td 
                        class="td--FI"
                        @click="showFI(itemFI.url)"
                    >
                        {{ i + 1 }}. {{ itemFI.name }}
                     </td>
                    <td id="td--delete">
                        <IconCancel v-on:cancel="() => deleteFI(itemFI.name)"/>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `
}
export const vTablePiecesInfCloud = {
    inject: ["piecesInformation", "API"],

    watch: {
        "piecesInformation": {
            handler(newFIList) {
                const filterPiecesInformation = newFIList
                    .filter(item => item.name !== file.name)
                this.piecesInformation = [...filterPiecesInformation];
            },
            inmediate: true
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
    <div class="table-responsive"></div>
        <table class="table">
            <thead>
                <tr>
                    <th class="table--FI">Nombre</th>
                    <th></th>
                </tr>
            </thead>
            <tbody class="table--body">
                <tr v-for="(itemFI, i) in piecesInformation.arrayPiecesInfCloud" :key="i" >
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
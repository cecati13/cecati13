export const vUploadFile = {
    data(){
        return {
            arrayFilesNames : [],
            arrayFilesUpload: [],
            filesShow : false
        }
    },

    methods: {
        uploadFI(e) {
            e.preventDefault();
            const totalFiles = e.target.fileInformation.files.length;
            for (let i = 0; i < totalFiles; i++) {
                const file = e.target.fileInformation.files[i];
                this.arrayFilesUpload.push(file);
            }            
            this.$emit("fileInformation", this.arrayFilesUpload);
            this.cleanArrays();
            document.getElementById("inputFiles").value = "";
        },

        selectedFiles(e){
            this.cleanArrays();
            const totalFiles = e.target.files.length;
            let index = 0;
            while (index < totalFiles) {
                const fileName = e.target.files[index].name;
                this.arrayFilesNames.push(fileName);
                index++;
            }
            this.filesShow = this.arrayFilesNames.length > 0 ? true : false;
        },

        cleanArrays(){
            while (this.arrayFilesNames.length > 0) {
                this.arrayFilesNames.pop();
                this.arrayFilesUpload.pop();
            }
        }
    },

    template: `
    <h4>Subir Fichas de Información de cursos al sistema.</h4>
    <form v-on:submit="uploadFI">
        <label>Arrastra los archivos al espacio inferior:</label>
        <input
            type="file"
            name="fileInformation"
            id="inputFiles"
            accept=".pdf"
            multiple
            @input="selectedFiles"
        >
        <p Archivos v-if="filesShow"> {{ arrayFilesNames.length }} Archivos seleccionados:</p>
        <p v-for="item in arrayFilesNames" :key="item"> {{ item }} </p>
        <button>Generar URL</button>
    </form>
    `
};
export const vInformationFiles = {

    data() {
        return {
            uploadFiles: true,
            linksFI: [],
        }
    },

    methods: {
        async uploadFileFI(arrayFiles) {
            const formFiles = new FormData();
            arrayFiles.forEach((file) => {
                formFiles.append("fileFI", file);
            });
            const enpoint = `${this.API}/fileInformation`;
            const res = await this.sendFiles(formFiles, enpoint);
            this.messageFI = true;
            this.showUrlMessageUpload(res.message);
        },
    },

    template: `
        <section class="section-files">
            <v-uploadFile
                v-if=uploadFiles
            ></v-uploadFile>

            <div
                class="uploadFiles"
            >
                <p 
                    v-for="link in linksFI"
                >
                    {{ link }}
                </p>
            </div>

            <v-availableFI />
        </section>
    `
};


export const vInformationFiles = {

    template: `
        <v-uploadFile
            v-on:fileInformation="uploadFileFI"
        ></v-uploadFile>

        <div
            class="uploadFiles"
        >
            <p 
                v-for="link in arrayForLinksFI"
            >
                {{ link }}
            </p>
        </div>

        <v-availableFI 
            v-if=auth&&listButton&&optionPiecesInformation
            v-on:listFI="generateList"
        ></v-availableFI>

         <v-tablePiecesInfCloud
            v-if=auth
            v-on:deleteFile="deleteFile"
            class="piecesInformationCloud"
        />
    `
};


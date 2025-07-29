import { formatFileSize } from "../helpers/formatFileSize.js";
import { postFormData } from "../service/api.js";

export const vUploadFile = {
    inject: ["API"],

    data() {
        return {
            linksFI: [],
            selectedFiles: [],
            filesShow: false,
            isUploading: false,
            formatFileSize: (bytes) => formatFileSize(bytes)
        }
    },

    computed: {
        fileNames() {
            return this.selectedFiles.map(file => file.name);
        },

        fileCount() {
            return this.selectedFiles.length;
        },

        shouldShowFiles() {
            return this.fileCount > 0;
        }
    },

    watch: {
        selectedFiles: {
            handler(newFiles) {
                this.filesShow = newFiles.length > 0;
            },
            immediate: true
        }
    },

    methods: {
        handleFileSelection(event) {
            const files = Array.from(event.target.files);
            this.selectedFiles = files;
        },

        clearFiles() {
            this.selectedFiles = [];
            this.filesShow = false;
            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = '';
            }
        },

        removeFile(index) {
            this.selectedFiles.splice(index, 1);
        },

        async uploadFiles(event) {
            event.preventDefault();

            if (this.selectedFiles.length === 0) {
                return;
            }
            this.isUploading = true;

            try {
                const formFiles = new FormData();
                this.selectedFiles.forEach((file) => {
                    formFiles.append("fileFI", file);
                });
                const enpoint = `${this.API}/fileInformation`;
                const res = await postFormData(enpoint, formFiles);
                if (res.message) {
                    this.linksFI = [...res.message]
                }
            } catch (error) {
                console.error('Error al subir archivos:', error);
            } finally {
                this.isUploading = false;
                this.clearFiles();
            }
        },
    },

    template: `
    <div class="upload-file-component">
        <h4>Subir Fichas de Información de cursos al sistema.</h4>
        
        <form 
            @submit="uploadFiles"    
            class="section-files">
            
            <label for="fileInput">Arrastra los archivos al espacio inferior:</label>
            
            <input
                ref="fileInput"
                type="file"
                name="fileInformation"
                id="fileInput"
                accept=".pdf"
                multiple
                @change="handleFileSelection"
                :disabled="isUploading"
            >
            
            <!-- Mostrar información de archivos seleccionados -->
            <div v-if="shouldShowFiles" class="files-info">
                <p class="files-count">{{ fileCount }} Archivo{{ fileCount !== 1 ? 's' : '' }} seleccionado{{ fileCount !== 1 ? 's' : '' }}:</p>
                
                <div class="files-list">
                    <div 
                        v-for="(file, index) in selectedFiles" 
                        :key="file.name + '-' + index"
                        class="file-item"
                    >
                        <span class="file-name">{{ file.name }}</span>
                        <span class="file-size">({{ formatFileSize(file.size) }})</span>
                        <span>
                            <IconCancel @click="removeFile(index)"/>
                        </span>
                    </div>
                </div>
            </div>
            
            <button 
                type="submit" 
                :disabled="!shouldShowFiles || isUploading"
                class="upload-btn"
            >
                {{ isUploading ? 'SUBIENDO ARCHIVO...' : 'Generar URL' }}
            </button>
        </form>

        <div
            class="uploadFiles"
        >
            <p 
                v-for="link in linksFI"
                :key="link"
            >
                {{ link }}
            </p>
        </div>
    </div>
    `
};
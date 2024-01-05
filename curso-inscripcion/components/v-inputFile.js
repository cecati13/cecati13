export const vInputFile = {
    //input falta implementar en los luagres donde se subiran archivos
    data(){
        return {
        propertie: ""
        }
    },
    template:`
        <input 
        type="file" 
        name="{{ propertie }}"
        accept=".jpg, .jpeg, .pdf"
    >
    `
};
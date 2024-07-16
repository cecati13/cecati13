export const vTagCurp = {
    inject: ["reactive"],
    template: `
    <label for="curp">CURP</label>
    <input 
        type="text" 
        id="valueCurp" 
        name="curp" 
        placeholder="CURP..."
        required
        v-bind:value=reactive.curp
        onkeyup="javascript:this.value=this.value.toUpperCase();"
    >`
  };
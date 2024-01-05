import { CONSTANTS } from "../../shared/constants.js";

export const vDisability = {
    data() {
      return {
        discapacidades: CONSTANTS.discapacidades,
        padecimientos: CONSTANTS.padecimientos,
      }
    },
  
    template: `
    <p>¿Presentas alguna discapacidad?</p>
      <label for="disability">
        <select name="disability" id="disability" required>
          <option v-for= "disability in discapacidades">{{ disability }}</option>
        </select>
      </label>
    <label for="padecimiento">¿Tienes algún padecimiento de salud? Diabetes, Asma, Epilepsia, etc.</label>  
      
    <input list="list-suffering" id="suffering" name="padecimiento" required>
    <datalist id="list-suffering">
      <option v-for="padecimiento in padecimientos">{{ padecimiento }} </option>
    </datalist>
    `
  };
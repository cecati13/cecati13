import { CONSTANTS } from "../../shared/constants.js";

export const vDisability = {
  data() {
    return {
      listDisability: false,
      discapacidades: CONSTANTS.discapacidades,
      padecimientos: CONSTANTS.padecimientos,
    };
  },

  methods: {
    fnDisability(event) {
      this.listDisability = event.target.value === "SI";
    },
  },

  template: `
    <p>¿Presentas alguna discapacidad?</p>
      <label for="disability">
        <select name="disability" id="disability" required>
          <option v-for= "disability in discapacidades">{{ disability }}</option>
        </select>
      </label>
    
      <div class="v-suffering">
        <p>¿Tienes algún padecimiento de salud?</p>
        
        <div>
          <label for="padecimiento" name="isDisability">No
            <input 
              type="radio" 
              value="NO"
              name="isDisability"
              v-on:change="fnDisability"
            />
          </label>
          <label for="padecimiento" name="isDisability">Si
            <input 
              type="radio" 
              value="SI"
              name="isDisability"
              v-on:change="fnDisability"
            />
          </label>
        </div>        
      </div>

      <div v-if="listDisability" class="v-suffering-especif">
        <p>Especifica el nombre del padecimiento.</p>

        <input list="list-suffering" id="suffering" name="padecimiento" required>
        <datalist id="list-suffering">
          <option v-for="padecimiento in padecimientos">{{ padecimiento }} </option>
        </datalist>
      </div>
    `,
};

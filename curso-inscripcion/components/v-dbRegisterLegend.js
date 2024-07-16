export const vDbRegisterLegend = {
    inject: ["reactive"],
    template: `
    <h4>Bienvenido a un nuevo curso en el CECATI 13.</h4>
    <p><span class="register__preSend--data">{{ reactive.studentDB.nombre }} {{ reactive.studentDB.a_paterno }} {{ reactive.studentDB.a_materno }}</span> usaremos la información personal del último curso del que tenemos registro.</p>
    <br>
    `
  }
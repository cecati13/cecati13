export const vContact = {
    data(){
      return {
        formatEmail: true,
        formatPhone: true,
        legendPhoneError: "Incorrecto. Verifica que sea un número a 10 dígitos, sin espacios ni guiones. Ejemplo: 5544332211"
      }
    },
  
    methods:{
      contactDetailCompleted(e){
        e.preventDefault()
        const email = e.target.children['email'].value
        const phone = e.target.children['telefono'].value
        const verifyEmail = this.validateEmail(email);
        const verifyPhone = this.validatePhone(phone)
        if (verifyPhone && verifyEmail) {
          const formatPhone = this.formatedNumberPhone(phone);
          const objContact = {
            email: email,
            telefono: phone,
            formatPhone: formatPhone
          }
          this.$emit("contactDetailCompleted", objContact)
        } else {
          Swal.fire({
            title: "Error",
            text: "Verifica que tu teléfono y correo electrónico sean correctos y esten en el formato solicitado.",
            icon: "error",
            confirmButtonText: "Aceptar"
          });
        }
      },
  
      verifyEmail(e){
        const email = e.target.value;
        const validate = this.validateEmail(email);
        validate ? this.formatEmail = true : this.formatEmail = false;
      },
      
      verifyPhone(e){
        const phone = e.target.value;
        const validate = this.validatePhone(phone);
        validate ? this.formatPhone = true : this.formatPhone = false;
      },
  
      validateEmail(email){
        const expReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
        const validateEmail = expReg.test(email);
        return validateEmail;
      },
  
      validatePhone(phone){
        const expReg = /[0-9]/;
        const onlyNumber = expReg.test(phone);      
        const validatePhone = onlyNumber && phone.length === 10 ? true : false;
        return validatePhone;
      },
  
      formatedNumberPhone(telefono){
        const arraytTel = telefono.split("");
        const lada = [arraytTel[0], arraytTel[1]];
        const firtsPart = [arraytTel[2],arraytTel[3],arraytTel[4],arraytTel[5]];
        const secondPart = [arraytTel[6],arraytTel[7],arraytTel[8],arraytTel[9]];
        const arrayFormated = [...lada, " ", ...firtsPart, " ", ...secondPart];
        const numberFormat = arrayFormated.join("");
        return numberFormat;
      }
    },
  
    template: `
    <form v-on:submit="contactDetailCompleted">
      <h4>Datos de contacto:</h4>
      <label for="email">Correo Electrónico</label>
      <input 
        type="email" 
        name="email" 
        placeholder="email válido..."
        v-on:change="verifyEmail"
        required
      >
      <p v-if="!formatEmail" class="contactError">
        Incorrecto. Verifica que tu correo electrónico sea valido.
      </p>
  
      <label for="telefono">Teléfono</label>
      <input 
        type="tel"
        name="telefono"
        placeholder="Número a 10 dígitos"
        v-on:change="verifyPhone"
        required
        pattern="[0-9]{10}"
        v-bind:title=legendPhoneError
      >
      <p v-if="!formatPhone" class="contactError">
        {{ legendPhoneError }}
      </p>
      <p>Tanto los docentes como el área de control escolar utilizan estos medios para ponerse en contacto y brindar instrucciones a los estudiantes.</p>
      <v-button></v-button>
    </form>
    `
  };
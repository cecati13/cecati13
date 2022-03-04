Vue.createApp({
    data() {
        return {        
            portada: "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes11.jpeg",
    
            image: [
                "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes11.jpeg",
                "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes16.jpeg",
                "https://cecati13web.blob.core.windows.net/galeria/zonas_comunes18.jpg"
            ],

            price: 8400,

            value: 0,

            

            methods:{
                toggleShowPrices(){
                    this.showPrices = !this.showPrices;
                  }
             },

            computed:{
                convertedValue(){
                    if(!this.value) {
                        return 0
                    } else {
                        return this.value/this.price
                    }
                }
            }
        }
    }
    }).mount('#app')


    new Vue({
        el: '#app',
      
        data() {
          return {
            name: 'Bitcoin',
            img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
            changePercent: 10,
            color: 'f4f4f4',
            price: 8400,
            pricesWithDays: [
              { day: 'Lunes', value: 8400 },
              { day: 'Martes', value: 7900 },
              { day: 'Miercoles', value: 8200 },
              { day: 'Jueves', value: 9000 },
              { day: 'Viernes', value: 9400 },
              { day: 'Sabado', value: 10000 },
              { day: 'Domingo', value: 10200 },
            ],
            showPrices: false,
          }
        },
        methods: {
          toggleShowPrices() {
            this.showPrices = !this.showPrices;
      
            this.color = this.color.split('').reverse().join(''); //* Tomamos el string del color y le damos la vuelta.
          }
        }
    });
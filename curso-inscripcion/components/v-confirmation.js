export const vConfirmation = {
    inject: ["course", "dataConfirmation"],
    template: `
    <div class="confirmation">
      <p>Inscripción recibida. {{ this.dataConfirmation.fechaRegistro }}</p>
      <br>
      <p>{{ this.dataConfirmation.nombre }}, has sido preinscrito en el curso: </p>
      <p><span class="confirmation--data">{{ this.course.curso }}</span>.</p>
      <p>Horario de {{ this.course.dias_de_clases }} de <span class="confirmation--data">{{ this.course.hora_inicio }} a {{ this.course.hora_fin }} hrs. </span></p> 
      <p>Profesor <span class="confirmation--data">{{ this.course.profesor }}</span>.</p>
      <p>Inicio: <span class="confirmation--data">{{ this.course.fecha_inicio }}</span>.</p>
      
      <br>
      <p>Tú número de matrícula: <span class="confirmation--data">{{ this.dataConfirmation.matricula }}</span></p>
  
      <br>
      <p>Revisaremos tu información, y en un plazo de 1 a 2 días <span class="confirmation--data">hábiles</span> te contactaremos para darte instrucciones respecto al pago del curso.</p>
      
      <br>
      <p>¡Gracias por tu preferencia!</p>
      
      <br>
  
      <a href="../cursos"><v-buttonUpdate>Inscribirme a otro curso</v-buttonUpdate></a>
    </div>
    `
  };
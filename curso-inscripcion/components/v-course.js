export const vCourse = { 
    inject: ["course"],
    template: `
    <article v-bind:value="course" class="article__course">
        <p class="register__preSend--data">{{ course.curso }}.</p>
        <p>Especialidad: {{ course.especialidad }}.</p>
        <p>Impartido por {{ course.profesor }}.</p>
        <p>El curso inicia el {{ course.fecha_inicio }}.</p>
        <p>Costo: $ {{course.costo}}</p>
    </article>
    `
  };
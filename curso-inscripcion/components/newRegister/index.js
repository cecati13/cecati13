export default {
    component: ("newRegister", {
        template: `
        <div id="newRegister" class="register">
        <button onclick="studentC13NO()">NO he estado inscrito antes en el CECATI 13</button>
        <h4>Por favor proporciona la siguiente información personal para tu inscripción</h4>
        <form id="dataGeneral">
            <tagCurp></tagCurp>
            <p>Los siguientes datos los usaremos para verificar que tu CURP sea correcta:</p>
            <label for="nombre">Nombre</label><span class="required">*</span>
            <input type="text" id="nombre" name="nombre" placeholder="Escribe tu nombre de pila...">
            <label for="a_paterno">Apellido Paterno</label><span class="required">*</span>
            <input type="text" id="a_paterno" name="a_paterno" placeholder="Tu apellido paterno...">
            <label for="a_materno">Apellido Materno</label><span class="required">*</span>
            <input type="text" id="a_materno" name="a_materno" placeholder="Tu apellido materno...">
            <label for="genero">Hombre 
                <input type="radio" id="genero" name="genero" value="MASCULINO">
            </label>
            <label for="genero">Mujer
                <input type="radio" id="genero" name="genero" value="FEMENINO">
            </label>
            <label for="birthday">Fecha de Nacimiento</label><span class="required">*</span>
            <input type="date" name="birthday" placeholder="Fecha de nacimiento...">
            <label for="estado">
                <span>Lugar de Nacimiento</span>
                <input list="estado">
                <datalist id="estado">
                    <option v-for="item in estados" :key="item">{{ item }}</option>                
                </datalist>
            </label>
            <p class="Edad Minima">Lo sentimos, la edad minima para poder inscribirte a alguno de nuestros cursos es 15 años cumplidos</p>
            <label for="email">Correo Electrónico</label>
            <input type="email" name="email" placeholder="Escribe un correo electronico válido...">
            <label for="telefono">Teléfono</label><span class="required">*</span>
            <input type="tel" name="telefono" placeholder="Número Telefónico donde podamos contactarte...">
            <p>La mayoría de los docentes crean grupos de WhatsApp para dar instrucciones a sus estudiantes, por verifica que sea correcto.</p>
            <p>Domicilio.</p>
            <label for="calle">Calle y número</label><span class="required">*</span>
            <input type="text" id="calle" name="calle" placeholder="Calle y número...">
            <label for="colonia">Colonia</label><span class="required">*</span>
            <input type="text" id="colonia" name="colonia" placeholder="Colonia...">
            <label for="alcaldia">Municipio o Alcaldía</label><span class="required">*</span>
            <input type="text" id="alcaldia" name="alcaldia" placeholder="Municipio o Alcaldía...">
            <!-- https://copomex.com/#pricing-section por 330 para agilizar este tramite -->
            <label for="cp">Código Postal</label><span class="required">*</span>
            <input type="number" id="cp" name="cp" placeholder="Código Postal...">
            <label for="estado">Estado</label><span class="required">*</span>
            <input type="text" id="estado" name="estado" placeholder="Estado...">
            
            <label for="escolaridad">
                <span>Escolaridad</span>
                <select name="escolaridad" id="scholarship">            
                <option v-for="item in arrayEscolaridad" :key="item">{{ item }}</option>
                
            </label>
    
            <p>¿Presenta alguna discapacidad? <span class="required">*</span></p>
            <label for="disability">visual</label>
            <input type="radio" name="disability" id="" value="visual">
            <label for="disability">auditiva</label>
            <input type="radio" name="disability" id="" value="auditiva">
            <label for="disability">de comunicación</label>
            <input type="radio" name="disability" id="" value="comunicacion">
            <label for="disability">motriz</label>
            <input type="radio" name="disability" id="" value="motriz">
            <label for="disability">intelectual</label>
            <input type="radio" name="disability" id="" value="intelectual">
            <label for="disability">ninguna</label>
            <input type="radio" name="disability" id="" value="ninguna">
            <p>Documentos necesarios para tu inscripción:</p>
            <ul>
                <li>Acta de Nacimiento</li>                    
                <li>Comprobante de Domicilio</li>
                <li>Escolaridad</li>
            </ul>
            
            <label for="birthCertificate">Adjuntar Acta de Nacimiento</label>
            <input type="file" name="birthCertificate" >
    
            <label for="addressCertificate">Adjuntar Comprobante de Domicilio</label>
            <input type="file" name="addressCertificate" >
    
            <label for="studiesCertificate">Adjuntar Comprobante de máximo grado de estudios</label>
            <input type="file" name="studiesCertificate" >
            
            <p>Usaremos esta información para pre-inscribirte al curso, y contactarte si fuera necesario<span id="selectedCourse"></span></p>
            <input type="submit" value="Pre-inscribirse"></input>
        </form>
        </div>
        `
    })
}

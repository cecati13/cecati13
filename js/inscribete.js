const registrationLink = "https://docs.google.com/forms/d/e/1FAIpQLSd66gRs37cyA9ttFND7chD5VDQ9PIhfE1M4Re110FgL-XbvXg/closedform";
const stepOne = {
    stepNumber: 1,
    title: "Ten a la mano...",
    content: [
        "CURP.",
        "Acta de Nacimiento.",
        "Comprobante de domicilio.",
        "Documento de último grado de estudios."        
    ],
    observations: 
        `Correo electrónico y número de whatsapp, 
        Estan serán las vias de comunicación para 
        brindarte indicaciones e información del curso.
        Asegurate que estos datos sean correctos, 
        de lo contrario no podremos comunicarnos contigo.`
}

const stepTwo = {
    stepNumber: 2,
    title: "Registrate en el formulario.",
    content: registrationLink,
    //aqui hay que usar expresiones regulares para saber si es una URL
    observations: 
        `Registra correctamente tus datos y los datos del curso.
        Los registro mal elaborados no se tomarán en cuenta para
        el proceso de inscripción.`,    
}

const stepThree = {
    stepNumber: 3,
    title: "Espera...",
    content: 
        `En cuanto te asignemos un lugar, te enviaremos un correo 
        para confirmar tu lugar y la cuenta del plantel para que 
        puedas realizar tú depósito.`
    ,
    observations: "Limitado a 25 alumnos por curso"
}

const stepFour= {
    stepNumber: 4,
    title: "Realiza tu pago",
    content:        
        `Una vez realizado tu deposito sube la misma al formulario
        que te proporcionaron para tal fin.`,
    observations: "Costo de cursos: $300.00."
}

const stepFive = {
    stepNumber: 5,
    title: "Recibe tu confirmación de inscripción.",
    content: 
        `Con tu confirmación de inscripción, te enviaremos 
        los datos de tu docente, el cual se pondrá en 
        contacto contigo para iniciar tu curso.`,
    observations: 
        `Recuerda que tenemos cupo limitado, en caso de no 
        recibir correo de respuesta, es posible que el curso 
        ya haya alcanzado su cupo máximo.`
}

const nodeParent = document.getElementById("inscribete");

const tituloH3 = document.createElement("h3");
tituloH3.className = "inscribete__title";
const textoh3 = document.createTextNode("Pasos para inscribirte a nuestros cursos:");
tituloH3.appendChild(textoh3);
nodeParent.appendChild(tituloH3);


function createSteps (stepExecuted) {
    let stepContainer = [];

    const stepTitleNumber = document.createElement("span");
    const textTitleNumber = document.createTextNode(stepExecuted.stepNumber);
    stepTitleNumber.appendChild(textTitleNumber);
    stepTitleNumber.className = "inscribete__container__TitleNumber";

    const stepTitleDescription = document.createElement("span");
    const textStepTitle = document.createTextNode(stepExecuted.title);
    stepTitleDescription.className = "inscribete__container__stepsTitle";
    stepTitleDescription.append(textStepTitle);

    const containerStepTitle = document.createElement("div");
    containerStepTitle.append(stepTitleNumber, stepTitleDescription);
    
    stepContainer.push(containerStepTitle);
    
    const stepContent = stepExecuted.content;
    if (Array.isArray(stepContent)) {
        //aqui generamos la lista ordenada
        const containerListStep = document.createElement("ol");
        containerListStep.className = "inscribete__step--ol";
        for (let index = 0; index < stepContent.length; index++) {
            const element = stepContent[index];
            const requirementLI = document.createElement("li");
            const requirementText = document.createTextNode(element);
            requirementLI.appendChild(requirementText);
            containerListStep.appendChild(requirementLI);            
        }
        stepContainer.push(containerListStep);
    // } else if (condition) {
        //expression regular para URL. Crear Boton para formulario.
    } 
    else {
        //cuando el contenido es solo texto un div
        console.log("aqui creamos div cuando es solo texto");
    }

    const elementObservations = document.createElement("div");
    const textObservations = document.createTextNode(stepExecuted.observations);
    elementObservations.className = "inscribete__step__observations";
    elementObservations.appendChild(textObservations);
    stepContainer.push(elementObservations);    
    
    //montar en DOM    
    const containerOfStep = document.createElement("div");
    containerOfStep.className = "inscribete__container";
    containerOfStep.id = `step${stepExecuted.stepNumber}`;
    containerOfStep.dataset.number = stepExecuted.stepNumber;
    containerOfStep.append(...stepContainer);

    nodeParent.append(containerOfStep);
}

const nextStep = function () {
    createSteps(allTheSteps[stepCounter]);
    stepCounter++;    
    if (stepCounter === allTheSteps.length) {
        const buttonSteps = document.querySelector("#buttonSteps");
        buttonSteps.classList.add("button__hide")        
    }
    //const nodeNext =  document.querySelector(currentStep);
}

function createButton() {    
    const buttonSteps = document.createElement("div");
    buttonSteps.textContent = "SIGUIENTE";
    buttonSteps.className = "button";
    buttonSteps.id = "buttonSteps";
    buttonSteps.addEventListener("click", nextStep);

    nodeParent.append(buttonSteps);
}

const allTheSteps = [stepOne, stepTwo, stepThree, stepFour, stepFive];
let stepCounter = 1;

createSteps(allTheSteps[0]);
createButton();


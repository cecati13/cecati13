const registrationLink = "https://forms.gle/UwKxyZkwzjABd4pX6";
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
        `Usaremos correo electrónico y WhatsApp para comunicarnos contigo  
        y brindarte algunas indicaciones e información del curso.
        Por favor, asegúrate que estos datos sean correctos.`

}

const stepTwo = {
    stepNumber: 2,
    title: "Registrate en el formulario.",
    content: registrationLink,
    //aqui hay que usar expresiones regulares para saber si es una URL
    observations: 
        `Registra correctamente tus datos personales y los datos del curso que deseas tomar.
        Los registros mal elaborados no se tomarán en cuenta para el proceso de inscripción.`,    
}

const stepThree = {
    stepNumber: 3,
    title: "Espera...",
    content: 
        `En cuanto te asignemos un lugar, te enviaremos un correo 
        de confirmación y la cuenta bancaria del plantel para que 
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
        haya alcanzado su cupo máximo.`
}

const nodeParent = document.getElementById("nodeSignUp");
const nodeContainerSteps = document.getElementById("containerSteps");

const tituloH3 = document.createElement("h3");
tituloH3.className = "singUp__title";
tituloH3.id = "singUp-Title"
const textoh3 = document.createTextNode("Pasos para inscribirte a nuestros cursos:");
tituloH3.appendChild(textoh3);
nodeParent.insertBefore(tituloH3,nodeContainerSteps);

function createSteps (stepExecuted) {
    let stepContainer = [];

    const stepTitleNumber = document.createElement("span");
    const textTitleNumber = document.createTextNode(stepExecuted.stepNumber);
    stepTitleNumber.appendChild(textTitleNumber);
    stepTitleNumber.className = "singUp__container__TitleNumber";

    const stepTitleDescription = document.createElement("span");
    const textStepTitle = document.createTextNode(stepExecuted.title);
    stepTitleDescription.className = "singUp__container__stepsTitle";
    stepTitleDescription.append(textStepTitle);

    const containerStepTitle = document.createElement("div");
    containerStepTitle.className = "containerStepTitle";
    containerStepTitle.append(stepTitleNumber, stepTitleDescription);
    
    stepContainer.push(containerStepTitle);
    
    const stepContent = stepExecuted.content;
    const isURL = /^https:/
    //evaluar tipo de dato en stepExecuted.content
    if (Array.isArray(stepContent)) {        
        const containerListStep = document.createElement("ul");
        containerListStep.className = "singUp__step--ul";
        for (let index = 0; index < stepContent.length; index++) {
            const element = stepContent[index];
            const requirementLI = document.createElement("li");
            const requirementText = document.createTextNode(element);
            requirementLI.appendChild(requirementText);
            containerListStep.appendChild(requirementLI);            
        }
        stepContainer.push(containerListStep);

    } else if (isURL.test(stepContent)) {        
        const buttonIncription = document.createElement("a");
        buttonIncription.className = "button";
        buttonIncription.textContent = "Registrarme";
        buttonIncription.href = stepContent;
        buttonIncription.target= "_blank";
        stepContainer.push(buttonIncription);
    } else {        
        const elementStepContent = document.createElement("div");
        const textContent = document.createTextNode(stepContent);
        //crear nueva clase para contrar
        elementStepContent.className = "singUp__step--content";
        elementStepContent.appendChild(textContent);
        stepContainer.push(elementStepContent);
    }

    const elementObservations = document.createElement("div");
    const textObservations = document.createTextNode(stepExecuted.observations);
    elementObservations.className = "singUp__step__observations";
    elementObservations.appendChild(textObservations);
    stepContainer.push(elementObservations);
    
    //montar en DOM    
    const containerOfStep = document.createElement("div");
    containerOfStep.className = "singUp__container";
    containerOfStep.id = `step${stepExecuted.stepNumber}`;
    containerOfStep.dataset.number = stepExecuted.stepNumber;
    containerOfStep.append(...stepContainer);

    nodeContainerSteps.appendChild(containerOfStep);
    //ubicacion de nodo
    const node = `#step${stepExecuted.stepNumber}`;
    return node;
    //searchmountNode(containerOfStep);    
}

const nextStep = function () {
    const nodeStep = createSteps(allTheSteps[stepCounter]);
    const newNode = document.querySelector(nodeStep);
    // const positionX = newNode.getBoundingClientRect().x;
    // const positionY = newNode.getBoundingClientRect().y;
    // window.scroll(positionX, positionY);
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

    nodeParent.appendChild(buttonSteps);
}

const allTheSteps = [stepOne, stepTwo, stepThree, stepFour, stepFive];
let stepCounter = 1;

createButton();
createSteps(allTheSteps[0]);
const container = document.querySelector('.main__welcome');

function obtainSchoolYear() {
    const now = new Date();
    const yearNow = now.getFullYear();

    // Cambio de año ciclo escolar cada: 1 de julio
    if (now.getMonth() < 6 || (now.getMonth() === 5 && now.getDate() < 30)) {
        return `${yearNow - 1}-${yearNow}`;
    }
    return `${yearNow}-${yearNow + 1}`;
}

const h3 = document.createElement('h3');
h3.textContent = obtainSchoolYear();
h3.classList.add('main__welcome--age');
container.append(h3);
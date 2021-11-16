// alert("Tenemos lista la nueva oferta educativa para los meses de Noviembre y Diciembre del Ciclo Escolar 2021-2022.");
// alert("Contamos con las modalidades: a Distancia, Híbridos y Presenciales.");

const menu = document.getElementById("menu");
const nav = document.getElementById("navigator");

menu.addEventListener("click", ()=> {
    menu.classList.toggle("menu__mobile--background");
    nav.classList.toggle("nav__hide");
    nav.classList.toggle("nav__show");
    
})
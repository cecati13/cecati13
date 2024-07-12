const loader = document.querySelector('.loader');
const tagMain = document.querySelector('main');
const buttonAuth = document.querySelector('#Auth');

buttonAuth.addEventListener("click", () => {
    preloader();
    const host = base.verifyHost()
    signIn();
    window.open(`${host}/controlEscolar`, '_self')
})

function preloader() {
    tagMain.style.display === 'none'
        ? tagMain.style.display = 'flex'
        : tagMain.style.display = 'none';
    loader.classList.toggle("preloader");
}
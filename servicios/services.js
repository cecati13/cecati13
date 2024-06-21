const loader = document.querySelector('.loader');
const tagMain = document.querySelector('main');
const buttonAuth = document.querySelector('#Auth');

buttonAuth.addEventListener("click", async () => {
    preloader();
    fetch("http://localhost:3000/API/v1/auth/singin")
        .then(async (res) => {
            const redirectUrl = await res.text();
            window.location.href = redirectUrl;
        }).catch((e) => {
            console.log(e);
            alert("Servicio no disponible por el momento")
        }).finally(() => {
            preloader();
        })
})

function preloader() {
    tagMain.style.display === 'none'
        ? tagMain.style.display = 'flex'
        : tagMain.style.display = 'none';
    loader.classList.toggle("preloader");
}
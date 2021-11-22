//obtenemos la url del servidor
var url = window.location.href;
//definimos que nuestro sw.js se encuentra en el repositorio
var ubicacionSw = '/WAY/sw.js';
if (navigator.serviceWorker) {
    /*Para que nuestro proyecto siga funcionando en localhost
    como en el servidor realizaremos una validación si la url
    contiene localhost la ruta es la local del proyecto, de lo contrario
    es la ruta de nuestro repositorio*/
    if (url.includes('localhost')) {
        ubicacionSw = '/sw.js';
    }
    navigator.serviceWorker.register(ubicacionSw);
}
/*OPCION DE MENU PARA DESPLEGAR*/
const menu = document.querySelector(".menu");
const openMenuBtn = document.querySelector(".open-menu");
const closeMenuBtn = document.querySelector(".close-menu");

function toggleMenu() {
    menu.classList.toggle("menu_opened");
}
openMenuBtn.addEventListener("click", toggleMenu);
closeMenuBtn.addEventListener("click", toggleMenu);
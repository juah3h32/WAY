//importamos el achivo de funciones y accedemos al objeto de la bd y funciones
import tiendabd, { enviar, consultar, crearEtiqueta } from './funciones.js';

/*Al cargar por primera vez el sitio debemos crear la bd,
empleamos la función de tindabd para crear la base de datos tienda
y la tabla de productos, para crear la tabla debemos indicar los atributos
++id indica que el id es auto incremental*/
let bd = tiendabd("Tienda", { productos: `nombre, correo,descripcion` });


/*Genermaos un objeto para cada elemento del formulario que
manipularemos, campos de formulario, botones, tabla, etc 
Campos del formulario. 
Nota: recuerda que el nombre que esta entre paretesis es el nombre de
los id de la etiqueta html*/

//Objetos para acceder a lso input del formulario

const nombre_prod = document.getElementById("nombre");
const correo_prod = document.getElementById("correo");
/*Objeto para acceder a etiqueta que nos mostrará un mesaje en la 
tabla cuando no tengamos productos para mostrar*/
const desc_prod = document.getElementById("descripcion");
const mesajeSinRegistros = document.getElementById("siRegistros");
//Objetos para acceder a los botones del formulario
const btEnviar = document.getElementById("enviar");




//Evento que se ejecuta al abrir la página
window.onload = () => {
    /*Ejecutamos la función de cargar tabla para que se muestren los productos
    que actualmente estan en la BD*/
    cargarTabla();
}



/*Evento click para guardar, se activa al presionar el 
boton guardar del formulario*/
btEnviar.onclick = (evento) => {
    /*Ejecutamos la función guardar de el archivo de funciones
    indicamos que gaurdaremos un producto y que los datos a enviar
    son el nombre, precio y descripción (el id no por que es autoincremental)
    asignamos a cada campo el valor recuperado del formulario
    Nota: Recordar que flag retorna true si se gaurdo el registro y flase si no*/
    let flag = enviar(bd.productos, {
        nombre: nombre_prod.value,
        correo: correo_prod.value,
        descripcion: desc_prod.value
    });

    if (flag) { //Si se guardo limpiamo el formulario
        nombre_prod.value = "";
        correo_prod.value = ""
        desc_prod.value = "";
        //recargamos la tabla para viasulizar el nuevo regsitro
        cargarTabla();

    }
}

/*Función que agrega a la tabla cada producto registrado */
function cargarTabla() {
    //Recuperamos el objeto de la tabla que modificaremos
    const tbody = document.getElementById("tbody");
    /*Si la tabla ya tiene algo, la limpiamo de lo 
    contrario se duplicarían los registros*/
    while (tbody.hasChildNodes()) {
        tbody.removeChild(tbody.firstChild);
    }
    /*Ejecutamos la función de consultar del archivo de funciones
    la cual recibe la lista de productos*/
    consultar(bd.productos, (productos) => {
        //Si existen productos
        if (productos) {
            /*Esta variable muesta el texto cuando no hay productos
            cuando hay debemos limpiar el mensaje*/
            mesajeSinRegistros.textContent = "";
            /*Empleamos la función crearEtiqueta del archivo de funciones
            crearemos una nueva fila para la tabla*/
            crearEtiqueta("tr", tbody, (tr) => {
                //Recorremos cada producto consultado
                for (const atributo in productos) {
                    //Crearemos una  columna para cada atributo de el producto evaluado por el for
                    crearEtiqueta("td", tr, (td) => {
                        /*Asignamos el valor de cada atributo del producto a la nueva columna
                        la validación indica que si el campo es el de precio se le agrege un signo de $*/
                        td.textContent = productos.correo === productos[atributo] ? ` ${productos[atributo]}` : productos[atributo];
                    })
                }

            })
        } else {
            //Si no hay productos registrados mostramos el mensaje bajo el encabezado de la tabla
            mesajeSinRegistros.textContent = "No existen comentarios acerca de WAY";
        }
    })

}
//Función que se activa al presionar el icono de lapiz de un renglón de la tabla
function btnEditar(evento) {
    //Recuperamos el identificador del renglón que es la clave del producto
    let id = parseInt(evento.target.dataset.id);
    //Realizamos una consulta del producto que tiene la clave recuperada
    bd.productos.get(id, producto => {
        //Asignamos al formulario el valor correspondiente del producto seleccionado

        nombre_prod.value = producto.nombre || "";
        costo_prod.value = producto.correo || "";
        desc_prod.value = producto.descripcion || "";

    })
}
//Función que se activa al presionar el icono de menos de un renglón de la tabla
function btnEliminar(evento) {
    /*Recuperamos el identificador del renglón que es la clave del producto
    el id al ser autoincremental es entero debemos realizar el cambio de texto a int*/
    let id = parseInt(evento.target.dataset.id);
    //Eliminamos el registro con el ide recuperado
    bd.productos.delete(id);
    //Actualizamos la tabla
    cargarTabla();

}
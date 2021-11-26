/*Función para crear una nueva base de datos indexDB
recibimos el nombre de la base de datos a crear y el nombre de la tabla
Nota: Si requieres mas de una tabla debes generar dos funcines una para
crear la bd y otra cada tabla*/
const tiendbd = (nombrebd, tabla) => {
    //Creando la bd con el nomvre recibido
    const bd = new Dexie(nombrebd);
    //Crea una tabla con el nombre recibido
    bd.version(1).stores(tabla);
    //Al crear una nueva bd se debe abrir
    bd.open();
    //retornamos el objeto db que dará acceso a base de datos
    return bd;

}


/*Función generica para insertar, recibe el nombre de la tabla
y los datos a 
*/

const enviar = (tabla, datos) => {
    /*emptu valida que los datos enviados no estan vacios o nulos
    flag recibe true si contienen datos y false si estan vacios*/
    let flag = empty(datos);
    //si hay datos para guardar
    if (flag) {
        //la función bulkadd realiza una inserción en la tabla
        tabla.bulkAdd([datos]);
        console.log("inserción realizada")
    } else { //si algun campo esta vacio
        console.log("No puedes dajar campos vacios")
    }
    /*retornamos la bandera si es true se usará para 
    limpiar el formulario*/
    return flag;

}


//Función para validar campos
const empty = object => {
    let flag = false;
    //cada dato enviado del formulario se procesa
    for (const value in object) {
        //si no nulo y contiene un valor
        if (object[value] != "" && object.hasOwnProperty(value)) {
            //retornamos true para proceder con la insercion
            flag = true;
        } else {
            //retornamos true para enviar el error
            flag = false;
        }
    }
    //regresamos el valor que contenga flag (true o false)
    return flag;
}



/*Función generica para consultar, recibe el nombre de la tabla
que se desea consultar y el objeto donde almacenaremos el resultado*/

const consultar = (tabla, productos) => {
    let index = 0;
    tabla.count((cantidad) => {
        if (cantidad) { //si hay productos
            tabla.each(producto => { //extraemos cada producto
                /*los campos de la tabla aparecen en desorden, la
                función ordenarCampos se emplea para dar el orden que queremos*/
                producto = ordenarCampos(producto);
                /*cada producto ordenado se agrega a la lista de productos
                y se incrementa el contador*/
                productos(producto, index++);
            })
        } else {
            //si no hay productos se retorna la lista de productos con 0
            productos(0);
        }
    });
}

/*Función para ordenar las columnas de cada producto
le daremos el orden de la tabla que se visualizará en pantalla*/
const ordenarCampos = producto => {
    /*Generamos en objeto vacio para ir guardando 
    los campos del producto ya odenados*/
    let objProducto = {};
    objProducto = {
            /*asignamos al objto vacio cada columan con el valor del producto
            que se recibe*/
            id: producto.id,
            nombre: producto.nombre,
            correo: producto.precio,
            descripcion: producto.descripcion
        }
        //Retornamos el objeto con el producto ordenado
    return objProducto;
}

/*Función que nos permitirá contruir etiuetas html para incrustarlas
 en la vista indicamos la etiqueta que queremos agregary el lugar 
de la página donde debe incrustarse*/
const crearEtiqueta = (etiqueta, agregarA, funcion) => {
    //Función para crear la etiqueta que solicitemos
    const etiquetaACrear = document.createElement(etiqueta);
    if (etiquetaACrear) { //si se pudo crear
        //Agregamos la nueva etiqueta al sitio donde debe ir
        agregarA.appendChild(etiquetaACrear);
    }
    if (funcion) {
        /*Si se pudo crear se retorna la nueva etiqueta para
        agregar el contenido y estilos acorde a las necesidades */
        funcion(etiquetaACrear);
    }
}

//Retonamos el objeto de neustra bd para poderla manipular
export default tiendbd;
//Cada función creada se retorna
export { enviar, consultar, crearEtiqueta }

/*Al exportar objetos y funciones puden ser usadas por los componentes
que importen este archivo*/
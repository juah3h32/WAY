const CACHE = 'cache';
const CACHE_DINAMICO = 'dinamico-1';
const CACHE_INMUTABLE = 'inmutable-1';

//Indicamos que durante el proceso de intalación
self.addEventListener('install', evento => {
    /*Promesa que crea el proceso de creación del espacio 
    en cache y agrega los archivos necesarios para cargar nuestra
    aplicación*/
    const promesa = caches.open(CACHE)
        .then(cache => {
            return cache.addAll([
                //  '/',
                'index.html',
                'css/index.css',
                'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
                'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swa',
                'manifest.json',
                'img/vector.png',
                'img/no-img.jpeg',
                'img/found.jpg',
                'css/footer.css',
                'img/wave.svg',
                'js/app.js',
                'pages/offline.html',
                'css/offline.css'

            ]);
        });

    //Separamos los archivos que no se modificarán en un espacio de cache inmutable
    const cacheInmutable = caches.open(CACHE_INMUTABLE)
        .then(cache => {
            cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css');
            cache.add('css/offline.css');
            cache.add('pages/offline.html');
        });

    //Indicamos que la instalación espere hasta que las promesas se cumplan
    evento.waitUntil(Promise.all([promesa, cacheInmutable]));
});

self.addEventListener('activate', evento => {
    //antes de activar el sw, obten los nombres de los espacios de cache existentes
    const respuesta = caches.keys().then(keys => {
        //verifica cada nombre de espacios de cache
        keys.forEach(key => {
            //si el espacio no tiene el nombre actual del cache e incluye la palabra cache
            if (key !== CACHE && key.includes('cache')) {
                //borralo, la condición de include cache evitará borrar el espacio dinamico o inmutable
                return caches.delete(key);
            }
        });
    });

});

self.addEventListener('fetch', evento => {


    //Estrategia 2 CACHE WITH NETWORK FALLBACK
    const respuesta = caches.match(evento.request)
        .then(res => {
            //si el archivo existe en cache retornalo
            if (res) return res;

            //si no existe deberá ir a la web
            //Imprimos en consola para saber que no se encontro en cache
            console.log('No existe', evento.request.url);

            //Procesamos la respuesta a la petición localizada en la web
            return fetch(evento.request)
                .then(resWeb => { //el archivo recuperado se almacena en resWeb
                    //se abre nuestro cache
                    caches.open(CACHE_DINAMICO)
                        .then(cache => {
                            //se sube el archivo descargado de la web
                            cache.put(evento.request, resWeb);
                            //Mandamos llamar la limpieza al cargar un nuevo archivo
                            //estamos indicando que se limpiará el cache dinamico y que 
                            //solo debe haber 25 archivos
                            limpiarCache(CACHE_DINAMICO, 25);
                        })
                        //se retorna el archivo recuperado para visualizar la página
                    return resWeb.clone();
                });

        })

    .catch(err => {
        //si ocurre un error, en nuestro caso no hay conexión
        if (evento.request.headers.get('accept').includes('text/html')) {
            //si lo que se pide es un archivo html muestra nuestra página offline que esta en cache
            return caches.match('pages/offline.html');
        }

    });
    evento.respondWith(respuesta);





});
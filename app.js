// Importamos librerías.
const express = require('express'); // Express, para levantar el servidor.
const fetch = require('node-fetch'); // Fetch, para hacer consultas ajax.
const morgan = require("morgan"); // Usamos Morgan para logueo
const { createProxyMiddleware } = require('http-proxy-middleware'); // Usamos proxy para pasar las request de este server directamente al de PokeAPI
const dotenv = require('dotenv'); // Instalamos dotenv para obtener variables de entorno.
dotenv.config(); // Configuramos las variables de entorno.
var cors = require('cors')

// Generamos la app.
const app = express()
// Logueo de requests.
app.use(morgan('dev'));
app.use(cors())

// Indicamos el puerto donde se abrirá el servidor.
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "localhost";

// Indicamos URL de PokeAPI
const POKEAPI_SERVICE_URL = process.env.POKEAPI_SERVICE_URL || "https://pokeapi.co/api/v2/";

// Armamos el manejador para la URL de busqueda de Pokemons.
app.get('/search', async (request, response) => {
	// Respuesta por defecto.
	const ret = { 'status': 'ERR', 'data': [], 'msg': 'Error al procesar los datos.' };
	// Nos fijamos que el método sea GET.
	if(request.method === 'GET') {
		// Obtenemos los Pokemons.
		let pokemons_in_memory = app.get('pokemons') || [];
		try {
			const search = `${request.query['pokemon']}`.toLowerCase(); // Obtenemos el Pokemon a buscar.
			if(search) {
					// Si hay Pokemons que traer
					if(!pokemons_in_memory.length) {
						try {
							// Armamos la URL a llamar para pedir datos de los Pokemons.
							const url = `${POKEAPI_SERVICE_URL}/pokemon?limit=100000`;
							// Datos que vamos a enviar.
							let data = {
								'method': 'GET',
								'headers': {}
							};
							// Ejecutamos la llamada al servidor para traer los Pokemons que necesitamos.
							await fetch(url, data)
							.then(result => result.json())
							.then(result => {
								// Almacenamos los Pokemons en la variable de Pokemons en memoria.
								pokemons_in_memory = result.results;
								// Y luego los guardamos en memoria.
								app.set('pokemons', pokemons_in_memory);
							})
							.catch((error) => { throw new Error(error) });
						} catch(err) {
							console.error('* Fetch error: '+err);
						}
					}
					// Filtramos los Pokemon obtenidos.
					ret['data'] = pokemons_in_memory.filter((pokemon) => {
						const name = `${pokemon.name}`.toLowerCase();
						return name.indexOf(search) !== -1;
					});
					ret['msg'] = `Se obtuvieron ${ret['data'].length} resultados.`;
					ret['status'] = 'OK';
			} else {
				ret['msg'] = 'Debe especificar el nombre de los Pokemons que desea obtener.'
			}
		} catch(err) {
			console.error('* Error al procesar los datos: '+err);
			ret['msg'] = 'Error al procesar los datos.';
		}
	}
	// Devolvemos la respuesta.
	response.json(ret)
})

// Endpoint del proxy a PokeAPI
app.use('/pokeapi', createProxyMiddleware({
    target: POKEAPI_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        [`^/pokeapi`]: '',
    },
}));

// Iniciamos el servidor en el host y puerto indicado.
app.listen(PORT, HOST, () => {
	console.log(`Starting PokeAPI Proxy at http://${HOST}:${PORT}`);
})
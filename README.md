# pokeapi-proxy

Proxy requests para poder buscar Pokemons en la api de PokeAPI (ya que la misma carece de endpoint para busqueda).
API utilizada: https://pokeapi.co/api/v2/

Creado por Lucas Shoobridge.
Fecha: 2021-03-04

## Pasos a seguir para iniciar:
- Instalar NodeJS (preferentemente v14.15.1).
- Instalar dependencias con el comando: npm i
- Para ejecutar el servidor: ```npm run start```

Esto iniciará un servidor HTTP en el puerto 8000 (o el especificado).

- Se puede ejecutar con variables de entorno parametrizables (crear archivo .env):
    - PORT: PUERTO donde queremos que escuche
    - HOST: host donde estara escuchando.
    - POKEAPI_SERVICE_URL: si queremos cambiar la URL de la API de PokeAPI.

Con eso se iniciará el servidor con los parametros HOST/PORT/POKEAPI_SERVICE_URL indicados.

## Para realizar llamadas y obtener datos:
Se ejecuta una request GET apuntando a la IP y puerto del servidor en el path /search y como query param "pokemon"

Ejemplo de llamadas:
- Buscar un Pokemon: http://localhost:8000/search?pokemon=pikachu
- Proxy directo a PokeAPI: http://localhost:8000/pokeapi

Ejemplo de respuesta:

```{"status":"OK","data":[{"name":"pikachu","url":"https://pokeapi.co/api/v2/pokemon/25/"},{"name":"pikachu-rock-star","url":"https://pokeapi.co/api/v2/pokemon/10080/"},{"name":"pikachu-belle","url":"https://pokeapi.co/api/v2/pokemon/10081/"},{"name":"pikachu-pop-star","url":"https://pokeapi.co/api/v2/pokemon/10082/"},{"name":"pikachu-phd","url":"https://pokeapi.co/api/v2/pokemon/10083/"},{"name":"pikachu-libre","url":"https://pokeapi.co/api/v2/pokemon/10084/"},{"name":"pikachu-cosplay","url":"https://pokeapi.co/api/v2/pokemon/10085/"},{"name":"pikachu-original-cap","url":"https://pokeapi.co/api/v2/pokemon/10094/"},{"name":"pikachu-hoenn-cap","url":"https://pokeapi.co/api/v2/pokemon/10095/"},{"name":"pikachu-sinnoh-cap","url":"https://pokeapi.co/api/v2/pokemon/10096/"},{"name":"pikachu-unova-cap","url":"https://pokeapi.co/api/v2/pokemon/10097/"},{"name":"pikachu-kalos-cap","url":"https://pokeapi.co/api/v2/pokemon/10098/"},{"name":"pikachu-alola-cap","url":"https://pokeapi.co/api/v2/pokemon/10099/"},{"name":"pikachu-partner-cap","url":"https://pokeapi.co/api/v2/pokemon/10148/"},{"name":"pikachu-gmax","url":"https://pokeapi.co/api/v2/pokemon/10190/"}],"msg":"Se obtuvieron 15 resultados."}```

## Datos relevantes:

El servidor almacena los datos de los pokemon en memoria.
La primera vez que se busca un Pokemon, éste hace una llamada a la API solicitando los datos de TODOS los pokemon. La segunda vez que lo solicita, ya no hará falta, porque ya lo va a tener almacenado en memoria.

Una vez que el servidor se cierra, estos datos se pierden, y debera volver a solicitarlos la primera vez que se solicita uno o muchos productos.
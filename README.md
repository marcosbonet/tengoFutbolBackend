### Descripción
Proyecto Final. Se creará una página web, del tipo mobile-first, sobre matches de partidos de futbol.

### Minimos
En la pagina proncipar se podra observar una lista de partidos a los cuales se podra participar, la lista tendra filtro por zona y horario, y cada 
usuario debera logearse para poder añadorse como jugador en un partido.
Sera de Futsal, por lo que al completarse 10 jugadores el equipo estara completo, y no estara mas disponible. El usuario podra actualizar sus datos
o eliminarse de un partido elegido.


### Extras
Cada jugador podra crear su propio partido, el cual estara disponible para los nuevos usuarios.

### superextras
Habra un sistema de puntuacion donde cada usuario actualizara su estado, en cuanto al puntaje que uno mismo se pondra, y los demas jugadores podran aceptar,
o rechazar este puntaje, para que los usuarios puedan guiarse alelegir los partidos con jugadores de niveles similares.
sistema de pago para reserva.
Cada jugador podra elegir si decide ser Portero cuando eligue o crea su partido.
Se podra elegir deportes varios, entre ellos basket, beisball, rugby touch, tennis y boley.




TOMA DE REQUIISTOS
Que quiere el cliente:?
Los que busca el cliente es generar una ayuda a tra vez de la matchball, para conseguir un partido con otros 9 jugadores que coinciden en lugar y fecha en la que tiene disponibilidad.
La funcionalidades especificas son, por un lado la puntuacion de cada jugador para poder lograr un partido mas parejo y con jugadores de nivel similar.
La puntuacion se genera por un propiedad del esquemque la genera cada usuario al loguearse, y los demas jugadores se la apuevan.
Los partidos se generos se completan una vez que se llena elequipo, al cual no podra volver a elegirse, aunque cada jugaron tiene la posibilidad de modificar el partido al desvicularese, y sepodra vincular a otro que todavia no haya sido completado. 


Modelo de datos y Esquema:
export type PlayerTypes = {
   id: Types.ObjectId;
   playerName: string;
   level: number;
   email : string;
   password: string
};
 
export type MatcheTypes = {
   id: Types.ObjectId;
   places: string;
   date: date;
   image: string;
   players: Array<objectID>
   
   
};

 
export const PlayerSchema = new Schema<PlayerTypes>({
  
   playerName: {
       type: String,
       required: true,
       unique: true,
   },
   level: { type: Number, min: 0, max: 10 },
   email: String,
   password: String
});
 
 
 
export const MatchesSchema = new Schema<MatchesTypes>({
   id: Types.ObjectId;
   places: {
       type: String,
       required: true,
   },
   date: {
       type: date,
       required: true,
   },
   image: String,
   
   players {
       type: Schema.Types.ObjectId,
       ref: 'Player',
   },
});
 



Endpoint:




USER:
 [POST]/player/register → Recibe datos al registrar a un usuario. a través de un formulario de front
 [POST]/player/login→ Recibe datos del usuario para comprobar si está creado en la BD. genera un token.
 [DELETE]player/:IDplayer→ elimina jugador eliminado por id, y devuelve el nombre del jugado eliminado
 
MATCHES:
 [GETALL]/Matches→ Devuelve un array con todos partidos.(home)
 [SEARCH]/Matches/:IDmatches→ Devuelve un partido particular, filtrado por fecha y lugar
 [POST]/Matches/create→ Recibe un objeto matches sin id para crearlo en la BD y devuelve el mismo objeto con id creada.
 [PATCH]/matches/update/:IDmatches → Recibe un partido , realiza las modificaciones generando un nuevo jugador en la BD con la misma id y la propiedad del matches destino, con un nuevo jugador

LINK TRELLO: https://trello.com/b/92kcW8To/proyecto-TENGO FULBO

LINK FIGMA:  https://www.figma.com/file/YbMgrbtL99PxsOiKs15lAy/Untitled?node-id=0%3A1&t=L9rI5enF0WjQCFoo-0

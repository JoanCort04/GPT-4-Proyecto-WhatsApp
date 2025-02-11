//NO OLVIDAR DE CARGAR BOM PRIMERO  EXPORT
/* La aplicación debe mostrar una lista de todos los compañeros de clase al iniciar sesión. Los
usuarios deben poder buscar fácilmente un amigo por su nombre en la lista y seleccionarlo
para iniciar una conversación. Además, los usuarios deben poder ver los grupos en los que
están inscritos, crear nuevos grupos y asignarles un nombre. Los administradores de los
grupos podrán añadir o quitar personas, cambiar el nombre del grupo y designar a otros
usuarios como administradores. Cualquier usuario debe poder salir de un grupo si ya no
desea participar.*/

// Obtenir dades de l'api
import { cridarAPI, transforma_Username_To_ID } from "./integracion.js";

// Función para cargar los amigos y grupos
async function cargar_Amigos_Grupos(userID) {
    try {
        const amigos = await cridarAPI("llistaAmics");
        const endpointGrupos = `cargarGrupos?=${encodeURIComponent(userID)}`;
        const grupos = await cridarAPI(endpointGrupos);

        // Almacenamos la información del usuario
        const infoUsuario = {
            amigos, 
            grupos
        };

        // Retornamos la información
        return infoUsuario;
    } catch (error) {
        console.error("Error al cargar los amigos o los grupos:", error);
    }
}

// Llamamos a la función con un ID de usuario de ejemplo (3)
cargar_Amigos_Grupos(3).then(info => {
    if (info) {
        console.log("Amigos:", info.amigos);
        console.log("Grupos:", info.grupos);
    }
});

// Función de búsqueda de amigos
function buscarAmigo(username, amigos) {
    // Filtramos los amigos por el nombre de usuario
    const amigoEncontrado = amigos.filter(function (amigo) {
        return amigo.username === username;
    });

    if (amigoEncontrado.length > 0) {
        console.log("Amigo encontrado:", amigoEncontrado[0]);
    } else {
        console.log("Amigo no encontrado.");
    }
}

// Ejemplo de cómo usar la función de búsqueda:
document.querySelector("#buscarBtn").addEventListener("click", () => {
    const username = document.querySelector("#buscarInput").value;
    cargar_Amigos_Grupos(3).then(info => {
        if (info) {
            buscarAmigo(username, info.amigos);
        }
    });
});


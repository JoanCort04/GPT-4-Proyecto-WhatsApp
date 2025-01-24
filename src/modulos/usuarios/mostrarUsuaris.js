//NO OLVIDAR DE CARGAR BOM PRIMERO  EXPORT
/* La aplicación debe mostrar una lista de todos los compañeros de clase al iniciar sesión. Los
usuarios deben poder buscar fácilmente un amigo por su nombre en la lista y seleccionarlo
para iniciar una conversación. Además, los usuarios deben poder ver los grupos en los que
están inscritos, crear nuevos grupos y asignarles un nombre. Los administradores de los
grupos podrán añadir o quitar personas, cambiar el nombre del grupo y designar a otros
usuarios como administradores. Cualquier usuario debe poder salir de un grupo si ya no
desea participar.*/

// 1 llamar a la api pa los amigos y gurpos que tiene el usuario xd

let amigos = [
    { "username": "pepito" },
    { "username": "antonio" },
    { "username": "jaime" }
]

let grupos = [
    {
        "nombre": "cago",
        "rol": "administrador",
        "descripcion": "wismichu",
        "integrantes": [
            "amigos[0].username",
            "amigos[2].username",
            "amigos[1].username",
        ],
    },
];

function cargar() {
    cargarAmigos();
    cargarGrupos();
}

function cargarAmigos() {};
function cargarGrupos() { };


function añadirAlGrupo(username, grupo) {
    if (buscarAmigo(username) && grupo.rol === "administrador") {
        grupo.integrantes.push(username);
    }
}

function encontrarGrupoPorNombre(nombreGrupo) {
    grupos.find(function (grupo) {
    return grupo.nombre === nombreGrupo;
    });
}
//SI CLICKAS EN BUSCAR HAZ ESTO, FUNCION UNIDA A UN EVENTLISTENER
function buscarAmigo(username) {
    let amigoEncontrado = amigos.filter(function (amigo) {
        return amigo.username === username;
    });
}







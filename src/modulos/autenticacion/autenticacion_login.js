import {encriptarContra, verificarContra} from "./encriptacion.js";
import {} from "integracion/integracion.js"

let usuarios_prueba = [
    { username: "paucortes1paucasesnovescifp.cat", password: "12345678" }, // DNI sin letra, tendria que donar correcte
    { username: "joanpaucasesnovescifp", password: "X1234567" }, // DNI con letra inicial tendria que donar correcte
    { username: "tomas@paucasesnovescifp", password: "X1234567" }, // username amb @ tendria que donar error !!
];

// verificar datos del formulario
function validar_login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (
        username == validateUsername(username) &&
        password == validaContrasenya(password)
    ) {
        encriptarContra(password); //mandar esto a la api en la siguiente linea con funciones de integracion.js



    } else {
        return alert("nom o contrasenya invàlida");
    }
}

    function validateUsername(username) {
        const nomRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/;
        return nomRegex.test(username);
    }

    function validaContrasenya(password) {
        const contra = /^[A-Z]?[0-9]{8,8}$/;
        return contra.test(password);
    }

// //funcion que haga return de la informacion

//modulo de integracion con fetch


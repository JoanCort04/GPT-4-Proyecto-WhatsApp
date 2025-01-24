import {Error_Validació} from "../error/controlErrores.js";
import { encriptarContra, verificarContra } from "./encriptacion.js";
// import { } from "integracion/integracion.js"

//substituir por los datos de verdad con la api
let usuarios_prueba = [
    { username: "paucortes1paucasesnovescifp.cat", password: "12345678" }, // DNI sin letra, tendria que donar correcte
    { username: "joanpaucasesnovescifp", password: "X1234567" }, // DNI con letra inicial tendria que donar correcte
    { username: "tomas@paucasesnovescifp", password: "X1234567" }, // username amb @ tendria que donar error !!
];

function validar_login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    try {
        if (!validateUsername(username)) {
            return alert(
                "Nom d'usuari invàlid. Ha de començar amb una lletra i tenir entre 4 i 16 caràcters."
            );
        }
        if (!validaContrasenya(password)) {
            return alert(
                "Contrasenya invàlida. Ha de tenir exactament 8 números i pot començar amb una majúscula."
            );
        }

        encriptarContra(password); // Mandar a la API en la siguiente línea con funciones de integracion.js
        
    } catch (error) {
        if (error instanceof Error_Validació) {
            console.error(error.missatge + ": " + error.avis);
            alert(error.avis); 
        } else {
            console.error("Error inesperat:", error);
            alert(
                "Hi ha hagut un error inesperat"
            );
        }
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


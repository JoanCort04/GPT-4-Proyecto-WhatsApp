import { cridarAPI, transforma_Username_To_ID } from "../integracion.js";
import { Error_Validació } from "../controlErrores.js";
// import { } from "integracion/integracion.js"


async function rebreUsuari({username, password}) {
  const usuaris = await cridarAPI("login", "POST", {username, password });
  return usuaris;
}

function validateUsername(username) {
  const nomRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/;
  return nomRegex.test(username);
}


async function validar_login(username, password) {
  if (!validateUsername(username)) {
    return console.log(
      "Nom d'usuari invàlid. Ha de començar amb una lletra i tenir entre 4 i 16 caràcters."
    );
  }

  const usuaris = await rebreUsuari({username, password});

  if (usuaris.error) {
    return console.log(usuaris.error);
  }


  console.log("Usuario logueado:", usuaris);
}

validar_login("user1", "123456");

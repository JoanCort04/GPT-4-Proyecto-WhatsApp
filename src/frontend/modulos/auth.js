// authLogin.js
import { cridarAPI } from "../modulos/integracion.js";

document.addEventListener("DOMContentLoaded", inicializarLogin);

// Formulari del html DOM, passar dades al client
export function inicializarLogin() {
  const loginForm = document.querySelector("form");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    await validar_login(username, password);
  });
}

// Validar format de nom usuari
function validateUsername(username) {
  const nomRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/;
  return nomRegex.test(username);
}

// Función para realizar login
async function rebreUsuari(username, password) {
  const info = {
    username: username,
    passwd: password,
  };

  const usuaris = await cridarAPI("login", "POST", info);
  return usuaris;
}

// Funcio per obtenir el token, despres del login
export async function validar_login(username, password) {
  if (!validateUsername(username)) {
    console.log(
      "Nom d'usuari invàlid. Ha de començar amb una lletra i tenir entre 4 i 16 caràcters."
    );
    return;
  }

  const response = await rebreUsuari(username, password);

  if (response.error) {
    console.log(response.error);
    return;
  }

  console.log("Usuario logueado:", response);

  // Guarda el token JWT en localStorage
  localStorage.setItem("jwt", response.access_token);

  // Guarda nom de l'usuari
  const usuario = {
    username: username, // username login
    token: response.access_token,
  };

  localStorage.setItem("usuari", JSON.stringify(usuario));

  // Redirigir al chat
  window.location.href = "chat.html";
}

export async function verificarToken() {
  const token = localStorage.getItem("jwt");
  if (!token) {
    // Si no hay token, redirigir al login
    window.location.href = "login.html";
    return;
  }
  try {
    const response = await cridarAPI(
      "verify-token",
      "POST",
      { token: token },
      token
    );
    if (response.message !== "Token is valid") {
      // Si el token no es válido, redirigir al login
      window.location.href = "login.html";
    } else {
      // Si el token es válido, permitir acceso a la página
      console.log("Token válido, acceso permitido.");
    }
  } catch (error) {
    console.error("Error al verificar el token:", error);
    window.location.href = "login.html";
  }
}

// auth.js
import { cridarAPI, transforma_ID_To_Username } from "../modulos/integracion.js";

// Variable global per guardar el nom l'usuari logeat !!!
let currentUser = ""; // Guarda el nombre de usuario aquí
// !!!

document.addEventListener("DOMContentLoaded", inicializarLogin);

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

function validateUsername(username) {
  const nomRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/;
  return nomRegex.test(username);
}

async function rebreUsuari(username, password) {
  const info = {
    username: username,
    passwd: password,
  };

  const usuaris = await cridarAPI("login", "POST", info);
  return usuaris;
}

export async function validar_login(username, password) {
  if (!validateUsername(username)) {
    console.log("Nom d'usuari invàlid.");
    return;
  }

  const response = await rebreUsuari(username, password);

  if (response.error) {
    console.log(response.error);
    return;
  }

  console.log("Usuario logueado:", response);

  // Guarda el token JWT en localStorage
  const token = response.access_token;
  localStorage.setItem("jwt", token);

  // Decodificamos el token para obtener el ID del usuario
  const decodedToken = jwt_decode(token);  // Usamos jwt_decode para decodificar el token
  const userId = decodedToken.id;  // Obtenemos el ID del usuario desde el token

  // Guarda el ID del usuario y el token
  const usuario = {
    id: userId,  // Guarda el ID del usuario
    token: token,
  };

  localStorage.setItem("usuari", JSON.stringify(usuario));

  // Redirigir al chat
  window.location.href = "chat.html";
}

export async function verificarToken() {
  const token = localStorage.getItem("jwt");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await cridarAPI("verify-token", "POST", { token: token }, token);
    if (response.message !== "Token is valid") {
      window.location.href = "login.html";
    } else {
      console.log("Token válido, acceso permitido.");
    }
  } catch (error) {
    console.error("Error al verificar el token:", error);
    window.location.href = "login.html";
  }
}

// Función que obtiene el ID del token y luego obtiene el nombre de usuario
export async function obtenerNombreDeUsuario() {
  const token = localStorage.getItem("jwt");
  if (!token) {
    console.log("No hay token, por favor inicie sesión.");
    return;
  }

  try {
    // Decodificamos el token para obtener el ID del usuario
    const decodedToken = jwt_decode(token);  // Aquí decodificamos el token
    const userId = decodedToken.id;  // Obtenemos el ID del usuario

    // importar transforma_ID_To_Username
    const response = await transforma_ID_To_Username(userId, token);  // Llamada correcta con el ID y el token

    if (response) {
      currentUser = response;  // Guardamos el nombre de usuario en currentUser
      console.log("Nombre de usuario:", currentUser);
    } else {
      console.log("No se pudo obtener el nombre de usuario.");
    }
  } catch (error) {
    console.error("Error al obtener el nombre de usuario:", error);
  }
}
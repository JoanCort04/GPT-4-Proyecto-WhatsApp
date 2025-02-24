
import { cridarAPI } from "../modulos/integracion.js";

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

  console.log("📤 Enviando datos al backend:", JSON.stringify(info));
  const usuaris = await cridarAPI("login", "POST", info);
  return usuaris;
}


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


  localStorage.setItem("jwt", response.access_token);

  const usuario = {
    username: username,
    token: response.access_token,
  };

  localStorage.setItem("usuari", JSON.stringify(usuario));

  window.location.href = "chat.html";
}



export async function verificarToken() {
  const token = localStorage.getItem("jwt");

  
  try {
    if (!token) {
      console.error("No token found");
      window.location.href = "loginPrueba.html";
      return false;
    }

    const response = await cridarAPI("verify-token", "POST", { token }, token);

    if (response.message !== "Token is valid") {
      throw new Error("Invalid token response");
    }

    console.log("Token válido");
    return true;
  } catch (error) {
    console.error("Token verification failed:", error);
    localStorage.removeItem("jwt");
    localStorage.removeItem("usuari");
    window.location.href = "loginPrueba.html";
    return false;
  }
}
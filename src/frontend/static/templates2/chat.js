// chat.js

import { verificarToken } from "../../modulos/auth.js";
import { cridarAPI } from "../../modulos/integracion.js";
import { cargar_Amigos_Grupos } from "../../modulos/grupos.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Verificar si hay token en localStorage
  const token = localStorage.getItem("jwt");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Verificar el token con el backend
  await verificarToken();

  // Obtener el usuario logueado desde localStorage
  const usuario = JSON.parse(localStorage.getItem("usuari"));
  if (!usuario || !usuario.username) {
    console.error("No se encontró el usuario en localStorage.");
    return;
  }

  // Obtenir el nom de l'usuari
  document.getElementById("nombreUsuario").textContent = usuario.username;

  // Cargar amigos y grupos
  try {
    const datos = await cargar_Amigos_Grupos(usuario.username);

    if (datos) {
      mostrarLista(datos.amigos, "listaAmigos");
      mostrarLista(datos.grupos, "listaGrupos");
    }
  } catch (error) {
    console.error("Error al cargar amigos y grupos:", error);
  }

  // Agregar el manejador de eventos para el logout
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }
});

// Función para cerrar sesión
// Important borrar dades al fer logout
function logout() {
  localStorage.removeItem("jwt"); // Eliminar token JWT
  localStorage.removeItem("usuari"); // Eliminar usuario
  window.location.href = "login.html"; // Redirigir al login
}

// Función para mostrar una lista de amigos o grupos en un <ul>
function mostrarLista(lista, idElemento) {
  const contenedor = document.getElementById(idElemento);
  contenedor.innerHTML = ""; // Limpiar antes de agregar

  if (!lista || lista.length === 0) {
    contenedor.innerHTML = "<li>No hay elementos</li>";
    return;
  }

  lista.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.username || item.nombre; // Ajustar según API
    contenedor.appendChild(li);
  });
}

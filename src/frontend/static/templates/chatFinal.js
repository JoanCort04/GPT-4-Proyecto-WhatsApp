import { verificarToken } from "../../modulos/auth.js";
import { rebreMissatges, enviarMissatges } from "../../modulos/mensajes.js";
import { transforma_ID_To_Username } from "../../modulos/integracion.js";

let usuarioSeleccionado = null;
let gruposData = [];


document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("jwt");
  if (!token) {
    window.location.href = "loginPrueba.html";
    return;
  }

  await verificarToken();

  const usuario = JSON.parse(localStorage.getItem("usuari"));
  if (!usuario || !usuario.username) {
    console.error("Usuario no encontrado en localStorage");
    return;
  }

  document.getElementById("nombreUsuario").textContent = usuario.username;

  try {
    const datosAmigos = await cargarLlistaAmics(usuario.username);
    if (datosAmigos?.amigos && Array.isArray(datosAmigos.amigos)) {
      mostrarLista(datosAmigos.amigos, "listaAmigos");
    }

    await fetchGrupos(usuario.username);
  } catch (error) {
    console.error("Error inicial:", error);
  }

  document.getElementById("logoutButton")?.addEventListener("click", logout);
});

export async function cargarLlistaAmics(username) {
  try {
    const amigos = await cridarAPI("llistaamics");

    const listaAmigosHTML = amigos
      .map((amigo) => generarAmigoHTML(amigo))
      .join("");

    const friendsListSection = document.getElementById("friendsList");
    if (friendsListSection) {
      friendsListSection.innerHTML = listaAmigosHTML;
    } else {
      console.error("No se encontró el elemento con id 'friendsList'.");
    }

    return { amigos };
  } catch (error) {
    console.error("Error al cargar los amigos:", error);
  }
}

function createFriendElement(amigo) {
  const container = document.createElement("div");
  const avatar = document.createElement("div");
  const content = document.createElement("div");
  const username = document.createElement("p");
  const message = document.createElement("p");

  container.classList.add("flex", "space-x-3");
  avatar.classList.add(
    "w-10",
    "h-10",
    "bg-blau-fosc",
    "rounded-full",
    "flex",
    "items-center",
    "justify-center",
    "font-semibold"
  );
  username.classList.add("text-gris-clar", "font-semibold");
  message.classList.add("text-blau-clar");

  avatar.textContent = amigo.id;
  username.textContent = amigo.username;
  message.textContent = amigo.mensaje;

  content.appendChild(username);
  content.appendChild(message);
  container.appendChild(avatar);
  container.appendChild(content);

  return container;
}
amigos.forEach((amigo) => {
  const friendElement = createFriendElement(amigo);
  document.getElementById("friendsList").appendChild(friendElement);
});

document.body.appendChild(friendElement); 
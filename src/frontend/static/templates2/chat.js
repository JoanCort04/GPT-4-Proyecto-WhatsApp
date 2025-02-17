import { verificarToken } from "../../modulos/auth.js";
import { cargarLlistaAmics } from "../../modulos/grupos.js";
import { rebreMissatges,enviarMissatges } from "../../modulos/mensajes.js";
import { transforma_ID_To_Username } from "../../modulos/integracion.js";

// --- Variables Globales
let usuarioSeleccionado = null;

// --- Verificar usuario y cargar datos
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("jwt");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  await verificarToken();

  const usuario = JSON.parse(localStorage.getItem("usuari"));
  if (!usuario || !usuario.username) {
    console.error("No se encontró el usuario en localStorage.");
    return;
  }

  document.getElementById("nombreUsuario").textContent = usuario.username;

  try {
    const datos = await cargarLlistaAmics(usuario.username);
    if (datos) {
      mostrarLista(datos.amigos, "listaAmigos");
    }
  } catch (error) {
    console.error("Error al cargar amigos:", error);
  }

  document.getElementById("logoutButton")?.addEventListener("click", logout);
});

// --- Logout
function logout() {
  localStorage.removeItem("jwt");
  localStorage.removeItem("usuari"); 
  window.location.href = "login.html";
}


async function mostrarMensajesEnChat(mensajes) {
  const contenedorMensajes = document.getElementById("contenedorMensajes");

  // Clear the container before adding new messages
  contenedorMensajes.innerHTML = "";

  if (!mensajes || mensajes.length === 0) {
    contenedorMensajes.innerHTML = "<p>No hay mensajes</p>";
    return;
  }

  // Iterate through the messages and append them to the chat container
  for (let mensaje of mensajes) {
    const div = document.createElement("div");
    div.classList.add("mensaje");

    try {
      // Fetch the sender's username using the emisor_id (ID of the sender)
      const username = await transforma_ID_To_Username(mensaje.emisor_id);

      // Obtener la fecha del mensaje (asegurándote de que está en el formato adecuado)
      const fecha = new Date(mensaje.fecha_envio);  // Asegúrate de que 'fecha_envio' existe
      const fechaFormateada = fecha.toLocaleString();  // Formatear la fecha en un formato legible

      // Mostrar mensaje con la fecha de envío
      div.innerHTML = `<strong>${username}:</strong> ${mensaje.contenido} <span class="fecha">(${fechaFormateada})</span>`;
    } catch (error) {
      console.error("Error getting username for emisor_id:", mensaje.emisor_id, error);
      div.innerHTML = `<strong>Unknown User:</strong> ${mensaje.contenido}`;  // Fallback
    }

    contenedorMensajes.appendChild(div);
  }
}

// --- Mostrar lista de amigos y cargar mensajes al hacer clic
function mostrarLista(lista, idElemento) {
  const contenedor = document.getElementById(idElemento);
  contenedor.innerHTML = "";

  if (!lista || lista.length === 0) {
    contenedor.innerHTML = "<li>No hay elementos</li>";
    return;
  }

  lista.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.username || item.nombre;
    li.style.cursor = "pointer";

    li.addEventListener("click", async () => {
      usuarioSeleccionado = item.username || item.nombre;
      console.log("Usuario seleccionado:", usuarioSeleccionado);

      const mensajes = await rebreMissatges(usuarioSeleccionado);
      mostrarMensajesEnChat(mensajes);
    });

    contenedor.appendChild(li);
  });
}

// --- Enviar mensaje al usuario seleccionado
document.getElementById("enviarMensajeButton")?.addEventListener("click", async () => {
  if (!usuarioSeleccionado) {
    console.error("No se ha seleccionado ningún usuario.");
    return;
  }

  const contenidoMensaje = document.getElementById("contenidoMensaje").value;  // Suponiendo que tienes un input para el contenido del mensaje
  if (!contenidoMensaje) {
    console.error("El mensaje está vacío.");
    return;
  }

  try {
    await enviarMissatges(usuarioSeleccionado, contenidoMensaje);
    console.log("Mensaje enviado a:", usuarioSeleccionado);
    document.getElementById("contenidoMensaje").value = ""; // Limpiar el campo de mensaje
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
  }
});

import { verificarToken } from "../../modulos/auth.js";
import { cargarLlistaAmics } from "../../modulos/grupos.js";
import { rebreMissatges, enviarMissatges } from "../../modulos/mensajes.js";
import { transforma_ID_To_Username } from "../../modulos/integracion.js";

// --- Variables Globales
let usuarioSeleccionado = null;
let currentUser = ""; // Variable global para el nombre de usuario

// --- Verificar usuario y cargar datos
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("jwt");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Verificar token y cargar el nombre del usuario
  await verificarToken();
  await obtenerNombreDeUsuario();  // Obtener el nombre de usuario

  if (!currentUser) {
    console.error("No se pudo obtener el nombre de usuario.");
    return;
  }

  // Mostrar el nombre de usuario en la interfaz
  document.getElementById("nombreUsuario").textContent = currentUser;

  try {
    const usuario = JSON.parse(localStorage.getItem("usuari"));
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

// --- Función para obtener el nombre de usuario a partir del token
export async function obtenerNombreDeUsuario() {
  const token = localStorage.getItem("jwt");
  if (!token) {
    console.log("No hay token, por favor inicie sesión.");
    return;
  }

  try {
    // Decodificamos el token para obtener el ID del usuario
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.id;

    // Usamos cridarAPI para obtener el nombre del usuario
    const response = await transforma_ID_To_Username(userId, token);

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

// --- Mostrar mensajes en el chat
async function mostrarMensajesEnChat(mensajes) {
  const contenedorMensajes = document.getElementById("contenedorMensajes");

  // Limpiar el contenedor antes de agregar nuevos mensajes
  contenedorMensajes.innerHTML = "";

  if (!mensajes || mensajes.length === 0) {
    contenedorMensajes.innerHTML = "<p>No hay mensajes</p>";
    return;
  }

  // Iterar sobre los mensajes y agregarlos al contenedor
  for (let mensaje of mensajes) {
    const div = document.createElement("div");
    div.classList.add("mensaje");

    try {
      // Obtener el nombre de usuario del emisor a partir del ID
      const username = await transforma_ID_To_Username(mensaje.emisor_id);

      // Formatear la fecha del mensaje
      const fecha = new Date(mensaje.fecha_envio);
      const fechaFormateada = fecha.toLocaleString();

      div.innerHTML = `<strong>${username}:</strong> ${mensaje.contenido} <span class="fecha">(${fechaFormateada})</span>`;
    } catch (error) {
      console.error("Error al obtener el nombre de usuario para emisor_id:", mensaje.emisor_id, error);
      div.innerHTML = `<strong>Usuario desconocido:</strong> ${mensaje.contenido}`;  // Fallback
    }

    contenedorMensajes.appendChild(div);
  }
}

// --- Mostrar lista de amigos y cargar mensajes al hacer clic
function mostrarLista(lista, idElemento) {
  const contenedor = document.getElementById(idElemento);
  contenedor.innerHTML = "";

  if (!lista || lista.length === 0) {
    contenedor.innerHTML = "<li>No hay amigos</li>";
    return;
  }

  // Obtener el nombre de usuario logueado
  const usuario = JSON.parse(localStorage.getItem("usuari"));
  const usuarioLogueado = usuario ? usuario.username : "";

  lista.forEach(item => {
    const li = document.createElement("li");

    // Si el amigo es el usuario logueado, mostrar "(tu)"
    li.textContent = item.username === usuarioLogueado ? `${item.username} ("Tu")` : item.username;
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

  const contenidoMensaje = document.getElementById("contenidoMensaje").value;
  if (!contenidoMensaje) {
    console.error("El mensaje está vacío.");
    return;
  }

  try {
    await enviarMissatges(usuarioSeleccionado, contenidoMensaje);
    console.log("Mensaje enviado a:", usuarioSeleccionado);
    document.getElementById("contenidoMensaje").value = "";  // Limpiar el campo de mensaje
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
  }
});

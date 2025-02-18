import { verificarToken } from "../../modulos/auth.js";
import { cargarLlistaAmics } from "../../modulos/grupos.js";
import { rebreMissatges, enviarMissatges } from "../../modulos/mensajes.js";
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
    const datosAmigos = await cargarLlistaAmics(usuario.username);
    if (datosAmigos) {
      mostrarLista(datosAmigos.amigos, "listaAmigos");
    }

    await fetchGrupos(usuario.username);
  } catch (error) {
    console.error("Error al cargar datos iniciales:", error);
  }

  document.getElementById("logoutButton")?.addEventListener("click", logout);
});

// --- Logout
function logout() {
  localStorage.removeItem("jwt");
  localStorage.removeItem("usuari");
  window.location.href = "login.html";
}

// --- Mostrar mensajes en el chat
async function mostrarMensajesEnChat(mensajes) {
  const contenedorMensajes = document.getElementById("contenedorMensajes");
  contenedorMensajes.innerHTML = ""; // Limpiar el contenedor

  if (!mensajes || mensajes.length === 0) {
    contenedorMensajes.innerHTML = "<p>No hay mensajes</p>";
    return;
  }

  for (const mensaje of mensajes) {
    const div = document.createElement("div");
    div.classList.add("mensaje");

    try {
      const username = await transforma_ID_To_Username(mensaje.emisor_id);
      const fecha = new Date(mensaje.fecha_envio).toLocaleString();
      div.innerHTML = `<strong>${username}:</strong> ${mensaje.contenido} <span class="fecha">(${fecha})</span>`;
    } catch (error) {
      console.error("Error al obtener el username:", mensaje.emisor_id, error);
      div.innerHTML = `<strong>Usuario desconocido:</strong> ${mensaje.contenido}`;
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

  const usuario = JSON.parse(localStorage.getItem("usuari"));
  const usuarioLogueado = usuario?.username;

  lista.forEach((item) => {
    const li = document.createElement("li");
    li.textContent =
      item.username === usuarioLogueado
        ? `${item.username} (Tú)`
        : item.username;
    li.style.cursor = "pointer";

    li.addEventListener("click", async () => {
      usuarioSeleccionado = item.username;
      console.log("Usuario seleccionado:", usuarioSeleccionado);

      const mensajes = await rebreMissatges(usuarioSeleccionado);
      mostrarMensajesEnChat(mensajes);
    });

    contenedor.appendChild(li);
  });
}

// --- Cargar y mostrar grupos
async function fetchGrupos(username) {
  try {
    const response = await fetch(
      `http://localhost:8000/grups?username=${username}`
    );

    if (!response.ok) throw new Error("Error al obtener los grupos");

    const data = await response.json();
    renderGrupos(data.grupos, data.integrantes);
  } catch (error) {
    console.error("Error al cargar grupos:", error);
  }
}

function renderGrupos(grupos, integrantesIniciales) {
  const listaGrupos = document.getElementById("listaGrupos");
  listaGrupos.innerHTML = "";

  grupos.forEach((grupo) => {
    const li = document.createElement("li");
    li.textContent = grupo.nombre; // Asumiendo que `nombre` es una propiedad válida
    li.dataset.grupoId = grupo.grupo_id;
    li.style.cursor = "pointer";

    li.addEventListener("click", () => fetchIntegrantes(grupo.grupo_id));
    listaGrupos.appendChild(li);
  });

  // Renderizar integrantes del primer grupo por defecto
  renderIntegrantes(integrantesIniciales);
}



async function fetchIntegrantes(grupoId) {
  try {
    const response = await fetch(
      `http://localhost:8000/grups?grupo_id=${grupoId}`
    );

    if (!response.ok) throw new Error("Error al obtener los integrantes");

    const data = await response.json();
    renderIntegrantes(data.integrantes);
  } catch (error) {
    console.error("Error al cargar integrantes:", error);
  }
}

function renderIntegrantes(integrantes) {
  const listaIntegrantes = document.getElementById("listaIntegrantes");
  listaIntegrantes.innerHTML = "";

  if (!integrantes || integrantes.length === 0) {
    listaIntegrantes.innerHTML = "<li>No hay integrantes</li>";
    return;
  }

  integrantes.forEach((integrante) => {
    const li = document.createElement("li");
    li.textContent = integrante.nombre; // Asumiendo que `nombre` es una propiedad válida
    listaIntegrantes.appendChild(li);
  });
}

// --- Enviar mensaje
document
  .getElementById("enviarMensajeButton")
  ?.addEventListener("click", async () => {
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
      document.getElementById("contenidoMensaje").value = ""; // Limpiar el campo
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  });

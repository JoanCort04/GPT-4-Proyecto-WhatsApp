import { verificarToken } from "../../modulos/auth.js";
import { cargarLlistaAmics } from "../../modulos/grupos.js";
import { rebreMissatges, enviarMissatges } from "../../modulos/mensajes.js";
import { transforma_ID_To_Username } from "../../modulos/integracion.js";

// --- Variables Globales
let usuarioSeleccionado = null;
let gruposData = []; // Almacena todos los datos de grupos

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
    // Cargar amigos y grupos al iniciar
    const datosAmigos = await cargarLlistaAmics(usuario.username);
    if (datosAmigos) {
      mostrarLista(datosAmigos.amigos, "listaAmigos");
    }

    await fetchGrupos(usuario.username); // Carga grupos del usuario logueado
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

      // Cargar los mensajes del usuario seleccionado
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
    gruposData = data; // Guardar todos los datos
    renderGrupos(data.grupos);

    // Cargar integrantes del primer grupo por defecto
    if (data.grupos.length > 0) {
      fetchIntegrantes(data.grupos[0].grupo_id);
    }
  } catch (error) {
    console.error("Error al cargar grupos:", error);
  }
}

// --- Renderizar la lista de grupos
function renderGrupos(grupos) {
  const listaGrupos = document.getElementById("listaGrupos");
  listaGrupos.innerHTML = ""; // Limpiar la lista antes de agregar nuevos grupos

  if (!grupos || grupos.length === 0) {
    listaGrupos.innerHTML = "<li>No tienes grupos</li>";
    return;
  }

  grupos.forEach((grupo) => {
    const li = document.createElement("li");
    li.textContent = grupo.nom; // Suponiendo que `nom` es el nombre del grupo
    li.dataset.grupoId = grupo.grupo_id;
    li.style.cursor = "pointer";

    // Al hacer clic en un grupo, obtenemos los integrantes
    li.addEventListener("click", () => fetchIntegrantes(grupo.grupo_id));
    listaGrupos.appendChild(li);
  });
}

// --- Obtener y mostrar integrantes de un grupo
async function fetchIntegrantes(grupoId) {
  try {
    const response = await fetch(
      `http://localhost:8000/grupos/${grupoId}/integrantes`
    );

    if (!response.ok) throw new Error("Error al obtener integrantes");

    const data = await response.json();
    renderIntegrantes(data.integrantes);
  } catch (error) {
    console.error("Error cargando integrantes:", error);
  }
}

// --- Renderizar la lista de integrantes
function renderIntegrantes(integrantes) {
  const lista = document.getElementById("listaIntegrantes");
  lista.innerHTML = "";

  if (!integrantes || integrantes.length === 0) {
    lista.innerHTML = "<li>No hay integrantes</li>";
    return;
  }

  integrantes.forEach((integrante) => {
    const li = document.createElement("li");
    li.textContent = integrante.username;
    lista.appendChild(li);
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

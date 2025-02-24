import { verificarToken } from "../../modulos/auth.js";
import { cargarLlistaAmics } from "../../modulos/grupos.js";
import { rebreMissatges, enviarMissatges } from "../../modulos/mensajes.js";
import { transforma_ID_To_Username } from "../../modulos/integracion.js";

function generarAmigoHTML(amigo) {
  return `
    <div class="flex space-x-3">
      <div class="w-10 h-10 bg-blau-fosc rounded-full flex items-center justify-center font-semibold">
        ${amigo.id}
      </div>
      <div>
        <p class="text-gris-clar font-semibold">${amigo.username}</p>
        <p class="text-blau-clar">${amigo.mensaje}</p>
      </div>
    </div>
  `;
}

// --- Variables Globales
let usuarioSeleccionado = null;
let gruposData = [];

// --- Verificar usuario y cargar datos iniciales
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("jwt");
  if (!token) {
    window.location.href = "login.html";
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
    // Cargar amigos
    const datosAmigos = await cargarLlistaAmics(usuario.username);
    if (datosAmigos?.amigos && Array.isArray(datosAmigos.amigos)) {
      mostrarLista(datosAmigos.amigos, "listaAmigos");
    }

    // Cargar grupos
    await fetchGrupos(usuario.username);
  } catch (error) {
    console.error("Error inicial:", error);
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
  const contenedor = document.getElementById("contenedorMensajes");
  contenedor.innerHTML = "";

  if (!mensajes?.length) {
    contenedor.innerHTML = "<p>No hay mensajes</p>";
    return;
  }

  for (const mensaje of mensajes) {
    const div = document.createElement("div");
    div.classList.add("mensaje");

    try {
      const username = await transforma_ID_To_Username(mensaje.emisor_id);
      const fecha = new Date(mensaje.fecha_envio).toLocaleString();
      div.innerHTML = `<strong>${username}:</strong> ${mensaje.contenido} <em>(${fecha})</em>`;
    } catch (error) {
      div.innerHTML = `<strong>Desconocido:</strong> ${mensaje.contenido}`;
    }

    contenedor.appendChild(div);
  }
}

// --- Mostrar listas (amigos/grupos)
function mostrarLista(lista, idElemento) {
  const contenedor = document.getElementById(idElemento);
  contenedor.innerHTML = "";

  if (!Array.isArray(lista)) {
    contenedor.innerHTML = "<li>Error cargando datos</li>";
    return;
  }

  const usuario = JSON.parse(localStorage.getItem("usuari"))?.username;

  lista.forEach((item) => {
    const li = document.createElement("li");
    li.textContent =
      item.username === usuario ? `${item.username} (Tú)` : item.username;
    li.style.cursor = "pointer";

    li.addEventListener("click", async () => {
      usuarioSeleccionado = item.username;
      const mensajes = await rebreMissatges(usuarioSeleccionado);
      mostrarMensajesEnChat(mensajes);
    });

    contenedor.appendChild(li);
  });
}

// --- Cargar grupos desde la API
async function fetchGrupos(username) {
  try {
    const response = await fetch(
      `http://localhost:8000/grups?username=${username}`
    );
    if (!response.ok) throw new Error("Error HTTP: " + response.status);

    const data = await response.json();
    renderGrupos(data.grupos);
    if (data.grupos?.length > 0) fetchIntegrantes(data.grupos[0].grupo_id);
  } catch (error) {
    console.error("Error grupos:", error);
  }
}

// --- Renderizar grupos con botón de salida
function renderGrupos(grupos) {
  const lista = document.getElementById("listaGrupos");
  lista.innerHTML = "";

  if (!Array.isArray(grupos)) {
    lista.innerHTML = "<li>Error cargando grupos</li>";
    return;
  }

  grupos.forEach((grupo) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.gap = "10px";
    li.style.alignItems = "center";

    // Nombre del grupo
    const span = document.createElement("span");
    span.textContent = grupo.nom;
    li.appendChild(span);

    // Botón para salir
    const boton = document.createElement("button");
    boton.textContent = "Salir";
    boton.style.padding = "4px 8px";
    boton.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm(`¿Salir de ${grupo.nom}?`)) salirDelGrupo(grupo.grupo_id);
    });

    li.appendChild(boton);
    lista.appendChild(li);
  });
}

// --- Salir de un grupo
async function salirDelGrupo(grupoId) {
  try {
    const response = await fetch(
      `http://localhost:8000/grupos/${grupoId}/salir`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      }
    );

    if (!response.ok) throw new Error(await response.text());

    // Recargar lista
    const usuario = JSON.parse(localStorage.getItem("usuari")).username;
    await fetchGrupos(usuario);
    alert("Has salido del grupo");
  } catch (error) {
    console.error("Error saliendo:", error);
    alert("Error al salir: " + error.message);
  }
}

// --- Cargar integrantes de grupo
async function fetchIntegrantes(grupoId) {
  try {
    const response = await fetch(
      `http://localhost:8000/grupos/${grupoId}/integrantes`
    );
    if (!response.ok) throw new Error("Error HTTP: " + response.status);

    const data = await response.json();
    renderIntegrantes(data.integrantes);
  } catch (error) {
    console.error("Error integrantes:", error);
  }
}

// --- Mostrar integrantes
function renderIntegrantes(integrantes) {
  const lista = document.getElementById("listaIntegrantes");
  lista.innerHTML = "";

  if (Array.isArray(integrantes)) {
    integrantes.forEach((integrante) => {
      const li = document.createElement("li");
      li.textContent = integrante.username;
      lista.appendChild(li);
    });
  }
}

// --- Crear Grupo
async function crearGrupo(nombre, descripcion) {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuari"));

    if (!usuario?.id) {
      throw new Error("Usuario no identificado");
    }

    const response = await fetch("http://localhost:8000/grupos/crear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        nom: nombre,
        descripcio: descripcion,
        usuari_id: usuario.id, // Usamos el ID del usuario logueado
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Error al crear el grupo");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creando grupo:", error);
    throw error;
  }
}

// --- Event listener para el botón de crear grupo
document
  .getElementById("crearGrupoButton")
  ?.addEventListener("click", async () => {
    const nombreInput = document.getElementById("nombreGrupo");
    const descripcionInput = document.getElementById("descripcionGrupo");

    const nombre = nombreInput.value.trim();
    const descripcion = descripcionInput.value.trim();

    if (!nombre || !descripcion) {
      alert("¡Debes completar todos los campos!");
      return;
    }

    try {
      const resultado = await crearGrupo(nombre, descripcion);

      // Limpiar campos
      nombreInput.value = "";
      descripcionInput.value = "";

      // Actualizar lista de grupos
      const usuario = JSON.parse(localStorage.getItem("usuari"));
      await fetchGrupos(usuario.username);

      alert(`Grupo "${nombre}" creado exitosamente!`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });

// --- Enviar mensajes
document
  .getElementById("enviarMensajeButton")
  .addEventListener("click", async () => {
    const mensaje = document.getElementById("contenidoMensaje").value.trim();
    if (!mensaje || !usuarioSeleccionado) return;

    try {
      await enviarMissatges(usuarioSeleccionado, mensaje);
      document.getElementById("contenidoMensaje").value = "";
      const nuevosMensajes = await rebreMissatges(usuarioSeleccionado);
      mostrarMensajesEnChat(nuevosMensajes);
    } catch (error) {
      console.error("Error enviando:", error);
    }
  });

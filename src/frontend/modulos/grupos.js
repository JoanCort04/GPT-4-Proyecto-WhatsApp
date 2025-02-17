import { cridarAPI, transforma_Username_To_ID } from "./integracion.js";

// Función para cargar los amigos
export async function cargarLlistaAmics(username) {
  try {
    const amigos = await cridarAPI("llistaamics");
    const endpointGrupos = `grups?username=${encodeURIComponent(username)}`;

    const infoUsuario = {
      amigos,
    };

    // Retornamos la información
    return infoUsuario;
  } catch (error) {
    console.error("Error al cargar los amigoss:", error);
  }
}
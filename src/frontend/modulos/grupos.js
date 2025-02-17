import { cridarAPI, transforma_Username_To_ID } from "./integracion.js";

// Función para cargar los amigos
export async function cargarLlistaAmics(username) {
  try {
    const endpointGrupos = `grups?username=${encodeURIComponent(username)}`;
    const amigos = await cridarAPI(`${endpointGrupos}`);
    
    const infoUsuario = {
      amigos,
    };

    // Retornamos la información
    console.log(infoUsuario);
    return infoUsuario;
  } catch (error) {
    console.error("Error al cargar los amigoss:", error);
  }
}

cargarLlistaAmics("user2")
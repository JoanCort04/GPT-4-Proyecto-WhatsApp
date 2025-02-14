import { cridarAPI, transforma_Username_To_ID } from "./integracion.js";

// Función para cargar los amigos y grupos
async function cargar_Amigos_Grupos(username) {
  try {
    const amigos = await cridarAPI("llistaamics");
    const endpointGrupos = `grups?username=${encodeURIComponent(username)}`;
    const grupos = await cridarAPI(endpointGrupos);

    // Almacenamos la información del usuario
    const infoUsuario = {
      amigos,
      grupos,
    };

    // Retornamos la información
    return infoUsuario;
  } catch (error) {
    console.error("Error al cargar los amigos o los grupos:", error);
  }
}

cargar_Amigos_Grupos("user2").then((info) => {
  if (info) {
    console.log("Amigos:", info.amigos);
    console.log("Grupos:", info.grupos);
  }
});


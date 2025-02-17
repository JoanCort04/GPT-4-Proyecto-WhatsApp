
import { cridarAPI, transforma_Username_To_ID } from "./integracion.js";

export async function cargarLlistaAmicsLateral(){
  try {
    const amigos = await cridarAPI("llistaamics");
    return amigos
  } catch (error) {
    console.error("Error al cargar los amigos:", error);
  }
}

cargarLlistaAmicsLateral()
import { cridarAPI, transforma_Username_To_ID } from "./integracion.js";


class Mensaje {
  constructor(missatges = {}) {
    this.missatges = missatges;
  }

  rebreMissatgesAmic(amic) {
    return this.missatges[amic] || [];
  }

  rebreMissatgesRecents(amic, limit = 10) {
    const missatges = this.missatges[amic] || [];
    return missatges.slice(-limit).reverse();
  }

  rebreMissatgesAntics(amic, limit = 10) {
    const missatges = this.missatges[amic] || [];
    return missatges.slice(0, limit);
  }
}

async function getMissatgeUsuari(emisor_id, receptor_id) {
  const endpoint = `missatgesAmics?emisor_id=${emisor_id}&receptor_id=${receptor_id}`;
  try {
    return await cridarAPI(endpoint, "GET");
  } catch (error) {
    console.error("Error al obtener los mensajes:", error);
    throw error;
  }
}

export async function enviarMissatges(nombreAmigo, contingutMissatge) {
  try {
    const emisor = JSON.parse(localStorage.getItem("usuari"))?.username;
    if (!emisor) {
      console.error("No se encontró el usuario emisor.");
      return;
    }

    const { id: emisor_id } = await transforma_Username_To_ID(emisor);
    const { id: receptor_id } = await transforma_Username_To_ID(nombreAmigo);

    const missatge = {
      emisor_id,
      receptor_id,
      contenido: contingutMissatge,
    };

    const mensajes = await cridarAPI("missatgesAmics", "POST", missatge);
    console.log("Missatge enviat correctament:", mensajes);
  } catch (error) {
    console.error("Hubo un error al enviar el mensaje:", error);
    return;
  }
}

export async function rebreMissatges(nombreAmigo) {
  try {
    const emisor = JSON.parse(localStorage.getItem("usuari"))?.username;
    if (!emisor) {
      console.error("No se encontró el usuario emisor.");
      return [];
    }

    const { id: emisor_id } = await transforma_Username_To_ID(emisor);
    const { id: receptor_id } = await transforma_Username_To_ID(nombreAmigo);

    const mensajes = await getMissatgeUsuari(emisor_id, receptor_id);
    const missatgesInstance = new Mensaje({ [nombreAmigo]: mensajes });

    const mensajesLimitados = missatgesInstance.rebreMissatgesAntics(nombreAmigo);

    return mensajesLimitados;
  } catch (error) {
    console.error("Hubo un error al obtener los mensajes:", error);
    return [];
  }
}




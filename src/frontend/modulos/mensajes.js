import { cridarAPI, transforma_Username_To_ID} from "./integracion.js";
import fetch from "node-fetch"; // For Node.js

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

async function getMissatgeUsuari(username) {
  const endpoint = `missatgesAmics?username=${encodeURIComponent(username)}`;
  try {
    const data = await cridarAPI(endpoint, "GET");
    return data;
  } catch (error) {
    console.error("Error al obtener los mensajes:", error);
    throw error; 
  }
}

async function enviarMissatges(nombreAmigo, contingutMissatge) {
  try {
    const emisor = "user2";
    const emisor_id = await transforma_Username_To_ID(emisor);
    console.log("Emisor ID:", emisor_id); 

    const receptor_id = await transforma_Username_To_ID(nombreAmigo);
    console.log("Receptor ID:", receptor_id); 

    const missatge = {
      emisor_id: emisor_id.id,
      receptor_id: receptor_id.id,
      contenido: contingutMissatge
    };

    const mensajes = await cridarAPI("missatgesAmics", "POST", missatge);

    console.log("Missatge enviat correctament:", mensajes);
  } catch (error) {
    console.error("Hubo un error al enviar el mensaje:", error);
  }
}

async function rebreMissatges(nombreAmigo) {
  try {
    const mensajes = await getMissatgeUsuari(nombreAmigo);

    const missatgesInstance = new Mensaje({ [nombreAmigo]: mensajes });

    const mensajesLimitados =
      missatgesInstance.rebreMissatgesAntics(nombreAmigo);

    mensajesLimitados.forEach((msg) => {
      console.log(`De: ${msg.emisor_id} a: ${msg.receptor_id}`);
      console.log(`Contenido: ${msg.contenido}`);
      console.log(
        `Fecha de Envío: ${new Date(msg.fecha_envio).toLocaleString()}`
      );
      console.log(`Estado: ${msg.estado}`);
      console.log("--------------------------");
    });
  } catch (error) {
    console.error("Hubo un error al obtener los mensajes:", error);
  }
}

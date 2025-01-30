//JAVADOCS: este modulo se encarga de llamar a la api blablabla nigers
import { Error_API} from "../error/controlErrores.js";

// el servidor de l'api ha d'estar encés perquè funcioni xd

// per conectar-se a l'endpoint en específic 


async function cridarAPI(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json", 
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  try {
    const response = await fetch(`http://localhost:5000/${endpoint}`, options);
    if (!response.ok) {
      throw new Error_API(`API o red aturada: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("El fetch ha fallat:", error);
    throw error; // Torna a llençar l'error per gestionar-lo fora
  }
}




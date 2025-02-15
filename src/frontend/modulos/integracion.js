//JAVADOCS: este modulo se encarga de llamar a la api blablabla 
// import { Error_API} from "../controlErrores.js";
// import fetch from 'node-fetch'; // Usar fetch en Node.js
// el servidor de l'api ha d'estar encés perquè funcioni xd

// per conectar-se a l'endpoint en específic 

export async function transforma_Username_To_ID(username) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/treuID?username=${encodeURIComponent(username)}`,
      options
    );
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
// modificat funcio per a que tengui un header personalitzat: 
// "Authorization": `Bearer ${token}`
export async function cridarAPI(endpoint, method = "GET", body = null, headers = {}) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`http://127.0.0.1:8000/${endpoint}`, options);

    if (response.ok) {
      const datos = await response.json();
      return datos;
    } else {
      const errorData = await response.json();
      throw new Error(
        `Error en la solicitud: ${response.status} - ${
          errorData.detail || "Unknown error"
        }`
      );
    }
  } catch (error) {
    console.error("Error en la llamada a la API:", error);
    throw error;
  }
}
// integracion.js
// Cridar api, funcio que utilizam per cridar els endpoints
export async function cridarAPI(
  endpoint,
  method = "GET",
  body = null,
  token = null
) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`http://127.0.0.1:8000/${endpoint}`, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error API: ${response.status} - ${errorData.detail || "Desconocido"}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error en la llamada a la API:", error);
    throw error;
  }
}

// optimizat funcio per a que utilizi cridarApi
export async function transforma_Username_To_ID(username, token = null) {
  return await cridarAPI(
    `treuID?username=${encodeURIComponent(username)}`,
    "GET",
    null,
    token
  );
}
// Invers a l'altra funcio
export async function transforma_ID_To_Username(usuariId, token = null) {
  try {
    // Make sure to encode the id and pass it correctly to the API
    const response = await cridarAPI(
      `treuNom?id=${encodeURIComponent(usuariId)}`,
      "GET",
      null,
      token
    );
    // Return the username from the response
    return response.username || "Unknown User";  // Fallback if username is not present
  } catch (error) {
    console.error("Error getting username for id:", usuariId, error);
    return "Unknown User";  // Fallback in case of error
  }
}

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

// Función para cargar la lista de amigos
function cargarAmigos() {
  const friendsList = document.getElementById("friendsList");
  if (!friendsList) {
    console.error("El contenedor 'friendsList' no existe.");
    return;
  }

  // Limpiar el contenedor antes de insertar nuevos amigos
  friendsList.innerHTML = "";

  // Iterar sobre la lista de amigos y generar el HTML
  amigos.forEach((amigo) => {
    const amigoHTML = generarAmigoHTML(amigo);
    friendsList.insertAdjacentHTML("beforeend", amigoHTML);
  });
}

// Llamar a la función para cargar los amigos cuando se cargue la página
document.addEventListener("DOMContentLoaded", cargarAmigos);

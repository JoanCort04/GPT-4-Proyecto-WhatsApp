
<div id="chatContainer" style="height: 400px; overflow-y: scroll;">
  <!-- Aquí se cargarán los mensajes -->
</div>

<script>
  // Variables para manejar el cursor de paginación y evitar múltiples solicitudes simultáneas.
  let lastTime = null;
  let loading = false;

  // Función para cargar más mensajes.
  function loadMoreMessages() {
    if (loading) return; // Evitar solicitudes concurrentes.
    loading = true;
    
    // Configura tus IDs de emisor y receptor según tu lógica.
    const emisor_id = 123; // Ejemplo
    const receptor_id = 456; // Ejemplo

    // Construir la URL con el parámetro 'last_time' si existe.
    let url = `/missatgesAmics?emisor_id=${emisor_id}&receptor_id=${receptor_id}`;
    if (lastTime) {
      url += `&last_time=${encodeURIComponent(lastTime)}`;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Si hay mensajes, prepéndelos al contenedor.
        if (data.messages && data.messages.length > 0) {
          const chatContainer = document.getElementById("chatContainer");
          data.messages.forEach(message => {
            // Crea un nuevo elemento para cada mensaje.
            const messageElement = document.createElement("div");
            messageElement.classList.add("mensaje");
            // Personaliza el contenido del mensaje según tus datos.
            messageElement.textContent = `[${message.fecha_envio}] ${message.contenido}`;
            // Inserta cada mensaje al inicio del contenedor.
            chatContainer.insertBefore(messageElement, chatContainer.firstChild);
          });
          // Actualiza el cursor para la siguiente solicitud.
          lastTime = data.last_time;
        }
        loading = false;
      })
      .catch(error => {
        console.error("Error al cargar mensajes:", error);
        loading = false;
      });
  }

  // Evento de scroll para detectar cuando se llega a la parte superior.
  document.getElementById("chatContainer").addEventListener("scroll", function() {
    if (this.scrollTop === 0) {  // Si el scroll llega al tope, cargar más mensajes.
      loadMoreMessages();
    }
  });

  // Carga inicial de mensajes cuando la página se carga.
  window.addEventListener("load", () => {
    loadMoreMessages();
  });
</script>

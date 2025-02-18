document.addEventListener("DOMContentLoaded", () => {
    // Tu código para inicializar el formulario de login
    const loginForm = document.querySelector("form");
    
    if (!loginForm) return; // Si no existe el formulario, no hacer nada
  
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
  
      await validar_login(username, password); // Llama a tu función de login
    });
  });
  
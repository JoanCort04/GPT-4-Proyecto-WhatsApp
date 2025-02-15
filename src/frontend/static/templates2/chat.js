// chat.js
import { verificarToken } from "../../modulos/auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
        window.location.href = "login.html";
        return; 
    }

    // Si el te token, l´hem de verificar
    verificarToken();

    // Agregar el manejador de eventos para el logout
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }
});

// Función de logout user
export function logout() {
    // Eliminar el JWT del localStorage
    localStorage.removeItem("jwt");
    // Redirigir al login
    window.location.href = "login.html";
}

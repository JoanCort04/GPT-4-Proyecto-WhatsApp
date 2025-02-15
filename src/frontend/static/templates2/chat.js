// chat.js
import { verificarToken } from "../../modulos/auth.js";

// Asegurarse de que el usuario esté logueado al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    // Verificar si el usuario tiene JWT en el localStorage
    const token = localStorage.getItem("jwt");
    if (!token) {
        // Si no tiene JWT, redirigir al login
        window.location.href = "login.html";
        return; // Detener la ejecución del código siguiente
    }

    // Si tiene JWT, proceder con la lógica de la página
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

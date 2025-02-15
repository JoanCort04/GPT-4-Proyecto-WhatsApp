// chat.js
import { verificarToken } from "../../modulos/auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("jwt");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Si tiene token, verificarlo antes de mostrar la página
    verificarToken()
        .then(isValid => {
            if (!isValid) {
                window.location.href = "login.html";
            } else {
                // Si el token es válido, mostramos la página
                document.body.style.display = "block";
            }
        });

    // Agregar el manejador de eventos para el logout
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }
});

// Función de logout
export function logout() {
    localStorage.removeItem("jwt");
    window.location.href = "login.html";
}

// URL de la API de autenticación (backend)
import { cridarAPI } from "src/frontend/modulos/integracion.js";

// Función para iniciar sesión
export const login = async (username, password) => {
    try {
        const response = await fetch(`${cridarAPI}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error("Error al iniciar sesión");
        }

        const data = await response.json();

        // Almacenar el token en localStorage
        localStorage.setItem("token", data.token);

        return data.user; // Devuelve la información del usuario
    } catch (error) {
        console.error("Error en login:", error);
        throw error;
    }
};

// Función para verificar si el usuario está autenticado
export const checkAuth = () => {
    const token = localStorage.getItem("token");
    return !!token; // Devuelve true si hay un token, false si no
};

// Función para obtener la información del usuario autenticado
export const getUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return null;
    }

    try {
        const response = await fetch(`${cridarAPI}/cargarUsuari`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener la información del usuario");
        }

        const data = await response.json();
        return data.user; // Devuelve la información del usuario
    } catch (error) {
        console.error("Error en getUser:", error);
        throw error;
    }
};

// Función para cerrar sesión
export const logout = () => {
    // Eliminar el token de localStorage
    localStorage.removeItem("token");
};
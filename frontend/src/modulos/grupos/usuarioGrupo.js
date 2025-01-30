class UsuarioGrupo {
    constructor(nombre, grupo) {
        this.nombre = nombre;
        this.grupo = grupo;
    }

    enviarMensaje(mensaje) {
        console.log(`${this.nombre} envió: ${mensaje}`);
        // Aquí puedes agregar la lógica para enviar el mensaje al grupo
    }

    irseDelGrupo() {
        console.log(`${this.nombre} ha salido del grupo ${this.grupo}`);
        // Aquí puedes agregar la lógica para eliminar al usuario del grupo
    }
}

/* Ejemplo de uso
const usuario = new UsuarioGrupo('Juan', 'Grupo de Estudio');
usuario.enviarMensaje('Hola a todos!');
usuario.irseDelGrupo();
*/
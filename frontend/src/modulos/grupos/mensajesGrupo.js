
class GruposMensajes {
    constructor() {
        this.grupos = {};
    }

    enviarMensaje(nombreGrupo, usuario, mensaje) {
        if (this.grupos[nombreGrupo]) {
            this.grupos[nombreGrupo].mensajes.push({ usuario, mensaje, enviado: new Date() });
            console.log(`Mensaje enviado por ${usuario} en el grupo ${nombreGrupo}: ${mensaje}`);
        } else {
            console.log(`El grupo ${nombreGrupo} no existe.`);
        }
    }

    recibirMensajes(nombreGrupo) {
        if (this.grupos[nombreGrupo]) {
            return this.grupos[nombreGrupo].mensajes;
        } else {
            console.log(`El grupo ${nombreGrupo} no existe.`);
            return [];
        }
    }
}

module.exports = GruposMensajes;
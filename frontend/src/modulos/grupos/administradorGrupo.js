class AdministradorGrupo {
    constructor() {
        this.grupos = {};
    }

    eliminarGrupo(nombre) {
        if (this.grupos[nombre]) {
            delete this.grupos[nombre];
            console.log(`Grupo ${nombre} eliminado.`);
        } else {
            console.log(`El grupo ${nombre} no existe.`);
        }
    }

    añadirMiembro(grupo, usuario) {
        if (this.grupos[grupo]) {
            if (!this.grupos[grupo].miembros.includes(usuario)) {
                this.grupos[grupo].miembros.push(usuario);
                console.log(`Usuario ${usuario} añadido al grupo ${grupo}.`);
            } else {
                console.log(`El usuario ${usuario} ya es miembro del grupo ${grupo}.`);
            }
        } else {
            console.log(`El grupo ${grupo} no existe.`);
        }
    }

    quitarMiembro(grupo, usuario) {
        if (this.grupos[grupo]) {
            const index = this.grupos[grupo].miembros.indexOf(usuario);
            if (index !== -1) {
                this.grupos[grupo].miembros.splice(index, 1);
                console.log(`Usuario ${usuario} eliminado del grupo ${grupo}.`);
            } else {
                console.log(`El usuario ${usuario} no es miembro del grupo ${grupo}.`);
            }
        } else {
            console.log(`El grupo ${grupo} no existe.`);
        }
    }

    hacerAdministrador(grupo, usuario) {
        if (this.grupos[grupo]) {
            if (this.grupos[grupo].miembros.includes(usuario)) {
                if (!this.grupos[grupo].administradores.includes(usuario)) {
                    this.grupos[grupo].administradores.push(usuario);
                    console.log(`Usuario ${usuario} ahora es administrador del grupo ${grupo}.`);
                } else {
                    console.log(`El usuario ${usuario} ya es administrador del grupo ${grupo}.`);
                }
            } else {
                console.log(`El usuario ${usuario} no es miembro del grupo ${grupo}.`);
            }
        } else {
            console.log(`El grupo ${grupo} no existe.`);
        }
    }
}

module.exports = AdministradorGrupo;
const AdministradorGrupo = require('./administradorGrupo');

class CrearGrupo {
    constructor() {
        this.adminGrupo = new AdministradorGrupo();
    }

    crearGrupoConContactos(nombreGrupo, contactos) {
        this.adminGrupo.crearGrupo(nombreGrupo);
        contactos.forEach(contacto => {
            this.adminGrupo.añadirMiembro(nombreGrupo, contacto);
        });
    }
}

module.exports = CrearGrupo;

/* Ejemplo de uso
const crearGrupo = new CrearGrupo();
crearGrupo.crearGrupoConContactos('Grupo de Amigos', ['Juan', 'Maria', 'Pedro']);
*/
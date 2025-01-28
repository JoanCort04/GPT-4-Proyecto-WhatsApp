class enviarMensaje {
    constructor() {
        this.missatges = {};
    }

    //Verifica si ya existe una entrada para el amigo en el objeto missatges. 
    // Si no existe, crea un array vacío para ese amigo
    enviarMissatge(amic, missatge) {
        if (!this.missatges[amic]) {
            this.missatges[amic] = [];
        }
        this.missatges[amic].push({ missatge, enviat: new Date() });
        console.log(`Missatge enviat a ${amic}: ${missatge}`);
    }

}

module.exports = enviarMensaje;


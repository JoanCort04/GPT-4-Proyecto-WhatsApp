class estadoMensaje {
    constructor() {
        this.missatges = {};
    }

    actualitzarEstatMissatge(amic, index, nouEstat) {
        if (this.missatges[amic] && this.missatges[amic][index]) {
            this.missatges[amic][index].estat = nouEstat;
            console.log(`Estat del missatge actualitzat a ${nouEstat}`);
        } else {
            console.log(`No s'ha trobat el missatge per actualitzar.`);
        }
    }

    afegirMissatge(amic, missatge) {
        if (!this.missatges[amic]) {
            this.missatges[amic] = [];
        }
        this.missatges[amic].push({ text: missatge, estat: 'enviat' });
        console.log(`Missatge afegit per a ${amic}`);
    }

    marcarComRebut(amic, index) {
        this.actualitzarEstatMissatge(amic, index, 'rebut');
    }

    marcarComLlegit(amic, index) {
        this.actualitzarEstatMissatge(amic, index, 'llegit');
    }
}

module.exports = estadoMensaje;



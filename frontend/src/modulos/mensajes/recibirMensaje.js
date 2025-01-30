class recibirMensaje {
    constructor() {
        this.missatges = {};
    }


    rebreMissatges(amic) {
        return this.missatges[amic] || [];
    }

    rebreMissatgesRecents(amic, limit = 10) {
        const missatges = this.missatges[amic] || [];
        return missatges.slice(-limit).reverse();
    }

    rebreMissatgesAntics(amic, limit = 10) {
        const missatges = this.missatges[amic] || [];
        return missatges.slice(0, limit);
    }
}

module.exports = recibirMensaje;

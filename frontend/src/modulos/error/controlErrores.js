/* try catch finally
async await */


// CREAR FUNCIONES PARA MANEJAR LOS ERRORES
/* centralizarla en una única función (recomendable) */

// PERSONALIZAR ERRORES PA' QUE NO SALGA EL CHURRO (console.error())

//Async await y promesas

//Errores específicos de la API
//Errores en la Validación de datos
//Manejo de errorres de la interfaz de usuario. 
// 

export class Error_Validació extends Error {
  constructor(avis) {
    super(avis);
    this.missatge = "Error en la validació de dades";
  }
}

export class Error_API extends Error {
  constructor(avis) {
    super(avis);
    this.missatge = "Error en l'API";
  }
}
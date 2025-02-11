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
  /**
   * Custom error class for API-related errors.
   * @param {string} avis - Specific error message.
   * @param {number} [codiError] - HTTP status code (optional).
   * @param {string} [endpoint] - API endpoint where the error occurred (optional).
   */
  constructor(
    avis = "S'ha produït un error en l'API",
    codiError = null,
    endpoint = null
  ) {
    super(avis);

    // Custom properties
    this.name = "Error_API";
    this.missatge = "Error en l'API"; // Default generic error message
    this.codiError = codiError; // Stores HTTP error code (optional)
    this.endpoint = endpoint; // Stores API endpoint (optional)

    // Ensures stack trace is captured properly
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Error_API);
    }
  }

  /**
   * Formats error details into a readable string.
   * @returns {string} Formatted error message.
   */
  toString() {
    return (
      `[${this.name}] ${this.missatge}: ${this.message}` +
      (this.codiError ? ` (Codi: ${this.codiError})` : "") +
      (this.endpoint ? ` [Endpoint: ${this.endpoint}]` : "")
    );
  }
}

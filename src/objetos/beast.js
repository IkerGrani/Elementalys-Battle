export class Beast {
    constructor(nombre, descripcion, imagen, tipo, vida, ataque, defensa) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.tipo = tipo;

        // Controlar la salud incial y la saludad al recibir daño
        this.vidaInicial = vida;
        this.vidaActual = vida;

        this.ataque = ataque;
        this.defensa = defensa;
        this.debilitado = false;
    }

    /**
     * Reduce la vida actual del Beast al recibir daño.
     * @param {number} damage Cantidad de daño recibido.
     * @returns {number} Vida acutal despues de recibir daño.
     */
    recibirDamage(damage) { //setDamage
        this.vidaActual = Math.max(0, this.vidaActual - damage);
        if (this.vidaActual === 0 ) this.debilitado = true; 
        return this.vidaActual;
    }

    /**
     * Se calcula el multiplicador de daño elemental.
     * Si no es ataque elemental, el daño es neutro (1.0).
     * Si es elemental, aplica la tabla de ventajas (1.5) y debilidades (0.5).
     * 
     * @param {string} tipoDefensor El tipo del Beast enemigo.
     * @param {boolean} esElemental Si es ataque elemental o no.
     * @returns {number} 1.5 (Ventaja), 0.5 (Desventaja) o 1.0 (Neutro)
     */
    obtenerMultiplicadorElemental(tipoDefensor, esElemental = false) { //get
        // Se comprueba si el ataque es elementarl
        if (!esElemental || !tipoDefensor) return 1.0;

        // Tabla de ventajas
        /*
            AGL: { AGL: 1, STR: 1.5, TEQ: 0.5, PHY: 0.5, INT: 1.5 }
            STR: { STR: 1, PHY: 1.5, AGL: 0.5, INT: 0.5, TEQ: 1.5 }
            PHY: { PHY: 1, INT: 1.5, STR: 0.5, TEQ: 0.5, AGL: 1.5 }
            INT: { INT: 1, TEQ: 1.5, PHY: 0.5, STR: 0.5, AGL: 1.5 } 
            TEQ: { TEQ: 1, AGL: 1.5, INT: 0.5, STR: 0.5, PHY: 1.5 } 
        */
        const ventajas = {
            PHY: ["INT", "AGL"],
            INT: ["STR", "TEQ"],
            STR: ["PHY", "TEQ"],
            AGL: ["STR", "INT"],
            TEQ: ["AGL", "PHY"]
        };

        // Obtenemos los tipos
        const atacante = this.tipo.toUpperCase();
        const defensor = tipoDefensor.toUpperCase();

        /**
         * Comprobamos las ventajas y desventajas
         * if (atacante === defensor) - Si son del mismo tipo.
         * if (ventajas[atacante].includes(defensor)) - Si el tipo defensor esta en las
         * ventajas del atacante.
         * if (ventajas[defensor].includes(atacante)) - Si el tipo atacante esta en las 
         * ventajas del defensor.
         */
        if (atacante === defensor) return 1.0;
        if (ventajas[atacante].includes(defensor)) return 1.5;
        if (ventajas[defensor].includes(atacante)) return 0.5;

        return 1.0;
    }

    /**
     * Devuelve el porcentaje de salud.
     * @returns {number} La salud final en porcentaje.
     */
    obtenerPorcentajeVida() {
        return Math.max(0, Math.round((this.vidaActual / this.vidaInicial) * 100));
    }

    /**
     * Se comprueba si la criatura sigue viva.
     * @returns {boolean} True si no está debilitada
     */
    estaViva() { return !this.debilitado && this.vidaActual > 0 }

    /**
     * Funcion para clonar el Beast. 
     * Los Objetos en js funcionan por referencia, por lo que clonamos cada beast 
     * para tener sus propias estadisticas independientes.
     * @returns {Beast} Nueva criatura
     */ 
    clonar() {
        const copia = new Beast(
            this.nombre,
            this.descripcion,
            this.imagen,
            this.tipo,
            this.vidaInicial,
            this.ataque,
            this.defensa
        );
        // Copiamos las propiedades que faltan en el constructor
        copia.vidaActual = this.vidaActual;
        copia.debilitado = this.debilitado;
        return copia;
    }


}

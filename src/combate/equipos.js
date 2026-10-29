import { BeastDAO } from '../dao/beastDAO.js';

// Array que contendrá todas las criaturas cargadas de la BBDD
let catalogoBeasts = [];
let beastJugador = [];
let beastEnemigo = [];

function elegirBeasts() {
    const equipo = [];

    for (let i = 0; i < 3; i++) {
        const indiceAleatorio = Math.floor(
            Math.random() * catalogoBeasts.length
        );
        equipo.push(catalogoBeasts[indiceAleatorio]);
    }

    return equipo;
}

try {
    catalogoBeasts = await BeastDAO.obtenerTodos();
    beastJugador = elegirBeasts();
    beastEnemigo = elegirBeasts();
} catch (error) {
    console.error("Error crítico al cargar criaturas:", error);
}

export function getBeastJugador() {
    return beastJugador;
}

export function getBeastEnemigo() {
    return beastEnemigo;
}
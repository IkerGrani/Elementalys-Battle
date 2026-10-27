// combate.js — Lógica de interacción de la pantalla de combate
import { BeastDAO } from './dao/beastDAO.js';

const btnLuchar = document.getElementById("ataques");
const btnAtk1 = document.getElementById("atk1");
const btnAtk2 = document.getElementById("atk2");
const btnVolver = document.getElementById("volver");
const btnCambiar = document.getElementById("cambiar");
const teamPanel = document.getElementById("team");

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

async function elegirEquipos() {
    try {
        catalogoBeasts = await BeastDAO.obtenerTodos();
        console.log("Criaturas cargadas:", catalogoBeasts);

        beastJugador = elegirBeasts();
        beastEnemigo = elegirBeasts();
    } catch (error) {
        console.error("Error al cargar las criaturas:", error);
        throw error;
    }
}

function cargarCombate() {
    const jugador = beastJugador[0];
    const enemigo = beastEnemigo[0];

    if (!jugador || !enemigo) {
        console.error("No se pudieron cargar las criaturas del combate.");
        return;
    }

    document.getElementById("evento").innerText =
        `¡Un ${enemigo.nombre} salvaje aparece!`;

    document.getElementById("battle").innerHTML = `
        <div class="creature-window enemy">
            <div class="creature-placeholder ${enemigo.tipo}"></div>
            <span class="creature-name">${enemigo.nombre}</span>
            <div class="creature-stats">
                <span>HP: ${enemigo.vida}</span>
                <div class="hp-bar">
                    <div class="hp-fill" style="width: 100%"></div>
                </div>
            </div>
        </div>

        <div class="creature-window player">
            <div class="creature-placeholder ${jugador.tipo}"></div>
            <span class="creature-name">${jugador.nombre}</span>
            <div class="creature-stats">
                <span>HP: ${jugador.vida}</span>
                <div class="hp-bar">
                    <div class="hp-fill" style="width: 100%"></div>
                </div>
            </div>
        </div>
    `;
}

async function iniciarCombate() {
    await elegirEquipos();

    console.log("Equipo del jugador:", beastJugador);
    console.log("Equipo del enemigo:", beastEnemigo);

    cargarCombate();
}

iniciarCombate();

// Estado inicial: solo se ven "Luchar" y "Cambiar".
function ocultarTodo() {
    btnLuchar.hidden = true;
    btnCambiar.hidden = true;
    btnAtk1.hidden = true;
    btnAtk2.hidden = true;
    btnVolver.hidden = true;
    teamPanel.hidden = true;
}

// Al pulsar "Luchar" → revelamos los 2 ataques y un botón "Volver".
btnLuchar.addEventListener("click", () => {
    btnLuchar.hidden = true;
    btnCambiar.hidden = true;
    btnAtk1.hidden = false;
    btnAtk2.hidden = false;
    btnVolver.hidden = false;

    document.getElementById("evento").innerText = `¿Qué debería hacer ${beastJugador.nombre}?`;
});

// Al pulsar "Volver" → volvemos al estado inicial (Luchar + Cambiar).
btnVolver.addEventListener("click", () => {
    btnLuchar.hidden = false;
    btnCambiar.hidden = false;
    btnAtk1.hidden = true;
    btnAtk2.hidden = true;
    btnVolver.hidden = true;
    teamPanel.hidden = true;
});

// Al pulsar "Cambiar" → mostramos el panel del equipo y ocultamos las opciones.
btnCambiar.addEventListener("click", () => {
    ocultarTodo();
    teamPanel.hidden = false;
    btnVolver.hidden = false;
});

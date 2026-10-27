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
            <div class="creature-tipe">${enemigo.tipo}</div>
            <img class="creature-img" src="../assets/images/characters/${enemigo.imagen}" alt="${enemigo.nombre}">
            <span class="creature-name">${enemigo.nombre}</span>
            <div class="creature-stats">
                <span>HP: ${enemigo.vida}</span>
                <div class="hp-bar">
                    <div class="hp-fill" style="width: 100%"></div>
                </div>
            </div>
        </div>

        <div class="creature-window player">
            <div class="creature-tipe">${jugador.tipo}</div>
            <img class="creature-img" src="../assets/images/characters/${jugador.imagen}" alt="${jugador.nombre}">
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

// Funcion para calcular el daño de combate
function calcularDaño(beastAtacante, beastDefensor, esElemental) {
    var dañoSimple = beastAtacante.ataque + Math.floor(Math.random() * beastAtacante.ataque) - beastDefensor.defensa;
    var multiplicador = 1.0; 

    if (esElemental) {
        const multiplicadoresTipos = {
            AGL: { AGL: 1, STR: 1.5, TEQ: 0.5, PHY: 0.5, INT: 1.5 }, 
            STR: { STR: 1, PHY: 1.5, AGL: 0.5, INT: 0.5, TEQ: 1.5 }, 
            PHY: { PHY: 1, INT: 1.5, STR: 0.5, TEQ: 0.5, AGL: 1.5 }, 
            INT: { INT: 1, TEQ: 1.5, PHY: 0.5, STR: 0.5, AGL: 1.5 }, 
            TEQ: { TEQ: 1, AGL: 1.5, INT: 0.5, STR: 0.5, PHY: 1.5 }  
        };

        const elTipoDelAtacante = beastAtacante.tipo;
        const elTipoDelDefensor = beastDefensor.tipo;
        
        multiplicador = (multiplicadoresTipos[elTipoDelAtacante] && multiplicadoresTipos[elTipoDelAtacante][elTipoDelDefensor]) || 1.0;
    }

    var dañoFinal = dañoSimple * multiplicador;

    return Math.max(1, Math.floor(dañoFinal));
}


// Función auxiliar para pausar el código (simular el tiempo de las animaciones)
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Función para actualizar visualmente la vida en el HTML
function actualizarBarras() {
    const jugador = beastJugador[0];
    const enemigo = beastEnemigo[0];

    // Calculamos el porcentaje (Asumiendo que guardas la vida máxima, si no, usa una vida base como 100)
    // Si no tienes vidaMax en tu BBDD, puedes usar simplemente la vida actual o añadir la propiedad vidaMax en el DAO
    const porcentajeEnemigo = Math.max(0, (enemigo.vida / (enemigo.vidaMax || 100)) * 100);
    const porcentajeJugador = Math.max(0, (jugador.vida / (jugador.vidaMax || 100)) * 100);

    // Buscamos los elementos del DOM creados en cargarCombate() y los actualizamos
    const ventanas = document.querySelectorAll('.creature-window');
    
    // Enemigo (Primera ventana en tu HTML)
    ventanas[0].querySelector('.creature-stats span').innerText = `HP: ${Math.floor(enemigo.vida)}`;
    ventanas[0].querySelector('.hp-fill').style.width = `${porcentajeEnemigo}%`;

    // Jugador (Segunda ventana en tu HTML)
    ventanas[1].querySelector('.creature-stats span').innerText = `HP: ${Math.floor(jugador.vida)}`;
    ventanas[1].querySelector('.hp-fill').style.width = `${porcentajeJugador}%`;
}

async function turno(ataque) {
    faseAtaque(); 

    // Extraemos las referencias claras del primer elemento de tus arrays
    const jugador = beastJugador[0];
    const enemigo = beastEnemigo[0];
    const txtEvento = document.getElementById("evento");

    // --- TURNO DEL JUGADOR ---
    txtEvento.innerText = `¡${jugador.nombre} usó ${ataque.nombre}!`;
    
    // CORRECTO: jugador ataca a enemigo
    var dañoAlEnemigo = calcularDaño(jugador, enemigo, ataque.esElemental);
    enemigo.vida -= dañoAlEnemigo;
    if (enemigo.vida < 0) enemigo.vida = 0;

    await esperar(1000); 
    actualizarBarras();  

    if (enemigo.vida <= 0) {
        enemigo.debilitado = true;
        txtEvento.innerText = `¡El ${enemigo.nombre} salvaje se ha debilitado!`;
        return; 
    }

    await esperar(1500); 

    // --- TURNO DEL ENEMIGO ---
    txtEvento.innerText = `¡El ${enemigo.nombre} salvaje usa Placaje!`;
    
    // CORRECTO: enemigo ataca a jugador
    var dañoAlJugador = calcularDaño(enemigo, jugador, false); 
    jugador.vida -= dañoAlJugador;
    if (jugador.vida < 0) jugador.vida = 0;

    await esperar(1000); 
    actualizarBarras(); 

    // Comprobamos si el jugador muere
    if (jugador.vida <= 0) {
        jugador.debilitado = true;
        txtEvento.innerText = `¡Tu ${jugador.nombre} se ha debilitado!`;
        return;
    }

    await esperar(1500);

    // --- FIN DEL TURNO: REHABILITAR INTERFAZ ---
    // Volvemos al estado inicial (Botones Luchar y Cambiar visibles y habilitados)
    btnLuchar.disabled = false;
    btnCambiar.disabled = false;
    
    btnLuchar.hidden = false;
    btnCambiar.hidden = false;
    btnAtk1.hidden = true;
    btnAtk2.hidden = true;
    btnVolver.hidden = true;

    txtEvento.innerText = `¿Qué debería hacer ${jugador.nombre}?`;
}



btnAtk1.addEventListener("click", () => {
    turno({ nombre: "Placaje", esElemental: false });
});

btnAtk2.addEventListener("click", () => {
    turno({ nombre: "Rayo Elemental", esElemental: true });
});


// Estado inicial: solo se ven "Luchar" y "Cambiar".
function ocultarTodo() {
    btnLuchar.hidden = true;
    btnCambiar.hidden = true;
    btnAtk1.hidden = true;
    btnAtk2.hidden = true;
    btnVolver.hidden = true;
    teamPanel.hidden = true;
}

// Estado inicial: solo se ven "Luchar" y "Cambiar".
function faseAtaque() {
    ocultarTodo();
    btnLuchar.disabled = true;
    btnCambiar.disabled = true;
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

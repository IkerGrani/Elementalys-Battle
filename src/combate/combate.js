// combate.js — Lógica de interacción de la pantalla de combate
import { BeastDAO } from '../dao/beastDAO.js';

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
        // Clonamos el objeto para que jugador y enemigo no compartan la misma memoria
        const beastClonada = { ...catalogoBeasts[indiceAleatorio] };
        
        // Guardamos la vida máxima inicial para las barras de salud
        if (!beastClonada.vidaMax) {
            beastClonada.vidaMax = beastClonada.vida;
        }
        
        equipo.push(beastClonada);
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
function actualizarVidaJugador() {
    const jugador = beastJugador[0];
    const porcentajeJugador = Math.max(0, (jugador.vida / (jugador.vidaMax || 100)) * 100);
    const ventanas = document.querySelectorAll('.creature-window');

    ventanas[1].querySelector('.creature-stats span').innerText = `HP: ${Math.floor(jugador.vida)}`;
    ventanas[1].querySelector('.hp-fill').style.width = `${porcentajeJugador}%`;
}

function actualizarVidaEnemigo() {
    const enemigo = beastEnemigo[0];
    const porcentajeEnemigo = Math.max(0, (enemigo.vida / (enemigo.vidaMax || 100)) * 100);
    const ventanas = document.querySelectorAll('.creature-window');
    
    ventanas[0].querySelector('.creature-stats span').innerText = `HP: ${Math.floor(enemigo.vida)}`;
    ventanas[0].querySelector('.hp-fill').style.width = `${porcentajeEnemigo}%`;
}

// Restablece los botones del menú de acciones principal
function regresarMenuCombate() {
    btnLuchar.disabled = false;
    btnCambiar.disabled = false;
    btnLuchar.hidden = false;
    btnCambiar.hidden = false;
    btnAtk1.hidden = true;
    btnAtk2.hidden = true;
    btnVolver.hidden = true;
    teamPanel.hidden = true;
    document.getElementById("evento").innerText = `¿Qué debería hacer ${beastJugador[0].nombre}?`;
}

// Comprueba si quedan vivos en la reserva del jugador o si es fin de partida
function comprobarDerrotaORelevo() {
    const quedanVivos = beastJugador.some(beast => !beast.debilitado && beast.vida > 0);

    if (!quedanVivos) {
        document.getElementById("evento").innerText = "¡Ya no te quedan criaturas utilizables! Has perdido el combate. 💀";
        ocultarTodo();
    } else {
        mostrarPanelCambio();
    }
}

// NUEVO: Comprueba si al enemigo le quedan criaturas disponibles y ejecuta el relevo de la IA
async function comprobarDerrotaORelevoEnemigo() {
    // Buscamos si hay algún beast enemigo en el array que no esté debilitado y tenga vida
    const indiceSiguienteEnemigo = beastEnemigo.findIndex(beast => !beast.debilitado && beast.vida > 0);

    if (indiceSiguienteEnemigo === -1) {
        document.getElementById("evento").innerText = "¡Has derrotado a todo el equipo enemigo! ¡Has ganado el combate! 🏆";
        ocultarTodo();
        await esperar(5000);
        window.location.href = '../index.html';
    } else {
        const txtEvento = document.getElementById("evento");
        await esperar(1500);

        // Intercambiamos el enemigo derrotado (índice 0) por el nuevo que esté vivo
        const temp = beastEnemigo[0];
        beastEnemigo[0] = beastEnemigo[indiceSiguienteEnemigo];
        beastEnemigo[indiceSiguienteEnemigo] = temp;

        // Redibujamos la pantalla para mostrar los datos de la nueva criatura rival
        cargarCombate();
        txtEvento.innerText = `¡El entrenador enemigo envía a ${beastEnemigo[0].nombre} al combate!`;
        
        await esperar(2000);
        regresarMenuCombate();
    }
}

// Renderiza los aliados disponibles en el panel de cambio
function mostrarPanelCambio() {
    ocultarTodo();
    teamPanel.innerHTML = ""; 
    teamPanel.hidden = false;
    btnVolver.hidden = false; 

    // Si la criatura actual está debilitada, no puedes "Volver" atrás
    if (beastJugador[0].vida <= 0) {
        btnVolver.hidden = true;
    }

    document.getElementById("evento").innerText = "Selecciona una criatura para combatir:";

    for (let i = 0; i < beastJugador.length; i++) {
        const beast = beastJugador[i];
        
        if (i === 0) continue; // Saltamos al activo

        if (!beast.debilitado && beast.vida > 0) {
            const btnBeast = document.createElement("button");
            btnBeast.className = "btn-team-member";
            btnBeast.style.margin = "5px"; 
            btnBeast.innerHTML = `${beast.nombre} (HP: ${Math.floor(beast.vida)}/${beast.vidaMax})`;
            
            btnBeast.addEventListener("click", () => {
                efectuarCambio(i);
            });
            
            teamPanel.appendChild(btnBeast);
        }
    }
}

// Ejecuta el intercambio mecánico de la criatura del jugador
async function efectuarCambio(indice) {
    teamPanel.hidden = true;
    btnVolver.hidden = true;
    
    const txtEvento = document.getElementById("evento");
    const estabaVivoElActual = beastJugador[0].vida > 0;
    
    if (estabaVivoElActual) {
        txtEvento.innerText = `¡Vuelve ${beastJugador[0].nombre}!`;
        await esperar(1200);
    }

    // Intercambiamos el elemento del índice seleccionado al índice 0
    const temp = beastJugador[0];
    beastJugador[0] = beastJugador[indice];
    beastJugador[indice] = temp;

    // Redibujamos la pantalla con el nuevo beast activo
    cargarCombate();
    txtEvento.innerText = `¡Adelante ${beastJugador[0].nombre}!`;
    await esperar(1500);

    // Si cambiamos por gusto (el anterior estaba vivo), el enemigo contraataca gratis
    if (estabaVivoElActual) {
        txtEvento.innerText = `¡El ${beastEnemigo[0].nombre} salvaje aprovecha tu cambio para atacar!`;
        await esperar(1200);
        
        txtEvento.innerText = `¡El ${beastEnemigo[0].nombre} salvaje usa Placaje!`;
        var dañoAlJugador = calcularDaño(beastEnemigo[0], beastJugador[0], false); 
        beastJugador[0].vida -= dañoAlJugador;
        if (beastJugador[0].vida < 0) beastJugador[0].vida = 0;
        
        await esperar(1000); 
        actualizarVidaJugador();

        if (beastJugador[0].vida <= 0) {
            beastJugador[0].debilitado = true;
            txtEvento.innerText = "¡Tu ${beastJugador[0].nombre} se ha debilitado!";
            await esperar(1500);
            comprobarDerrotaORelevo();
            return;
        }
    await esperar(1500);
    }
    regresarMenuCombate();
}

async function ejecutarAnimacionAtaque(esJugadorAtacante, esElemental, beastAtacante) {
    const ventanas = document.querySelectorAll('.creature-window');
    // Según tu CSS: ventanas[0] es Enemy (.enemy), ventanas[1] es Player (.player)
    const atacanteDOM = esJugadorAtacante ? ventanas[1] : ventanas[0];
    const defensorDOM = esJugadorAtacante ? ventanas[0] : ventanas[1];

    if (esElemental) {
        // --- LÓGICA DEL RAYO (KAMEHAMEHA) ---
        const rayo = document.createElement('div');
        rayo.classList.add('rayo-especial');

        // Mapeo de colores según la afinidad/tipo de la criatura
        const coloresTipos = {
            AGL: '#00b4d8', // Azul / Agilidad
            STR: '#ff4d4d', // Rojo / Fuerza
            TEQ: '#ffcc00', // Amarillo-Dorado / Técnica
            PHY: '#cfd8e0', // Blanco-Gris / Físico
            INT: '#a349a4'  // Morado / Inteligencia
        };

        // Asignamos el color basado en el tipo del atacante (por defecto azul si no se encuentra)
        const colorHex = coloresTipos[beastAtacante.tipo] || '#3a86ff';
        rayo.style.setProperty('--color-rayo', colorHex);

        // Calcular posiciones relativas de centro a centro
        const rectAtacante = atacanteDOM.getBoundingClientRect();
        const rectDefensor = defensorDOM.getBoundingClientRect();
        const rectBattle = document.getElementById('battle').getBoundingClientRect();

        const xInicio = (rectAtacante.left + rectAtacante.width / 2) - rectBattle.left;
        const yInicio = (rectAtacante.top + rectAtacante.height / 2) - rectBattle.top;
        
        const xFin = (rectDefensor.left + rectDefensor.width / 2) - rectBattle.left;
        const yFin = (rectDefensor.top + rectDefensor.height / 2) - rectBattle.top;
        
        const angulo = Math.atan2(yFin - yInicio, xFin - xInicio) * (180 / Math.PI);

        rayo.style.left = `${xInicio}px`;
        rayo.style.top = `${yInicio}px`;
        rayo.style.transform = `rotate(${angulo}deg)`;

        document.getElementById('battle').appendChild(rayo);

        // El rayo viaja e impacta a los 0.2s
        await esperar(200);
        defensorDOM.classList.add('anim-recibir-daño');
        
        await esperar(400);
        rayo.remove();
        defensorDOM.classList.remove('anim-recibir-daño');

    } else {
        // --- LÓGICA DEL PLACAJE (NORMAL) ---
        const clasePlacaje = esJugadorAtacante ? 'anim-atacar-player' : 'anim-atacar-enemy';
        
        atacanteDOM.classList.add(clasePlacaje);
        
        // Impacto a mitad de animación física
        await esperar(200);
        defensorDOM.classList.add('anim-recibir-daño');
        
        await esperar(300);
        atacanteDOM.classList.remove(clasePlacaje);
        defensorDOM.classList.remove('anim-recibir-daño');
    }
}


async function turno(ataque) {
    faseAtaque();
    const jugador = beastJugador[0];
    const enemigo = beastEnemigo[0];
    const txtEvento = document.getElementById("evento");

    // ==========================================
    // --- FASE 1: TURNO DEL JUGADOR ---
    // ==========================================
    txtEvento.innerText = `¡${jugador.nombre} usó ${ataque.nombre}!`;
    await esperar(600); // Pequeña pausa dramática antes del golpe

    // 1. Ejecutar animación del jugador atacando (Pasamos el objeto 'jugador')
    await ejecutarAnimacionAtaque(true, ataque.esElemental, jugador);

    // 2. Calcular y aplicar daño mecánico al enemigo
    var dañoAlEnemigo = calcularDaño(jugador, enemigo, ataque.esElemental);
    enemigo.vida -= dañoAlEnemigo;
    if (enemigo.vida < 0) enemigo.vida = 0;
    
    // 3. Actualizar la barra justo en el impacto
    actualizarVidaEnemigo();

    if (enemigo.vida <= 0) {
        enemigo.debilitado = true;
        txtEvento.innerText = `¡El ${enemigo.nombre} salvaje se ha debilitado!`;
        await comprobarDerrotaORelevoEnemigo();
        return; // Finaliza la ejecución si el enemigo muere
    }

    await esperar(1000);

    // ==========================================
    // --- FASE 2: TURNO DEL ENEMIGO ---
    // ==========================================
    txtEvento.innerText = `¡El ${enemigo.nombre} salvaje usa Placaje!`;
    await esperar(600);

    // 1. Ejecutar animación del enemigo atacando (Pasamos false porque no es el jugador, false por físico, y el objeto 'enemigo')
    await ejecutarAnimacionAtaque(false, false, enemigo);

    // 2. Calcular y aplicar daño mecánico al jugador
    var dañoAlJugador = calcularDaño(enemigo, jugador, false);
    jugador.vida -= dañoAlJugador;
    if (jugador.vida < 0) jugador.vida = 0;
    
    // 3. Actualizar la interfaz del jugador
    actualizarVidaJugador();

    if (jugador.vida <= 0) {
        jugador.debilitado = true;
        txtEvento.innerText = `¡Tu ${jugador.nombre} se ha debilitado!`;
        await esperar(1500);
        comprobarDerrotaORelevo();
        return;
    }

    await esperar(1500);

    // --- FIN DEL TURNO ---
    regresarMenuCombate();
}

// --- LISTENERS Y MANEJO DE INTERFAZ ---
btnAtk1.addEventListener("click", () => {
turno({ nombre: "Placaje", esElemental: false });
console.log("Ataque 1");
});
btnAtk2.addEventListener("click", () => {
turno({ nombre: "Rayo Elemental", esElemental: true });
console.log("Ataque 2");
});
function ocultarTodo() {
btnLuchar.hidden = true;
btnCambiar.hidden = true;
btnAtk1.hidden = true;
btnAtk2.hidden = true;
btnVolver.hidden = true;
teamPanel.hidden = true;
}
function faseAtaque() {
ocultarTodo();
btnLuchar.disabled = true;
btnCambiar.disabled = true;
}
btnLuchar.addEventListener("click", () => {
btnLuchar.hidden = true;
btnCambiar.hidden = true;
btnAtk1.hidden = false;
btnAtk2.hidden = false;
btnVolver.hidden = false;
document.getElementById("evento").innerText = "¿Qué debería hacer ${beastJugador[0].nombre}?";
});

btnCambiar.addEventListener("click", () => {
mostrarPanelCambio();
});

btnVolver.addEventListener("click", () => {
regresarMenuCombate();
});
/**
 * Importamos las clases necesarias para poder obtener los Beasts de Firebase,
 * asi como de la clase definida para manejar a cada Beast con sus estadisticas.
 */
import { User } from '../objetos/user.js';
import { UserDAO } from '../dao/userDAO.js';
import { BeastDAO } from '../dao/beastDAO.js';
import { Beast } from '../objetos/beast.js';

/**
 * Constantes para guardar la informacion de los siguiente:
 *  1. RANKING_RESET_FLAG - Para volver a mostrar datos del ranking al terminar una partida.
 *  2. SESSION_ATTEMPTS_KEY - Para ver cuantas partidas se ha jugado en la sesion.
 */
const RANKING_RESET_FLAG = "elementalys_ranking_reset_flag";
const SESSION_ATTEMPTS_KEY = "elementalys_session_attempts";

/**
 * Elementos del DOM para menajera la interfaz a la hora de hacer
 * alguna accion con los beasts.
 */
const btnLuchar = document.getElementById("ataques");
const btnAtk1 = document.getElementById("atk1");
const btnAtk2 = document.getElementById("atk2");
const btnCambiar = document.getElementById("cambiar");
const teamPanel = document.getElementById("team");
const btnVolver = document.getElementById("volver");
const txtEvento = document.getElementById("evento");
const battleContenedor = document.getElementById("battle");
const logContenedor = document.getElementById("log");

/* ===== CONFIGURACION DEL COMBATE ===== */
let catalogoBeasts = [];
let beastJugador = [];
let beastEnemigo = [];
let numeroTurno = 1;

/**
 * Función para pausar el codigo (simular el tiempo de las animaciones)
 * @param {number} ms Tiempo de espera en milisegundos.
 * @returns {Promise<void>} Promesa que se resuelve al terminar la espera.
 */
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/* ===== SISTEMA DE LOGS ===== */

/**
 * Funcion para escribir contenedor #log y desplazar el scroll hacia abajo.
 * @param {string} mensaje Texto de la accion realizada.
 */
function agregarLog(mensaje) {
    if (!logContenedor) return;
    const entrada = document.createElement("p");
    entrada.innerHTML = mensaje;
    logContenedor.appendChild(entrada);
    logContenedor.scrollTop = logContenedor.scrollHeight;
}

/**
 * Inicia el panel del log con el numero de intento de la sesion actual.
 * @param {number} intento Numero de partida dentro de la sesión.
 */
function inicializarLog(intento) {
    if (!logContenedor) return;
    logContenedor.innerHTML = `<strong>--- Partida #${intento} ---</strong>`;
    agregarLog(`El combate ha comenzado. ¡El combate ha comenzado!`);
}

/* ===== SELECCIÓN Y CONFIGURACIÓN DE EQUIPOS ===== */

/**
 * Funcion para seleccionar 3 criaturas aleatorias del catalogo y asignarlo a un equipo.
 * @returns {Array<Object>} Array con 3 criaturas (Beast) independientes.
 */
function elegirBeasts() {
    const equipo = [];
    for (let i = 0; i < 3; i++) {
        const indiceAleatorio = Math.floor(Math.random() * catalogoBeasts.length);
        // Clonamos el beast seleccionado y se lo asignamos al equipo.
        equipo.push(catalogoBeasts[indiceAleatorio].clonar());
    }
    return equipo;
}

/**
 * Funcion para obtener todos los Beasts de firebase mediante el DAO, 
 * para luego asiganarlo al jugador y a la maquina.
 */
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

/**
 * Funcion para registrar el numero de intentos en la sesion actual (sessionStorage).
 * 
 * @returns Numero actual de partida.
 */
function registrarIntentosSesion() {
    let intentos = Number(sessionStorage.getItem(SESSION_ATTEMPTS_KEY)) || 0;
    intentos += 1;
    sessionStorage.setItem(SESSION_ATTEMPTS_KEY, intentos);
    return intentos;
}


/**
 * Funcion para cargar el combate mediante el contenedor HTML #battle.
 * Mostrando incialemnte la primera criatura de ambos equipos.
 */
function cargarCombate() {
    const jugador = beastJugador[0];
    const enemigo = beastEnemigo[0];

    console.log(jugador);
    console.log(enemigo);

    if (!jugador || !enemigo) {
        console.error("No se pudieron cargar las criaturas del combate.");
        return;
    }

    txtEvento.innerText = `¡Un ${enemigo.nombre} salvaje aparece!`;

    battleContenedor.innerHTML = `
        <div class="creature-window enemy">
            <div class="creature-tipe ${enemigo.tipo.toLowerCase()}"><span>${enemigo.tipo}</span></div>
            <img class="creature-img anim-espera" id="enemigoImg" src="../assets/images/characters/${enemigo.imagen}" alt="${enemigo.nombre}">
            <span class="creature-name">${enemigo.nombre}</span>
            <div class="creature-stats">
                <span>HP: ${enemigo.vidaActual}</span>
                <div class="hp-bar">
                    <div class="hp-fill" style="width:  ${enemigo.obtenerPorcentajeVida()}%"></div>
                </div>
            </div>
        </div>

        <div class="creature-window player">
            <div class="creature-tipe ${jugador.tipo.toLowerCase()}"><span>${jugador.tipo}</span></div>
            <img class="creature-img anim-espera" id="jugadorImg" src="../assets/images/characters/${jugador.imagen}" alt="${jugador.nombre}">
            <span class="creature-name">${jugador.nombre}</span>
            <div class="creature-stats">
                <span>HP: ${jugador.vidaActual}</span>
                <div class="hp-bar">
                    <div class="hp-fill" style="width: ${jugador.obtenerPorcentajeVida()}%"></div>
                </div>
            </div>
        </div>
    `;
}

/* ===== LOGICA DE DAÑO Y CAMBIO VISUAL ===== */

/**
 * Funcion para calcular el daño utilizando las estadísticas y tipo del Beast.
 * @param {Beast} atacante La criatura que ataca.
 * @param {Beast} defensor La criatura que defiende.
 * @param {boolean} esElemental Si el ataque es de tipo elemental o no.
 * @returns {number} Daño final.
 */
function calcularDaño(atacante, defensor, esElemental) {
    // Ataque simple de la criatura
    const dañoSimple = atacante.ataque + Math.floor(Math.random() * atacante.ataque) - defensor.defensa;
    // Obtenemos el multiplicador elemental desde la clase Beast
    const multiplicador = atacante.obtenerMultiplicadorElemental(defensor.tipo, esElemental);
    return Math.max(1, Math.floor(dañoSimple * multiplicador));
}

/**
 * Actualiza la barra y el texto de salud del jugador.
 */
function actualizarVidaJugador() {
    const jugador = beastJugador[0];
    const ventanas = document.querySelectorAll('.creature-window');
    // if (!ventanas[1]) return;

    ventanas[1].querySelector('.creature-stats span').innerText = `HP: ${jugador.vidaActual}`;
    ventanas[1].querySelector('.hp-fill').style.width = `${jugador.obtenerPorcentajeVida()}%`;
}

/**
 * Actualiza la barra y el texto de salud del enemigo.
 */
function actualizarVidaEnemigo() {
    const enemigo = beastEnemigo[0];
    const ventanas = document.querySelectorAll('.creature-window');
    // if (!ventanas[0]) return;

    ventanas[0].querySelector('.creature-stats span').innerText = `HP: ${enemigo.vidaActual}`;
    ventanas[0].querySelector('.hp-fill').style.width = `${enemigo.obtenerPorcentajeVida()}%`;
}

/* ===== ANIMACIONES EN COMBATE ===== */

/**
 * Se ejecuta la animacion correspondiente.
 * Si es elemental se muestra una especie de rayo.
 * Si es ataque normal, el atacante se mueve hacia el defensor.
 * @param {boolean} esJugadorAtacante Indicador si el que ataque es el jugador.
 * @param {boolean} esElemental Indica si el ataque es elemental.
 * @param {Beast} beastAtacante Critura que realiza el ataque.
 */
async function ejecutarAnimacionAtaque(esJugadorAtacante, esElemental, beastAtacante) {
    // Obtenemos las ventanas del jugador y del enemigo para saber donde realizar la animación.
    const ventanas = document.querySelectorAll('.creature-window');
    // Dependiendo de quien ataque, vemos a que ventana corresponde al atacante y al defensor.
    const atacanteDOM = esJugadorAtacante ? ventanas[1] : ventanas[0];
    const defensorDOM = esJugadorAtacante ? ventanas[0] : ventanas[1];

    if (esElemental) {
        const rayo = document.createElement('div');
        rayo.classList.add('rayo-especial');

        const coloresTipos = {
            AGL: '#00b4d8',
            STR: '#ff4d4d', 
            TEQ: '#15ff00', 
            PHY: '#d9ff00', 
            INT: '#a349a4'  
        };

        const colorHex = coloresTipos[beastAtacante.tipo] || '#3a86ff';
        rayo.style.setProperty('--color-rayo', colorHex);

        const rectAtacante = atacanteDOM.getBoundingClientRect();
        const rectDefensor = defensorDOM.getBoundingClientRect();
        const rectBattle = battleContenedor.getBoundingClientRect();

        const xInicio = (rectAtacante.left + rectAtacante.width / 2) - rectBattle.left;
        const yInicio = (rectAtacante.top + rectAtacante.height / 2) - rectBattle.top;
        
        const xFin = (rectDefensor.left + rectDefensor.width / 2) - rectBattle.left;
        const yFin = (rectDefensor.top + rectDefensor.height / 2) - rectBattle.top;
        
        const angulo = Math.atan2(yFin - yInicio, xFin - xInicio) * (180 / Math.PI);

        rayo.style.left = `${xInicio}px`;
        rayo.style.top = `${yInicio}px`;
        rayo.style.transform = `rotate(${angulo}deg)`;

        battleContenedor.appendChild(rayo);

        await esperar(200);
        defensorDOM.classList.add('anim-recibir-daño');
        
        await esperar(400);
        rayo.remove();
        defensorDOM.classList.remove('anim-recibir-daño');

    } else {
        const clasePlacaje = esJugadorAtacante ? 'anim-atacar-player' : 'anim-atacar-enemy';
        atacanteDOM.classList.add(clasePlacaje);
        
        await esperar(200);
        defensorDOM.classList.add('anim-recibir-daño');
        
        await esperar(300);
        atacanteDOM.classList.remove(clasePlacaje);
        defensorDOM.classList.remove('anim-recibir-daño');
    }
}

/* ===== FLUJO DE TURNOS ===== */

/**
 * Funcion para gestionar un turno completo del combate.
 * Primero ataca el jugador y si el enemigo sigue vivo este contraataca.
 * @param {Object} ataque Datos del ataque seleccionado (nombre y tipo).
 * @returns 
 */
async function turno(ataque) {
    // Desactivamos los botones para evitar que el jugador realice otras acciones
    faseAtaque();
    const jugador = beastJugador[0];
    const enemigo = beastEnemigo[0];

    const jugadorImg = document.getElementById("jugadorImg");
    const enemigoImg = document.getElementById("enemigoImg");

    // --- FASE 1: ATAQUE DEL JUGADOR ---
    txtEvento.innerText = `¡${jugador.nombre} usó ${ataque.nombre}!`;
    await esperar(600);

    await ejecutarAnimacionAtaque(true, ataque.esElemental, jugador);

    const dañoAlEnemigo = calcularDaño(jugador, enemigo, ataque.esElemental);
    enemigo.recibirDamage(dañoAlEnemigo);
    actualizarVidaEnemigo();

    let detalleEfecto = "";

    // Mensaje de efectividad elemental
    if (ataque.esElemental) {
        const mult = jugador.obtenerMultiplicadorElemental(enemigo.tipo, true);
        if (mult > 1.0) {
            detalleEfecto = " (¡Supereficaz!)";
            txtEvento.innerText = "¡Es supereficaz!";
        }
        else if (mult < 1.0) {
            detalleEfecto = " (Poco eficaz)";
            txtEvento.innerText = "No es muy eficaz...";
        }
        await esperar(900);
    }

    agregarLog(`Turno ${numeroTurno}: <strong>${jugador.nombre}</strong> usa ${ataque.nombre} e inflige ${dañoAlEnemigo} de daño${detalleEfecto}.`);

    if (!enemigo.estaViva()) {
        txtEvento.innerText = `¡El ${enemigo.nombre} salvaje se ha debilitado!`;
        agregarLog(`Turno ${numeroTurno}: <strong>${enemigo.nombre}</strong> enemigo se ha debilitado.`);
        numeroTurno += 1;
        await comprobarDerrotaORelevoEnemigo();
        return;
    }

    await esperar(1000);

    // --- FASE 2: CONTRAATAQUE DEL RIVAL ---
    txtEvento.innerText = `¡El ${enemigo.nombre} salvaje usa Placaje!`;
    await esperar(600);

    await ejecutarAnimacionAtaque(false, false, enemigo);

    const dañoAlJugador = calcularDaño(enemigo, jugador, false);
    jugador.recibirDamage(dañoAlJugador);
    actualizarVidaJugador();

    agregarLog(`Turno ${numeroTurno}: <strong>${enemigo.nombre}</strong> rival contraataca con Placaje e inflige ${dañoAlJugador} de daño.`);

    if (!jugador.estaViva()) {
        txtEvento.innerText = `¡Tu ${jugador.nombre} se ha debilitado!`;
        agregarLog(`Turno ${numeroTurno}: Tu <strong>${jugador.nombre}</strong> ha caído en combate.`);
        numeroTurno += 1;
        await esperar(1500);
        comprobarDerrotaORelevo();
        return;
    }

    await esperar(1500);
    
    numeroTurno += 1;

    regresarMenuCombate();
}

/* ===== RELEVOS Y GESTIÓN DE EQUIPOS ===== */

/**
 * Restaura el menu del combate despues de completar un turno.
 * Se vuelve a mostrar las opciones de luchar y cambiar de criatura.
 */
function regresarMenuCombate() {
    btnLuchar.disabled = false;
    btnCambiar.disabled = false;
    btnLuchar.hidden = false;
    btnCambiar.hidden = false;
    btnAtk1.hidden = true;
    btnAtk2.hidden = true;
    btnVolver.hidden = true;
    teamPanel.hidden = true;
    txtEvento.innerText = `¿Qué debería hacer ${beastJugador[0].nombre}?`;
}

/**
 * Muestra las criaturas disponibles del equipo del jugador.
 * Permite seleccionar otra criatura para continuar el combate.
 */
function mostrarPanelCambio() {
    ocultarTodo();
    teamPanel.innerHTML = ""; 
    teamPanel.hidden = false;
    btnVolver.hidden = false; 

    // Si la criatura actual cayó en combate, no se le permite volver atrás sin elegir
    if (!beastJugador[0].estaViva()) {
        btnVolver.hidden = true;
    }

    txtEvento.innerText = "Selecciona una criatura para combatir:";

    for (let i = 0; i < beastJugador.length; i++) {
        const beast = beastJugador[i];
        // No mostrar la criatura que ya está en el campo
        if (i === 0) continue; 

        if (beast.estaViva()) {
            const btnBeast = document.createElement("button");
            btnBeast.className = "btn-team-member";
            btnBeast.style.margin = "5px"; 
            btnBeast.innerHTML = `${beast.nombre} [${beast.tipo}] (HP: ${beast.vidaActual}/${beast.vidaInicial})`;
            
            btnBeast.addEventListener("click", () => efectuarCambio(i));
            teamPanel.appendChild(btnBeast);
        }
    }
}

/**
 * Cambia la criatura que esta luchando por otro del equipo.
 * Si el cambio es voluntario el enemigo realiza un ataque.
 * @param {number} indice Posicion de la criatura seleccionada dentro del equipo
 * @returns 
 */
async function efectuarCambio(indice) {
    teamPanel.hidden = true;
    btnVolver.hidden = true;
    
    const estabaVivoElActual = beastJugador[0].estaViva();
    const nombreAnterior = beastJugador[0].nombre;
    
    if (estabaVivoElActual) {
        txtEvento.innerText = `¡Vuelve ${beastJugador[0].nombre}!`;
        await esperar(1200);
    }

    // Intercambiamos la posición en el array (el índice 0 siempre es el activo en batalla)
    const temp = beastJugador[0];
    beastJugador[0] = beastJugador[indice];
    beastJugador[indice] = temp;

    cargarCombate();
    txtEvento.innerText = `¡Adelante ${beastJugador[0].nombre}!`;
    if (estabaVivoElActual) {
        agregarLog(`Turno ${numeroTurno}: El jugador envía a <strong>${nombreAnterior}</strong>. Y entra <strong>${beastJugador[0].nombre}</strong>.`);
    } else {
        agregarLog(`Entra al combate <strong>${beastJugador[0].nombre}</strong>.`);
    }
    await esperar(1500);

    // Si el cambio fue voluntario en medio de la pelea, el rival aprovecha para atacar gratis
    if (estabaVivoElActual) {
        txtEvento.innerText = `¡El ${beastEnemigo[0].nombre} salvaje aprovecha tu cambio para atacar!`;
        await esperar(1200);
        
        txtEvento.innerText = `¡El ${beastEnemigo[0].nombre} salvaje usa Placaje!`;
        const dañoAlJugador = calcularDaño(beastEnemigo[0], beastJugador[0], false); 
        beastJugador[0].recibirDamage(dañoAlJugador);
        
        await esperar(1000); 
        actualizarVidaJugador();

        agregarLog(`Turno ${numeroTurno}: <strong>${beastEnemigo[0].nombre}</strong> aprovecha el relevo y asesta ${dañoAlJugador} de daño.`);

        if (!beastJugador[0].estaViva()) {
            txtEvento.innerText = `¡Tu ${beastJugador[0].nombre} se ha debilitado!`;
            agregarLog(`Turno ${numeroTurno}: Tu <strong>${beastJugador[0].nombre}</strong> ha caído tras el relevo.`);
            numeroTurno += 1;
            await esperar(1500);
            comprobarDerrotaORelevo();
            return;
        }
        await esperar(1500);
    }

    numeroTurno += 1;

    regresarMenuCombate();
}

/**
 * Comprueba si el jugador todavía tiene criaturas para combatir.
 * Si no queda ninguna criatura, finaliza el combate. 
 * Si queda criaturas, muestra el panel de cambio.
 */
function comprobarDerrotaORelevo() {
    const quedanVivos = beastJugador.some(beast => beast.estaViva());

    if (!quedanVivos) {
        finalizarCombate(false);
    } else {
        mostrarPanelCambio();
    }
}

/**
 * Comprueba si quedan enemigos despues de derrotar a uno.
 * Si quedan, invoca al siguiente enemigo en el campo.
 * Si no queda ninguno, el jugador gana el combate.
 * 
 */
async function comprobarDerrotaORelevoEnemigo() {
    const indiceSiguienteEnemigo = beastEnemigo.findIndex(beast => beast.estaViva());

    if (indiceSiguienteEnemigo === -1) {
        finalizarCombate(true);
    } else {
        await esperar(1500);

        // Pasamos al siguiente enemigo vivo al puesto 0
        const temp = beastEnemigo[0];
        beastEnemigo[0] = beastEnemigo[indiceSiguienteEnemigo];
        beastEnemigo[indiceSiguienteEnemigo] = temp;

        cargarCombate();
        txtEvento.innerText = `¡El entrenador enemigo envía a ${beastEnemigo[0].nombre} al combate!`;
        agregarLog(`El rival saca a <strong>${beastEnemigo[0].nombre}</strong> (${beastEnemigo[0].tipo}).`);
        
        await esperar(2000);
        regresarMenuCombate();
    }
}

/* ===== ACABAR COMBATE ===== */

/**
 * Finaliza la partida y muestra el resultado del combate.
 * Al de unos segundos, devuelve al jugador a la pantalla principal.
 * @param {boolean} jugadorGana Indica si el jugador ha ganado o perdido.
 */
async function finalizarCombate(jugadorGana) {
    ocultarTodo();
    
    // Reactivamos el ranking
    localStorage.removeItem(RANKING_RESET_FLAG);

    // Si hay sesion iniciada, actualizamos las estadísticas del usuario
    const session = sessionStorage.getItem("usuarioSesion");
    if (session) {
        try {
            const sessionData = JSON.parse(session);
            const user = User.createUserFromFireBase(sessionData.uid, sessionData.email, sessionData);
            
            // Actualizamos victorias y jugadas
            user.registerMatchResult(jugadorGana);

            // Guardamos en firebase y actualizamos sessionStorage
            await UserDAO.saveUser(user);
            sessionStorage.setItem("usuarioSesion", JSON.stringify(user.toSessionObject()));
        } catch (error) {
            console.error("Error al actualizar estadisticas del jugador:", error);
        }
    }

    if (jugadorGana) {
        txtEvento.innerText = "¡Has derrotado a todo el equipo enemigo! ¡Has ganado el combate!";
        agregarLog("<strong>¡VICTORIA!</strong> Has derrotado a todas las criaturas enemigas.");
    } else {
        txtEvento.innerText = "¡Ya no te quedan criaturas utilizables! Has perdido el combate.";
        agregarLog("<strong>DERROTA.</strong> Todo tu equipo ha sido derrotado.");
    }

    await esperar(4000);
    window.location.href = '../index.html';
}

/* ===== LISTENERS ===== */

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
    txtEvento.innerText = `¿Qué debería hacer ${beastJugador[0].nombre}?`;
});

btnAtk1.addEventListener("click", () => {
    turno({ nombre: "Placaje", esElemental: false });
});

btnAtk2.addEventListener("click", () => {
    turno({ nombre: "Rayo Elemental", esElemental: true });
});

btnCambiar.addEventListener("click", () => {
    mostrarPanelCambio();
});

btnVolver.addEventListener("click", () => {
    regresarMenuCombate();
});

/**
 * Inicia el combate:
 *  1. Registra un nuevo intento en la sesión.
 *  2. Carga los equipos del jugador y del enemigo.
 *  3. Muestra las criaturas iniciales en pantalla.
 */
async function iniciarCombate() {
    const intentoActual = registrarIntentosSesion();
    inicializarLog(intentoActual);
    await elegirEquipos();
    cargarCombate();
}

iniciarCombate();
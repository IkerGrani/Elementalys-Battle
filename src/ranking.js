import { UserDAO } from "./dao/userDAO.js";

/* ===== CONSTANTES GLOBALES ===== */

const RANKING_RESET_FLAG = "elementalys_ranking_reset_flag";
const PLAYER_AVATAR_SRC = "../assets/images/icons/avatar.png" 

/* ===== DATOS JUFADORES RESPALDO ===== */

const PLAYER_DATA = [
    { name: "ShadowIgnis", victories: 52, defeats: 12, datetime: "29/10/2026 16:45" },
    { name: "Valerya_K", victories: 45, defeats: 18, datetime: "29/10/2026 15:10" },
    { name: "BeastMaster99", victories: 39, defeats: 21, datetime: "28/10/2026 22:05" },
    { name: "Kaelen_Storm", victories: 35, defeats: 20, datetime: "28/10/2026 19:30" },
    { name: "EmberValkyrie", victories: 31, defeats: 14, datetime: "28/10/2026 11:15" },
    { name: "NexusGlitch", victories: 28, defeats: 22, datetime: "27/10/2026 20:00" },
    { name: "ChronoBeast", victories: 25, defeats: 25, datetime: "27/10/2026 17:40" },
    { name: "LunarAura", victories: 22, defeats: 19, datetime: "26/10/2026 21:50" },
    { name: "FrostByte_", victories: 20, defeats: 30, datetime: "26/10/2026 14:12" },
    { name: "PyroClast", victories: 18, defeats: 24, datetime: "25/10/2026 18:05" },
    { name: "ViperStrike", victories: 15, defeats: 12, datetime: "25/10/2026 10:20" },
    { name: "IronGolem_9", victories: 12, defeats: 18, datetime: "24/10/2026 19:45" },
    { name: "ZephyrBlade", victories: 10, defeats: 15, datetime: "23/10/2026 16:30" },
    { name: "NovaHunter", victories: 8, defeats: 10, datetime: "22/10/2026 12:00" },
    { name: "RookieBeast", victories: 5, defeats: 20, datetime: "20/10/2026 09:15" }
];

/* ===== UTILIDADES DE FORMATEO ===== */

/**
 * Convierte un Timestamp de firebase a formato: DD/MM/YYYY - HH:mm (04/04/2001 - 12:09)
 * 
 * @param {Object} timestamp Objeto Timestamp de Firebase.
 * @returns {string} Fecha formateada o texto indicando que no tiene partidas.
 */
function formatDate(timestamp) {
    if (!timestamp) return "Sin partidas";

    const date = timestamp.toDate();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

/* ===== SOLICITAR DATOS ===== */

/**
 * Consulta los datos del ranking mediante UserDAO.
 * Si el usuario activo el reset, devuelve lista vacia simulada.
 * 
 * @returns {Promise<Array<Object>>} Colección de todos los jugadores 
 * o array vacio si se dio al boton reset.
 */
async function getRankingData() {
    /**
     * Si el usuario o jugador le dio al boton reset simulamos un estado vacio en el ranking.
     * Lo añadimos al localStorage para que la simulacion de estar vacio se almacene.
     * El jugador volvera a ver puntuacion una vez termine una partida.
     */
    const isReset = localStorage.getItem(RANKING_RESET_FLAG);
    console.log(isReset);
    if (isReset === "true") return [];

    try {
        // Obtenemos todos los usuarios de firebase
        const users = await UserDAO.getAllUsers();

        // Mapeamos el User al formato del ranking
        return users.map((user) => {
            const victories = user.partidasGanadas;
            const played = user.partidasJugadas;
            // Se calcula las derrotas: jugadas - ganadas (min 0)
            const defeats = Math.max(0, played - victories);

            return {
                name: user.usuario,
                victories: victories,
                defeats: defeats,
                datetime: formatDate(user.fechaUltimaPartida)
            };
        });
    } catch (error) {
        console.error("Error al obtener los datos de Firestore en getRankingData:", error);
        return [];
    }
}

/* ===== LÓGICA ===== */

/**
 * Se calcula la puntuación del jugador en base a las victorias y derrotas
 * Formula: (victories * 100) - (defeats * 20), sin numeros negativos.
 * @param {number} victories 
 * @param {number} derrotas 
 * @returns {number} Retorna la puntuacion final.
 */
const calculateScore = (victories, defeats) => Math.max(0, (victories * 100) - (defeats * 20));

/**
 * Partiendo del array de todos los jugadores, creamos un nuevo array añadiendo una nueva propiedad
 * score (puntuacion) para luego poder ordenar de mayor a menor y limitando a solo los 10 mejores
 * jugadores.
 * @param {Array<Object>} playerList 
 * @returns {Array<Object>} Array con solo los top 10 jugadores.
 */
function processTop10Ranking(playerList) {
    /**
     * .map recorre todos los elementos del array y crea uno nuevo 
     * ...player (operador spread), copia todas las propiedades de player
     */     
    const rankedPlayers = playerList.map(player => ({
        ...player,
        score: calculateScore(player.victories, player.defeats)
    }));

    /**
     * Ordenamos por puntuación, en caso de empate por victorias.
     * .sort: compara dos "jugadores" cada vez. 
     * Con player2.score - player1.score ordenamos de mayor a menor.
     * Si hay empate se ordena por victorias, player2.victories - player1.victories.
     */
    rankedPlayers.sort((player1, player2) => {
        if (player2.score !== player1.score) return player2.score - player1.score;
        return player2.victories - player1.victories;
    });

    /**
     * Devolvemos solo los 10 primeros jugadores
     */
    return rankedPlayers.slice(0, 10);
}

/* ===== RENDERIZADO DEL DOM ===== */
/**
 * Funcion para construir la plantilla del HTML, exactamente la fila de la tabla ranking.
 * @param {Object} player 
 * @param {number} rankPosition 
 * @returns {string} Plantilla HTML de una fila del raking.
 */
function createRanking(player, rankPosition) {
    return `
        <tr>
            <td class="col-rank">${rankPosition}</td>
            <td class="col-player">
                <!-- Contender para agrupar al jugador con su avatar y nombre -->
                <div class="player-cell">
                    <img src="${PLAYER_AVATAR_SRC}" alt="Avatar de ${player.name}" class="player-avatar" />
                    <span class="player-name">${player.name}</span>
                </div>
            </td>
            <td class="col-victories">${player.score} pts. (V:${player.victories}, D:${player.defeats})</td>
            <td class="col-date">${player.datetime}</td>
        </tr>
    `;
}

/**
 * Se obtiene los datos del ranking y se renderiza en el DOM
 */
async function loadAndRenderRanking() {
    const tbody = document.querySelector(".ranking-table-body");
    if (!tbody) return;

    // Estado visual temporal mientras resuelve la promesa
    tbody.innerHTML = `
        <tr>
            <td colspan="4" style="text-align: center; padding: 20px; color: var(--texto-header);">
                Cargando clasificación...
            </td>
        </tr>
    `;

    try {
        const data = await getRankingData();
        const top10 = processTop10Ranking(data);

        // Si la tabla esta reseteada o no tiene registros
        if (top10.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 30px; color: var(--texto-footer);">
                        El ranking ha sido reseteado. No hay registros que mostrar.
                    </td>
                </tr>
            `;
            return;
        }
    
        // Creacion en el DOM
        tbody.innerHTML = top10
            .map((player, index) => createRanking(player, index + 1))
            .join("");

    } catch (error) {
        console.error("Error al obtener los datos del ranking:", error);
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 20px; color: #ff2244;">
                    Error al obtener los datos del ranking.
                </td>
            </tr>
        `;
    }
}

/**
 * Se añade el event listener al boton de reset, para poder borrar la clasificación localmente.
 */
function resetButton() {
    const btnReset = document.getElementById("btn-reset-ranking");
    if (!btnReset) return;

    btnReset.addEventListener("click", () => {
        const confirm = window.confirm(
            "¿Deseas reiniciar los datos del ranking?\n\n(Esta acción limpiará los registros de tu vista de clasificación)."
        );

        if (confirm) {
            // Guardamos la bandera en localStorage para respetar el reseteo
            localStorage.setItem(RANKING_RESET_FLAG, "true");
            // Volvemos a invocar la función de renderizado
            loadAndRenderRanking();
        }
    });
}

/* ===== INICIALIZACIÓN ===== */

document.addEventListener("DOMContentLoaded", () => {
    loadAndRenderRanking();
    resetButton();
});
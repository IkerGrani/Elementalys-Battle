/*
<!-- Datos de prueba -->
<tr>
    <td class="col-rank">1</td>
    <td class="col-player">
        <!-- Contender para agrupar al jugador con su avatar y nombre -->
        <div class="player-cell">
            <img src="../assets/images/icons/elementalys-beasts-logo.png" 
                alt="Avatar del jugador" class="player-avatar" />
            <span class="player-name">Nombre</span>
        </div>
    </td>
    <td class="col-victories">50</td>
    <td class="col-date">27/10/2026 17:20</td>
</tr>
<tr>
    <td class="col-rank">2</td>
    <td class="col-player">
        <!-- Contender para agrupar al jugador con su avatar y nombre -->
        <div class="player-cell">
            <img src="../assets/images/icons/elementalys-beasts-logo.png" 
                alt="Avatar del jugador" class="player-avatar" />
            <span class="player-name">Nombre</span>
        </div>
    </td>
    <td class="col-victories">50</td>
    <td class="col-date">27/10/2026 17:20</td>
</tr>
<tr>
    <td class="col-rank">3</td>
    <td class="col-player">
        <!-- Contender para agrupar al jugador con su avatar y nombre -->
        <div class="player-cell">
            <img src="../assets/images/icons/elementalys-beasts-logo.png" 
                alt="Avatar del jugador" class="player-avatar" />
            <span class="player-name">Nombre</span>
        </div>
    </td>
    <td class="col-victories">50</td>
    <td class="col-date">27/10/2026 17:20</td>
</tr>
                        <tr>
    <td class="col-rank">4</td>
    <td class="col-player">
        <!-- Contender para agrupar al jugador con su avatar y nombre -->
        <div class="player-cell">
            <img src="../assets/images/icons/elementalys-beasts-logo.png" 
                alt="Avatar del jugador" class="player-avatar" />
            <span class="player-name">Nombre</span>
        </div>
    </td>
    <td class="col-victories">50</td>
    <td class="col-date">27/10/2026 17:20</td>
</tr>
*/

/* ===== CONSTANTES GLOBALES ===== */
const RANKING_RESET_FLAG = "elementalys_ranking_reset_flag";
const PLAYER_AVATAR_SRC = "../assets/images/icons/elementalys-beasts-logo.png" 

/* ===== DATOS JUFADORES (Ejemplo de JSON/Array) ===== */
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

/* ===== SOLICITAR DATOS ===== */
function getRankingData() {
    /**
     * Si el usuario o jugador le dio al boton reset simulamos un estado vacio en el ranking.
     * Lo añadimos al localStorage para que la simulacion de estar vacio se almacene.
     * El jugador volvera a ver puntuacion una vez termine una partida.
     */
    const isReset = localStorage.getItem(RANKING_RESET_FLAG);
    if (isReset === "true") return [];

    // Simulamos una repusta de una llamada externa
    return new Promise((resolve => {
        setTimeout(() => {
            resolve([...PLAYER_DATA])
        }, 100 );
    }));

}

/* ===== LÓGICA ===== */
const calculateScore = (victories, defeats) => Math.max(0, (victories * 100) - (defeats * 20));

import { UserDAO } from './dao/userDAO.js';

const RANKING_RESET_FLAG = "elementalys_ranking_reset_flag";
const SESSION_ATTEMPTS_KEY = "elementalys_session_attempts";

const btnMenuPlay = document.getElementById("btn-play");

btnMenuPlay.addEventListener("DOMContentLoaded", () => {
  
});

/* ============================================================
 * Elementalys Battle - Gestión de Sesión en Menú Principal
 * ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const playerInfoContainer = document.getElementById("player-info-container");
  const statsOverviewContainer = document.getElementById("stats-overview-container");

  const sesionRaw = sessionStorage.getItem("usuarioSesion");

  if (!sesionRaw) {
    mostrarBotonLogin(playerInfoContainer, statsOverviewContainer);
    return;
  }

  const sesion = JSON.parse(sesionRaw);
  const ahora = new Date().getTime();

  // Comprobar si han pasado los 3 días de expiración
  if (ahora > sesion.expira) {
    sessionStorage.removeItem("usuarioSesion");
    sessionStorage.removeItem(SESSION_ATTEMPTS_KEY);
    localStorage.removeItem(RANKING_RESET_FLAG);
    mostrarBotonLogin(playerInfoContainer, statsOverviewContainer);
    return;
  }

  // Si la sesión es válida, cargamos los datos de Firestore guardados en sessionStorage
  /*
  const nombreUsuario = sesion.Usuario || sesion.email || "Jugador";
  const partidasJugadas = sesion["Partidas Jugadas"] ?? 0;
  const partidasGanadas = sesion["Partidas Ganadas"] ?? 0;
  */
  const nombreUsuario = sesion.Usuario || "Jugador";
  const partidasJugadas = sesion.Partidas_Jugadas;
  const partidasGanadas = sesion.Partidas_Ganadas;

  // Actualizar Nombre de Usuario
  playerInfoContainer.innerHTML = `
    <div class="avatar-slot">
      <img src="../assets/images/icons/avatar.png" alt="Avatar del jugador"/>
    </div>
    <div class="player-details">
      <p class="player-name">${nombreUsuario}</p>
      <button id="btn-perfil" class="btn-logout">Perfil</button>
      <button id="btn-logout" class="btn-logout">Cerrar Sesión</button>
    </div>
  `;

  statsOverviewContainer.innerHTML = `
    <div class="stat-item">
      <span>Partidas Jugadas:</span>
      <span class="stat-value">🎮 ${partidasJugadas}</span>
    </div>
    <div class="stat-item">
      <span>Partidas Ganadas:</span>
      <span class="stat-value">🏆 ${partidasGanadas}</span>
    </div>
  `;

  const btnPerfil = document.getElementById("btn-perfil");
  if (btnPerfil) {
    btnPerfil.addEventListener("click", () => {
      window.location.href = "pages/perfil.html";
    });
  }

  // Botón para cerrar sesión
  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
      await UserDAO.logout();
      sessionStorage.removeItem("usuarioSesion");
      sessionStorage.removeItem(SESSION_ATTEMPTS_KEY);
      localStorage.removeItem(RANKING_RESET_FLAG);
      window.location.reload();
    });
  }
});

function mostrarBotonLogin(infoContainer, statsContainer) {
  infoContainer.innerHTML = `
    <div class="avatar-slot">
    </div>
    <div class="player-details">
      <p class="player-name"><a href="pages/login.html" class="login-link">Iniciar Sesión</a></p>
      <p class="element-affinity">Invitado</p>
    </div>
  `;

  statsContainer.innerHTML = `
    <div class="stat-item stat-item-center">
      <span class="stat-inactive-msg">Inicia sesión para ver tus estadísticas</span>
    </div>
  `;
}

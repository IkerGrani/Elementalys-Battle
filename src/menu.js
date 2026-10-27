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
    mostrarBotonLogin(playerInfoContainer, statsOverviewContainer);
    return;
  }

  // Si la sesión es válida, cargamos los datos de Firestore guardados en sessionStorage
  const nombreUsuario = sesion.Usuario || sesion.email || "Jugador";
  const partidasJugadas = sesion["Partidas Jugadas"] ?? 0;
  const partidasGanadas = sesion["Partidas Ganadas"] ?? 0;

  // Actualizar Nombre de Usuario
  playerInfoContainer.innerHTML = `
    <div class="avatar-slot"></div>
    <div class="player-details">
      <p class="player-name">${nombreUsuario}</p>
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

  // Botón para cerrar sesión
  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      sessionStorage.removeItem("usuarioSesion");
      window.location.reload();
    });
  }
});

function mostrarBotonLogin(infoContainer, statsContainer) {
  infoContainer.innerHTML = `
    <div class="avatar-slot"></div>
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

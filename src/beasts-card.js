/**
 * Importamos las clases necesarias para poder obtener los Beasts de Firebase,
 * asi como de la clase definida para manejar a cada Beast con sus estadisticas.
 */
import { BeastDAO } from './dao/beastDAO.js';

/* ===== DATOS CRIATURAS ===== */
const BEASTS_DATA = []

/**
 * Funcion para obetener todos los beasts de firebase.
 */
async function loadBeastCatalog() {
    const beasts = await BeastDAO.obtenerTodos();
    BEASTS_DATA.push(...beasts);
}




/* ===== FUNCION PARA LA TARJETA DE CADA BEAST ===== */
/**
 * Convierte un objeto beast en una cadena HTML con las clases css 
 * creadas para ello.
 * @param {*} beast - Objeto con las propiedades del beast
 * @returns {string} Codigo HTML con la tarjeta del beast
 */
function createBeastCard(beast) {
    return `
        <!-- Las tarjetas (<article class="beast-card">) se generarán aquí con JS -->
        <article class="beast-card">
            <!-- Cabecera de la tarjeta: Nombre y Atributo -->
            <div class="card-header">
                <h3 class="beast-name">${beast.nombre}</h3>
                <span class="beast-affinity ${beast.tipo.toLowerCase()}">${beast.tipo.toUpperCase()}</span>
            </div>
            <!-- Marco de la imagen de la criatura -->
            <div class="card-image-wrapper">
                <img src="../assets/images/characters/${beast.imagen}" alt="${beast.nombre}" class="beast-image">
            </div>
            <!-- Panel de estadísticas (HP, ATK y DEF) -->
            <div class="card-stats">
                <div class="stat-item">
                    <span class="stat-label">HP</span>
                    <span class="stat-value hp">${beast.vidaInicial}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Ataque</span>
                    <span class="stat-value atk">${beast.ataque}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Defensa</span>
                    <span class="stat-value def">${beast.defensa}</span>
                </div>
            </div>
        </article>
    `;
}

/* ===== RENDERIZADO EN EL DOM ===== */
function renderBeastCatalog(beasts) {
    // Contenedores principales */
    const gridContainer = document.getElementById("beasts-grid");
    const counterElement = document.getElementById("beasts-count");

    // Detenmos la ejecucion si no existe el grid container
    if (!gridContainer) return;

    /**
     * Convertimos cada objeto en su correspondiente tarjeta
     * innerHTML: Sustituye el contenido HTML 
     * Array.map: Recorre el array y crea uno nuevo transformando cada elementoç
     * Arrow function: Manera compacta de definir funciones
     * "Equivalente" a poner:
     * function (beast) {
     *          return createBeastCard(beast);
     * }
     * Array.join: Une todos los elementos de un array y devuelve una cadena de texto 
     */
    gridContainer.innerHTML = beasts.map(beast => createBeastCard(beast)).join("");

    // Actualizamos el contador de numero de beasts
    if (counterElement) counterElement.textContent = beasts.length;
}

// Ejecutamos la funcion cuando documento HTML este cargado
document.addEventListener("DOMContentLoaded", async () => {
    await loadBeastCatalog();
    console.log(BEASTS_DATA);
    renderBeastCatalog(BEASTS_DATA);
});   
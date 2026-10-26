/* ===== DATOS CRIATURAS (Ejemplo de JSON/Array) ===== */
const beastsData = [
    {
        id: 1,
        name: "Beast 1",
        affinity: "agl",
        image: "../assets/images/icons/Elementalys Beasts - Logo.png",
        hp: "1,250",
        atk: 340,
        def: 210
    },
    {
        id: 2,
        name: "Beast 2",
        affinity: "str",
        image: "../assets/images/icons/Elementalys Beasts - Logo.png",
        hp: "1,400",
        atk: 390,
        def: 180
    },
    {
        id: 3,
        name: "Beast 3",
        affinity: "teq",
        image: "../assets/images/icons/Elementalys Beasts - Logo.png",
        hp: "1,100",
        atk: 420,
        def: 160
    },
    {
        id: 4,
        name: "Beast 4",
        affinity: "phy",
        image: "../assets/images/icons/Elementalys Beasts - Logo.png",
        hp: "1,800",
        atk: 280,
        def: 320
    },
    {
        id: 5,
        name: "Beast 5",
        affinity: "int",
        image: "../assets/images/icons/Elementalys Beasts - Logo.png",
        hp: "1,150",
        atk: 360,
        def: 240
    },
    {
        id: 6,
        name: "Beast 6",
        affinity: "agl",
        image: "../assets/images/icons/Elementalys Beasts - Logo.png",
        hp: "1,300",
        atk: 330,
        def: 220
    }
];

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
                <h3 class="beast-name">${beast.name}}</h3>
                <span class="beast-affinity ${beast.affinity}">${beast.affinity.toUpperCase()}</span>
            </div>
            <!-- Marco de la imagen de la criatura -->
            <div class="card-image-wrapper">
                <img src="${beast.image}" alt="${beast.name}" class="beast-image">
            </div>
            <!-- Panel de estadísticas (HP, ATK y DEF) -->
            <div class="card-stats">
                <div class="stat-item">
                    <span class="stat-label">HP</span>
                    <span class="stat-value hp">${beast.hp}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Ataque</span>
                    <span class="stat-value atk">${beast.atk}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Defensa</span>
                    <span class="stat-value def">${beast.def}</span>
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

    /* Convertimos cada objeto en su correspondiente tarjeta 
        innerHTML: Sustituye el contenido HTML 
        Array.map: Recorre el array y crea uno nuevo transformando cada elementoç
        Arrow function: Manera compacta de definir funciones
        "Equivalente" a poner:
        function (beast) {
            return createBeastCard(beast);
        }
        Array.join: Une todos los elementos de un array y devuelve una cadena de texto    */
    gridContainer.innerHTML = beasts.map(beast => createBeastCard(beast)).join("");

    // Actualizamos el contador de numero de beasts
    if (counterElement) counterElement.textContent = beasts.length;
}

// Ejecutamos la funcion cuando documento HTML este cargado
document.addEventListener("DOMContentLoaded", () => renderBeastCatalog(beastsData));
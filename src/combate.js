// combate.js — Lógica de interacción de la pantalla de combate

const btnLuchar = document.getElementById("ataques");
const btnAtk1 = document.getElementById("atk1");
const btnAtk2 = document.getElementById("atk2");
const btnVolver = document.getElementById("volver");
const btnCambiar = document.getElementById("cambiar");
const teamPanel = document.getElementById("team");

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
});

// Al pulsar "Volver" → volvemos al estado inicial (Luchar + Cambiar).
btnVolver.addEventListener("click", () => {
    btnLuchar.hidden = false;
    btnCambiar.hidden = false;
    btnAtk1.hidden = true;
    btnAtk2.hidden = true;
    btnVolver.hidden = true;
});

// Al pulsar "Cambiar" → mostramos el panel del equipo y ocultamos las opciones.
btnCambiar.addEventListener("click", () => {
    ocultarTodo();
    teamPanel.hidden = false;
});
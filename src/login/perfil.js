import { UserDAO } from "../dao/userDAO.js";

const formPerfil = document.getElementById("form-perfil");
const contenedor = formPerfil.parentElement;

const inputUsuario = document.getElementById("usuario-perfil");
const inputEmail = document.getElementById("mail-perfil");
const inputFecha = document.getElementById("fecha-nacimiento-perfil");
const btnVolver = document.getElementById("btn-volver");

/* ===== UTILIDADES DE MENSAJES ===== */

function mostrarMensaje(texto, esError = true) {
    limpiarMensajes();
    const msg = document.createElement("p");
    msg.className = "msg-estado " + (esError ? "msg-error" : "msg-exito");
    msg.textContent = texto;
    contenedor.appendChild(msg);
}

function limpiarMensajes() {
    contenedor.querySelectorAll(".msg-estado").forEach((n) => n.remove());
}

/* ===== CARGA DE DATOS ===== */

// Obtenemos los datos actuales desde sessionStorage
const sesionRaw = sessionStorage.getItem("usuarioSesion");

if (!sesionRaw) {
    // Si no hay sesion iniciada, redirigimos al login
    window.location.href = "login.html";
} else {
    const session = JSON.parse(sesionRaw);

    // Precarga de campos
    inputUsuario.value = session.Usuario;
    inputEmail.value = session.email;

    if (session.Fecha_Nacimiento) {
        inputFecha.value = session.Fecha_Nacimiento;
    }
}

// Boton para volver
if (btnVolver) {
    btnVolver.addEventListener("click", () => {
        window.location.href = "../index.html";
    });
}

/* ===== GUARDAR CAMBIOS ===== */

formPerfil.addEventListener("submit", async (e) => {
    e.preventDefault();
    limpiarMensajes();

    const session = JSON.parse(sessionStorage.getItem("usuarioSesion"));
    const nuevoUsuario = inputUsuario.value.trim();
    const nuevaFecha = inputFecha.value;

    if (!nuevoUsuario) {
        mostrarMensaje("El nombre de usuario no puede estar vacío.", true);
        return;
    }

    try {
        // Actualizamos en firebase mediante el DAO
        await UserDAO.updateProfileData(session.uid, nuevoUsuario, nuevaFecha);

        /**
         * Actualizamos el objeto en sessionStorage para que el menu muestre el 
         * cambio.
         */
        session.Usuario = nuevoUsuario;
        session.Fecha_Nacimiento = nuevaFecha;
        sessionStorage.setItem("usuarioSesion", JSON.stringify(session));

        // Notificamos al usuario y regresamos tras unos segundos
        mostrarMensaje("¡Perfil actualizado con éxito!", false);
        setTimeout(() => {
            window.location.href = "../index.html";
        }, 1200);

    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        mostrarMensaje("Error al actualizar los datos en el servidor.", true);
    }
});
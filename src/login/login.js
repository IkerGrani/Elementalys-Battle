import { UserDAO } from "../dao/userDAO.js";

// Elementos de los formularios tanto de login como de registro
const formLogin = document.getElementById("form-login");
const formRegistro = document.getElementById("form-registro");

// Contenedores para mostrar los mensajes
const contenedorLogin = formLogin.parentElement;
const contenedorRegistro = formRegistro.parentElement;


/* ===== UTILIDADES DE INTERFAZ Y MENSAJES ===== */

/**
 * Muestra un mensaje en el formulario correspondiente.
 * 
 * @param {HTMLElement} container Contenedor donde se escribira el mensaje.
 * @param {string} texto Texto del mensaje.
 * @param {boolean} esError True para color rojo, false para color verde.
 */
function mostrarMensaje(container, texto, esError = true) {
	limpiarMensajes(container);
	const msg = document.createElement("p");
	msg.className = "msg-estado" + (esError ? " msg-error" : " msg-exito");
	msg.textContent = texto;
	container.appendChild(msg);
}

/**
 * Elimina el mensaje previo para no acumularlos.
 * 
 * @param {HTMLElement} container Contenedor para limpiar.
 */
function limpiarMensajes(container = null) {
	const objetivos = container ? [container] : [contenedorLogin, contenedorRegistro];
	for (const c of objetivos) {
		c.querySelectorAll(".msg-estado").forEach((n) => n.remove());
	}
}

/**
 * Comprueba que un campo de texto no esté vacio ni contenga solo espacios en blanco.
 * 
 * @param {string} value 
 * @returns True si tiene texto.
 */
function noVacio(value) {
	return value && value.trim().length > 0;
}

/* ===== INICIO DE SESION ===== */

formLogin.addEventListener("submit", async (e) => {
	e.preventDefault();
	limpiarMensajes(contenedorLogin);

	// Leemos los valores escritos por el usuario
	const email = formLogin.querySelector("#usuario-login").value;
	const password = formLogin.querySelector("#passwd-login").value;

	if (!noVacio(email) || !noVacio(password)) {
		mostrarMensaje(contenedorLogin, "Rellena todos los campos.");
		return;
	}

	try {
		// Llamada al DAO para autenticar con firebase y obtener los datos del usuario
		const user = await UserDAO.login(email, password);

		if (user) {
			// Guardamos el objeto User en sessionStorage
			sessionStorage.setItem("usuarioSesion", JSON.stringify(user.toSessionObject()));
			// Redirigimos al menu principal
			window.location.href = "../index.html";
		} else {
			mostrarMensaje(contenedorLogin, "No se encontraron los datos del usuario.");
		}
	} catch (error) {
		mostrarMensaje(contenedorLogin, traducirErrorFirebase(error.code));
	}
});

/* ===== REGISTRO ===== */

formRegistro.addEventListener("submit", async (e) => {
	e.preventDefault();
	limpiarMensajes(contenedorRegistro);

	// Leemos todos los campos del formulario de registro
	//const nombre = formRegistro.querySelector("#nombre").value;
	const email = formRegistro.querySelector("#mail").value;
	const fechaNacimiento = formRegistro.querySelector("#fecha-nacimiento").value;
	const usuario = formRegistro.querySelector("#usuario-registro").value;
	const password = formRegistro.querySelector("#passwd-registro").value;
	const password2 = formRegistro.querySelector("#passwd2").value;

	if (!noVacio(email) || !noVacio(fechaNacimiento) || !noVacio(usuario) || !noVacio(password) || !noVacio(password2)) {
		mostrarMensaje(contenedorRegistro, "Rellena todos los campos obligatorios.");
		return;
	}

	if (password !== password2) {
		mostrarMensaje(contenedorRegistro, "Las contraseñas no coinciden.");
		return;
	}

	try {
		/**
		 * Registramos al usuario en firebase auth.
		 * Y creamos el documento asociado al usuario creado mediante el DAO
		 */
		const newUser = await UserDAO.register(email, password, usuario, fechaNacimiento);

		// Guardamos la sesión en sessionStorage
    	sessionStorage.setItem("usuarioSesion", JSON.stringify(newUser.toSessionObject()));

		// Redirigimos al menu principal
    	window.location.href = "../index.html";
	} catch (error) {
		mostrarMensaje(contenedorRegistro, traducirErrorFirebase(error.code));
	}
});

/* ===== TRADUCTO DE ERRORES DE FIREBASE AUTH ===== */

/**
 * Traduce los codigos de error de firebase a mensajes	 para el jugador.
 * 
 * @param {string} code Codigo de error devuelto por firebase
 * @returns Mensaje a mostrar.
 */
function traducirErrorFirebase(code) {
  switch (code) {
	case "auth/invalid-email":
		return "El correo electrónico no es válido.";
	case "auth/user-disabled":
		return "Esta cuenta ha sido deshabilitada.";
	case "auth/user-not-found":
	case "auth/wrong-password":
	case "auth/invalid-credential":
		return "Correo o contraseña incorrectos.";
	case "auth/email-already-in-use":
		return "Ese correo electrónico ya está registrado.";
	case "auth/weak-password":
		return "La contraseña debe tener al menos 6 caracteres.";
	case "auth/network-request-failed":
		return "Error de red. Comprueba tu conexión a internet.";
	case "auth/too-many-requests":
		return "Demasiados intentos fallidos. Inténtalo más tarde.";
	default:
		return "Ocurrió un error en la autenticación: " + code;
  }
}

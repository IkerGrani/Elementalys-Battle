import { auth } from "../firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "https://esm.sh/firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  Timestamp
} from "https://esm.sh/firebase/firestore";

const db = getFirestore();

/* ============================================================
 * Elementalys Battle - Autenticación Firebase (Login / Registro)
 * ============================================================ */

const formLogin = document.getElementById("form-login");
const formRegistro = document.getElementById("form-registro");

const contenedorLogin = formLogin.parentElement;
const contenedorRegistro = formRegistro.parentElement;

/* ============================================================
 * Utilidades de Mensajería
 * ============================================================ */

function mostrarMensaje(container, texto, esError = true) {
  limpiarMensajes(container);
  const msg = document.createElement("p");
  msg.className = "msg-estado" + (esError ? " msg-error" : " msg-exito");
  msg.textContent = texto;
  container.appendChild(msg);
}

function limpiarMensajes(container = null) {
  const objetivos = container ? [container] : [contenedorLogin, contenedorRegistro];
  for (const c of objetivos) {
    c.querySelectorAll(".msg-estado").forEach((n) => n.remove());
  }
}

function noVacio(value) {
  return value && value.trim().length > 0;
}

/** Guarda la sesión en sessionStorage con duración de 3 días y los datos de Firestore */
async function guardarSesionUsuario(user) {
  const userDocRef = doc(db, "Usuarios", user.uid);
  const userSnap = await getDoc(userDocRef);

  let userData = {
    Usuario: user.displayName || "Jugador",
    "Partidas Jugadas": 0,
    "Partidas Ganadas": 0
  };

  if (userSnap.exists()) {
    userData = userSnap.data();
  }

  const sesionData = {
    uid: user.uid,
    email: user.email,
    ...userData,
    expira: new Date().getTime() + 3 * 24 * 60 * 60 * 1000 // 3 días
  };

  sessionStorage.setItem("usuarioSesion", JSON.stringify(sesionData));
}

/* ============================================================
 * Lógica de Login
 * ============================================================ */
formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  limpiarMensajes(contenedorLogin);

  const email = formLogin.querySelector("#usuario-login").value;
  const password = formLogin.querySelector("#passwd-login").value;

  if (!noVacio(email) || !noVacio(password)) {
    mostrarMensaje(contenedorLogin, "Rellena todos los campos.");
    return;
  }

  try {
    const credenciales = await signInWithEmailAndPassword(auth, email, password);
    await guardarSesionUsuario(credenciales.user);
    window.location.href = "../index.html";
  } catch (error) {
    mostrarMensaje(contenedorLogin, traducirErrorFirebase(error.code));
  }
});

/* ============================================================
 * Lógica de Registro
 * ============================================================ */
formRegistro.addEventListener("submit", async (e) => {
  e.preventDefault();
  limpiarMensajes(contenedorRegistro);

  const nombre = formRegistro.querySelector("#nombre").value;
  const email = formRegistro.querySelector("#mail").value;
  const fechaNacimientoStr = formRegistro.querySelector("#fecha-nacimiento").value;
  const usuario = formRegistro.querySelector("#usuario-registro").value;
  const password = formRegistro.querySelector("#passwd-registro").value;
  const password2 = formRegistro.querySelector("#passwd2").value;

  if (!noVacio(nombre) || !noVacio(email) || !noVacio(fechaNacimientoStr) || !noVacio(usuario) || !noVacio(password) || !noVacio(password2)) {
    mostrarMensaje(contenedorRegistro, "Rellena todos los campos obligatorios.");
    return;
  }

  if (password !== password2) {
    mostrarMensaje(contenedorRegistro, "Las contraseñas no coinciden.");
    return;
  }

  try {
    // 1. Crear usuario en Firebase Auth
    const credenciales = await createUserWithEmailAndPassword(auth, email, password);
    const user = credenciales.user;

    // 2. Actualizar perfil de Auth (displayName)
    await updateProfile(user, { displayName: usuario });

    // 3. Crear documento del usuario en la colección "Usuarios"
    const fechaNacimientoDate = new Date(fechaNacimientoStr);
    const datosIniciales = {
      Usuario: usuario,
      "Fecha Nacimiento": Timestamp.fromDate(fechaNacimientoDate),
      "Partidas Ganadas": 0,
      "Partidas Jugadas": 0
    };

    await setDoc(doc(db, "Usuarios", user.uid), datosIniciales);

    // 4. Guardar sesión
    await guardarSesionUsuario(user);

    // Redirigir al menú principal
    window.location.href = "../index.html";
  } catch (error) {
    mostrarMensaje(contenedorRegistro, traducirErrorFirebase(error.code));
  }
});

/* ============================================================
 * Traductor de Errores de Firebase Auth
 * ============================================================ */
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

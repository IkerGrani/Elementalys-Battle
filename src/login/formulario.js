const btnLogin = document.getElementById("mostrar-login");
const btnRegistro = document.getElementById("mostrar-registro");

const formsLogin = document.getElementById("form-login");
const formsRegistro = document.getElementById("form-registro");

btnLogin.addEventListener("click", () => {
    formsLogin.hidden = false;
    formsRegistro.hidden = true;

    btnLogin.classList.add("activo");
    btnRegistro.classList.remove("activo");
});

btnRegistro.addEventListener("click", () => {
    formsLogin.hidden = true;
    formsRegistro.hidden = false;

    btnLogin.classList.remove("activo");
    btnRegistro.classList.add("activo");
});
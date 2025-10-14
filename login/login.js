const ver = document.getElementById("verpassword");
ver.addEventListener("change", vercontrasena);

function vercontrasena() {
    if (ver.checked) {
        document.getElementById("inppasword").type = "text";   // corregí el id al que usas en tu HTML
        document.getElementById("inpconfirmar").type = "text";
    } else {
        document.getElementById("inppasword").type = "password";
        document.getElementById("inpconfirmar").type = "password";
    }
}

// Botón Iniciar
const botoningresar = document.getElementById("btniniciar");
botoningresar.addEventListener("click", ingresar);

function ingresar() {
    alert("Está por ingresar");
    window.location.href = "paneldecontrol.html";
}

// Botón Registrarse
const botonregistrar = document.getElementById("btnregistrarse");
botonregistrar.addEventListener("click", verregistrar);

function verregistrar() {
    // mostramos el label de confirmar contraseña (el que estaba oculto por CSS)
    document.querySelector('label[for="telefono"]').style.display = "block";
    // mostramos el input de confirmar
    document.getElementById("inpconfirmar").style.display = "block";
}
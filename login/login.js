// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEJnxjQdGcciBWnIoShjqp6c2nWO_eXNI",
  authDomain: "bncsabores-92cef.firebaseapp.com",
  projectId: "bncsabores-92cef",
  storageBucket: "bncsabores-92cef.firebasestorage.app",
  messagingSenderId: "64991996793",
  appId: "1:64991996793:web:1a1aa7a640fbed0b40dda8",
  measurementId: "G-14S9N39FQN"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Variable para controlar el modo (login o registro)
let modoRegistro = false;

// Obtener elementos
const inputConfirmar = document.getElementById("inpconfirmar");

// Inicialmente, el campo confirmar NO debe ser required en modo login
inputConfirmar.removeAttribute("required");

// Ver/Ocultar contraseña
const ver = document.getElementById("verpassword");
ver.addEventListener("change", vercontrasena);

function vercontrasena() {
    if (ver.checked) {
        document.getElementById("inppasword").type = "text";
        inputConfirmar.type = "text";
    } else {
        document.getElementById("inppasword").type = "password";
        inputConfirmar.type = "password";
    }
}

// Botón Registrarse - Cambia el modo del formulario
const botonregistrar = document.getElementById("btnregistrarse");
botonregistrar.addEventListener("click", verregistrar);

function verregistrar() {
    modoRegistro = true;
    
    // Hacer visible y requerido el campo confirmar
    inputConfirmar.style.display = "block";
    inputConfirmar.setAttribute("required", "");
    document.querySelector('label[for="inpconfirmar"]').style.display = "block";
    
    // Cambiar el texto del botón de iniciar sesión
    document.getElementById("btniniciar").textContent = "Registrar cuenta";
    // Cambiar el título
    document.querySelector("h1").textContent = "Registrarse";
    // Opcional: cambiar el texto del botón registrarse
    botonregistrar.textContent = "Volver a Iniciar Sesión";
    botonregistrar.removeEventListener("click", verregistrar);
    botonregistrar.addEventListener("click", volverLogin);
}

function volverLogin() {
    modoRegistro = false;
    
    // Ocultar y quitar required del campo confirmar
    inputConfirmar.style.display = "none";
    inputConfirmar.removeAttribute("required");
    inputConfirmar.value = ""; // Limpiar el valor
    document.querySelector('label[for="inpconfirmar"]').style.display = "none";
    
    document.getElementById("btniniciar").textContent = "Iniciar sesión";
    document.querySelector("h1").textContent = "Iniciar Sesión";
    botonregistrar.textContent = "Registrarse";
    botonregistrar.removeEventListener("click", volverLogin);
    botonregistrar.addEventListener("click", verregistrar);
}

// Formulario - Maneja tanto login como registro
const formulario = document.getElementById("loginForm");
formulario.addEventListener("submit", manejarFormulario);

async function manejarFormulario(e) {
    e.preventDefault();
    
    const usuario = document.getElementById("inpusuario").value;
    const password = document.getElementById("inppasword").value;
    const confirmar = inputConfirmar.value;
    
    // Validación básica
    if (!usuario || !password) {
        alert("Por favor completa todos los campos");
        return;
    }
    
    // Para Firebase Authentication necesitamos un email
    // Convertimos el usuario en formato email si no lo es
    const email = usuario.includes("@") ? usuario : `${usuario}@bncsabores.com`;
    
    if (modoRegistro) {
        // MODO REGISTRO
        if (password !== confirmar) {
            alert("Las contraseñas no coinciden");
            return;
        }
        
        if (password.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres");
            return;
        }
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            alert("¡Usuario registrado exitosamente!");
            console.log("Usuario creado:", userCredential.user);
            
            // Limpiar formulario
            formulario.reset();
            volverLogin();
            
        } catch (error) {
            console.error("Error al registrar:", error);
            
            if (error.code === "auth/email-already-in-use") {
                alert("Este usuario ya está registrado");
            } else if (error.code === "auth/weak-password") {
                alert("La contraseña es muy débil");
            } else {
                alert("Error al registrar: " + error.message);
            }
        }
        
    } else {
        // MODO INICIO DE SESIÓN
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            alert("¡Has iniciado sesión correctamente!");
            console.log("Usuario logueado:", userCredential.user);
            
            // Redirigir al panel de control
            setTimeout(() => {
                window.location.href = "paneldecontrol.html";
            }, 1000);
            
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            
            if (error.code === "auth/user-not-found") {
                alert("Usuario no encontrado");
            } else if (error.code === "auth/wrong-password") {
                alert("Contraseña incorrecta");
            } else if (error.code === "auth/invalid-credential") {
                alert("Usuario o contraseña incorrectos");
            } else {
                alert("Error al iniciar sesión: " + error.message);
            }
        }
    }
}
// ==========================
// CARGAR CARRITO DESDE localStorage
// ==========================
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Contenedor donde se mostrarán los productos del carrito
const contenedorCarrito = document.getElementById('carrito-contenedor');

// Contador visual del carrito en el header
const contadorCarrito = document.getElementById("contador-carrito");

// Buscar el enlace del carrito en el header e insertar el contador
const enlaceCarrito = document.querySelector('a[href="carrito/carrito.html"]');
enlaceCarrito.appendChild(contadorCarrito);

// Mostrar el número actual de productos en el contador
actualizarContadorCarrito();

// ==========================
// FUNCIÓN PRINCIPAL PARA MOSTRAR EL CARRITO
// ==========================
function mostrarCarrito() {
  contenedorCarrito.innerHTML = "";

  // Si el carrito está vacío
  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = "<p>El carrito está vacío.</p>";
    actualizarContadorCarrito();
    return;
  }

  // Recorrer productos del carrito
  carrito.forEach((item, indice) => {
    const divProducto = document.createElement("div");
    divProducto.className = "carrito-item";

    // Estructura HTML de cada producto en el carrito
    divProducto.innerHTML = `
      <div>
        <strong>${item.nombre}</strong><br>
        <small><strong>Tamaño:</strong> ${item.tamano}</small><br>
        <small><strong>Especificaciones:</strong> ${item.especificaciones || 'Ninguna'}</small>
      </div>
      <div>
        $${item.precio} x 
        <input type="number" value="${item.cantidad}" min="1" onchange="cambiarCantidad(${indice}, this.value)">
      </div>
      <div>
        <strong>Subtotal:</strong> $${item.precio * item.cantidad}
      </div>
      <div>
        <button onclick="eliminarProducto(${indice})">Eliminar</button>
      </div>
    `;

    contenedorCarrito.appendChild(divProducto);
  });

  // Mostrar total
  const total = carrito.reduce((acumulador, item) => acumulador + item.precio * item.cantidad, 0);

  const divTotal = document.createElement("div");
  divTotal.className = "carrito-total";
  divTotal.innerHTML = `<strong>Total:</strong> $${total}`;
  contenedorCarrito.appendChild(divTotal);

  // Botón Finalizar Compra
  const botonFinalizar = document.createElement("button");
  botonFinalizar.className = "btn-finalizar";
  botonFinalizar.textContent = "Finalizar compra";
  botonFinalizar.onclick = () => {
    alert("¡Gracias por tu compra!");
    carrito = [];
    localStorage.removeItem("carrito");
    mostrarCarrito();
  };
  contenedorCarrito.appendChild(botonFinalizar);

  // Botón Vaciar Carrito
  const botonVaciar = document.createElement("button");
  botonVaciar.className = "btn-finalizar";
  botonVaciar.style.backgroundColor = "#dc3545";
  botonVaciar.style.marginTop = "1rem";
  botonVaciar.textContent = "Vaciar carrito";
  botonVaciar.onclick = () => {
    if (confirm("¿Estás seguro de que querés vaciar el carrito?")) {
      carrito = [];
      localStorage.removeItem("carrito");
      mostrarCarrito();
    }
  };
  contenedorCarrito.appendChild(botonVaciar);

  // Actualizar contador en el header
  actualizarContadorCarrito();
}

// ==========================
// ELIMINAR PRODUCTO DEL CARRITO
// ==========================
function eliminarProducto(indice) {
  carrito.splice(indice, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

// ==========================
// CAMBIAR CANTIDAD DE UN PRODUCTO
// ==========================
function cambiarCantidad(indice, nuevaCantidad) {
  carrito[indice].cantidad = parseInt(nuevaCantidad);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

// ==========================
// ACTUALIZAR CONTADOR DEL CARRITO
// ==========================
function actualizarContadorCarrito() {
  let totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  contadorCarrito.textContent = `(${totalProductos})`;
}

// Ejecutar la función para mostrar el carrito al cargar la página
mostrarCarrito();
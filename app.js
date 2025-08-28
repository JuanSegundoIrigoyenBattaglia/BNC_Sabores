// ==========================
// LISTA DE PRODUCTOS
// ==========================
const listaProductos = [
  { id: 1, nombre: "Budín relleno", precio: 25000, imagen: "IMG/producto1.jpg" },
  { id: 2, nombre: "Rogel", precio: 8000, imagen: "IMG/producto2.jpg" },
  { id: 3, nombre: "Pan Dulce", precio: 6000, imagen: "IMG/producto3.jpg" }
];

// ==========================
// CARRITO (cargado desde localStorage o vacío)
// ==========================
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Contenedor donde se mostrarán las tarjetas de productos
const contenedorProductos = document.getElementById('contenedor-productos');

// Contador visual del carrito en el header
const contadorCarrito = document.getElementById("contador-carrito");

// Buscar el enlace del carrito en el header e insertar el contador
const enlaceCarrito = document.querySelector('a[href="carrito/carrito.html"]');
enlaceCarrito.appendChild(contadorCarrito);

// Mostrar el número actual de productos en el contador
actualizarContadorCarrito();

// ==========================
// MOSTRAR PRODUCTOS EN PANTALLA
// ==========================
listaProductos.forEach(producto => {
  const tarjeta = document.createElement('div');
  tarjeta.classList.add('tarjeta');

  // Estructura HTML de la tarjeta
  tarjeta.innerHTML = `
    <div class="tarjeta-inner">
      <!-- Frente de la tarjeta -->
      <div class="tarjeta-frente" style="background-image: url('${producto.imagen}')">
        <div class="divcard">
          <h4>${producto.nombre}</h4>
          <p>$${producto.precio}</p>
          <button class="btn btn-dark" onclick="voltearTarjeta(this)">Ver más</button>
        </div>
      </div>
      
      <!-- Dorso de la tarjeta -->
      <div class="tarjeta-dorso">
        <h4>${producto.nombre}</h4>
        <p>Precio: $${producto.precio}</p>
        
        <!-- Selector de tamaño -->
        <label>Tamaño:
          <select class="select-tamano">
            <option value="Chico">Chico</option>
            <option value="Mediano">Mediano</option>
            <option value="Grande">Grande</option>
          </select>
        </label>
        
        <!-- Cantidad -->
        <label>Cantidad:
          <input type="number" class="input-cantidad" min="1" value="1">
        </label>
        
        <!-- Especificaciones -->
        <label>Especificaciones:
          <textarea class="input-especificaciones" rows="2" placeholder="Ej: sin azúcar, decoración personalizada..."></textarea>
        </label>
        
        <!-- Botones -->
        <button onclick='agregarProductoAlCarrito(${producto.id})' class="botonproducto">Agregar al carrito</button>
        <button onclick="volverTarjeta(this)" class="botonproducto">Volver</button>
      </div>
    </div>
  `;

  // Agregar la tarjeta al contenedor principal
  contenedorProductos.appendChild(tarjeta);
});

// ==========================
// FUNCIONES PARA VOLTEAR TARJETAS
// ==========================
function voltearTarjeta(boton) {
  const tarjeta = boton.closest('.tarjeta');
  tarjeta.classList.add('volteada');
}

function volverTarjeta(boton) {
  const tarjeta = boton.closest('.tarjeta');
  tarjeta.classList.remove('volteada');
}

// ==========================
// AGREGAR PRODUCTO AL CARRITO
// ==========================
function agregarProductoAlCarrito(idProducto) {
  // Obtener la tarjeta correspondiente
  const tarjeta = document.querySelector(`.tarjeta button[onclick='agregarProductoAlCarrito(${idProducto})']`).closest('.tarjeta');
  
  // Leer valores seleccionados
  const tamano = tarjeta.querySelector('.select-tamano').value;
  const cantidad = parseInt(tarjeta.querySelector('.input-cantidad').value);
  const especificaciones = tarjeta.querySelector('.input-especificaciones').value.trim();

  // Buscar el producto original en la lista
  const producto = listaProductos.find(p => p.id === idProducto);

  // Verificar si ya existe en el carrito con el mismo tamaño y especificaciones
  const itemExistente = carrito.find(item => 
    item.id === idProducto && item.tamano === tamano && item.especificaciones === especificaciones
  );

  // Si existe, sumamos cantidad; si no, agregamos uno nuevo
  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      tamano,
      cantidad,
      especificaciones
    });
  }

  // Guardar en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));

  // Actualizar el contador visual
  actualizarContadorCarrito();

  // Aviso al usuario
  alert(`Se agregó ${cantidad} "${producto.nombre}" (${tamano}) al carrito.\nEspecificaciones: ${especificaciones || 'Ninguna'}`);
}

// ==========================
// ACTUALIZAR CONTADOR DEL CARRITO
// ==========================
function actualizarContadorCarrito() {
  let totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  contadorCarrito.textContent = `(${totalProductos})`;
}
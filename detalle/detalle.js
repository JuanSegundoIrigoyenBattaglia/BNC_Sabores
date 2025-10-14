// Recuperar el producto de localStorage
const detalleJSON = localStorage.getItem("detalle");
console.log("JSON recuperado:", detalleJSON);

if (!detalleJSON) {
  document.getElementById("detalle-container").innerHTML = "<p>No se encontró información del producto</p>";
} else {
  const producto = JSON.parse(detalleJSON);
  console.log("Producto parseado:", producto);
  
  // Cargar el carrito actual
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
  document.getElementById("detalle-container").innerHTML = `
    <div class="tarjeta">
      <div class="tarjeta-inner">
        <!-- Frente de la tarjeta -->
        <div class="tarjeta-frente" style="background-image: url('../${producto.imagen}')">
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
          <button onclick="volverInicio()" class="botonproducto">Volver al inicio</button>
        </div>
      </div>
    </div>
  `;
}

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
// VOLVER AL INICIO
// ==========================
function volverInicio() {
  window.location.href = "../index.html";
}

// ==========================
// AGREGAR PRODUCTO AL CARRITO (desde detalle)
// ==========================
function agregarProductoAlCarrito(idProducto) {
  // Obtener el producto del localStorage
  const detalleJSON = localStorage.getItem("detalle");
  const producto = JSON.parse(detalleJSON);
  
  // Obtener la tarjeta
  const tarjeta = document.querySelector('.tarjeta');
  
  // Leer valores seleccionados
  const tamano = tarjeta.querySelector('.select-tamano').value;
  const cantidad = parseInt(tarjeta.querySelector('.input-cantidad').value);
  const especificaciones = tarjeta.querySelector('.input-especificaciones').value.trim();

  // Validar cantidad
  if (cantidad < 1 || isNaN(cantidad)) {
    alert('Por favor ingresa una cantidad válida (mínimo 1)');
    return;
  }

  // Cargar carrito actual
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

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

  // Aviso al usuario
  alert(`Se agregó ${cantidad} "${producto.nombre}" (${tamano}) al carrito.\nEspecificaciones: ${especificaciones || 'Ninguna'}`);
  
  // Opcional: Redirigir al carrito
  // window.location.href = "../carrito/carrito.html";
}
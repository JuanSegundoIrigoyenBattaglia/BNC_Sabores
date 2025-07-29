// Lista de productos
const productos = [
  {
    id: 1,
    nombre: "Budin relleno",
    precio: 25000,
    imagen: "IMG/producto1.jpg"
  },
  {
    id: 2,
    nombre: "Rogel",
    precio: 8000,
    imagen: "IMG/producto2.jpg"
  },
  {
    id: 3,
    nombre: "Pan Dulce",
    precio: 6000,
    imagen: "IMG/producto3.jpg"
  }
];

// Carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Renderizado de productos
const contenedor = document.getElementById('contenedor-productos');

productos.forEach(producto => {
  const tarjeta = document.createElement('div');
  tarjeta.classList.add('tarjeta');

  tarjeta.innerHTML = `
    <div class="tarjeta-inner">
      <div class="tarjeta-frente" style="background-image: url('${producto.imagen}')">
        <div class="divcard">
          <h4>${producto.nombre}</h4>
          <p>$${producto.precio}</p>
          <button class="btn btn-dark" onclick="voltearTarjeta(this)">Ver más</button>
        </div>
      </div>
      <div class="tarjeta-dorso">
        <h4>${producto.nombre}</h4>
        <p>Precio: $${producto.precio}<p>
        <label>Tamaño:
          <select class="select-tamano">
            <option value="Chico">Chico</option>
            <option value="Mediano">Mediano</option>
            <option value="Grande">Grande</option>
          </select>
        </label>
        <label>Cantidad:
          <input type="number" class="input-cantidad" min="1" value="1">
        </label>
        <label>Especificaciones:
          <textarea class="input-especificaciones" rows="2" placeholder="Ej: sin azúcar, decoración personalizada..."></textarea>
        </label>
        <button onclick='agregarAlCarrito(${producto.id})' class="botonproducto">Agregar al carrito</button>
        <button onclick="volverTarjeta(this)" class="botonproducto"">Volver</button>
      </div>
    </div>
  `;

  contenedor.appendChild(tarjeta);
});

// Voltear tarjeta
function voltearTarjeta(boton) {
  const tarjeta = boton.closest('.tarjeta');
  tarjeta.classList.add('volteada');
}

function volverTarjeta(boton) {
  const tarjeta = boton.closest('.tarjeta');
  tarjeta.classList.remove('volteada');
}

// Agregar al carrito
function agregarAlCarrito(idProducto) {
  const tarjeta = document.querySelector(`.tarjeta button[onclick='agregarAlCarrito(${idProducto})']`).closest('.tarjeta');
  const tamano = tarjeta.querySelector('.select-tamano').value;
  const cantidad = parseInt(tarjeta.querySelector('.input-cantidad').value);
  const especificaciones = tarjeta.querySelector('.input-especificaciones').value.trim();

  const producto = productos.find(p => p.id === idProducto);

  const itemEnCarrito = carrito.find(item => item.id === idProducto && item.tamano === tamano && item.especificaciones === especificaciones);

  if (itemEnCarrito) {
    itemEnCarrito.cantidad += cantidad;
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

  localStorage.setItem('carrito', JSON.stringify(carrito));
  alert(`Se agregó ${cantidad} "${producto.nombre}" (${tamano}) al carrito.\nEspecificaciones: ${especificaciones || 'Ninguna'}`);
}
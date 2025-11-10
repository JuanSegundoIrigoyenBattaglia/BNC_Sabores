// ==========================
// ESPERAR A QUE FIREBASE SE CARGUE
// ==========================
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM cargado");
  
  // Verificar que Firebase se cargó
  if (typeof firebase === 'undefined') {
    console.error("Firebase no se cargó correctamente");
    alert("Error: No se pudo cargar Firebase. Verifica tu conexión a internet.");
    return;
  }
  
  console.log("Firebase disponible");
  
  // ==========================
  // CONFIGURACIÓN DE FIREBASE
  // ==========================
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
  try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase inicializado correctamente");
  } catch (error) {
    console.error("Error al inicializar Firebase:", error);
    return;
  }

  const db = firebase.firestore();

  // ==========================
  // VARIABLES GLOBALES
  // ==========================
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  let listaProductos = [];

  const contenedorProductos = document.getElementById('contenedor-productos');
  const contadorCarrito = document.getElementById("contador-carrito");

  actualizarContadorCarrito();

  // ==========================
  // CARGAR PRODUCTOS DESDE FIREBASE
  // ==========================
  function cargarProductosDesdeFirebase() {
    console.log("Intentando cargar productos desde Firebase...");
    
    contenedorProductos.innerHTML = '<p style="text-align: center; padding: 20px;">Cargando productos...</p>';
    
    db.collection('productos').get()
      .then((snapshot) => {
        console.log("Productos obtenidos:", snapshot.size);
        
        listaProductos = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Producto:", data);
          
          listaProductos.push({
            id: data.id,
            nombre: data.nombre,
            precio: data.precio,
            imagen: data.imagen,
            descripcion: data.descripcion || ''
          });
        });
        
        // Ordenar por ID
        listaProductos.sort((a, b) => a.id - b.id);
        
        console.log("Lista de productos final:", listaProductos);
        
        if (listaProductos.length === 0) {
          contenedorProductos.innerHTML = '<p style="text-align: center; padding: 20px;">No hay productos disponibles.</p>';
          return;
        }
        
        contenedorProductos.innerHTML = '';
        mostrarProductos();
      })
      .catch((error) => {
        console.error("Error detallado:", error);
        contenedorProductos.innerHTML = `
          <p style="text-align: center; padding: 20px; color: red;">
            Error al cargar productos: ${error.message}
            <br><br>
            <button onclick="location.reload()">Reintentar</button>
          </p>
        `;
      });
  }

  // ==========================
  // MOSTRAR PRODUCTOS EN PANTALLA
  // ==========================
  function mostrarProductos() {
    listaProductos.forEach(producto => {
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
            <p>Precio: $${producto.precio}</p>
            ${producto.descripcion ? `<p class="descripcion">${producto.descripcion}</p>` : ''}
            
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
            
            <button onclick='agregarProductoAlCarrito(${producto.id})' class="botonproducto">Agregar al carrito</button>
            <button onclick="volverTarjeta(this)" class="botonproducto">Volver</button>
            <button onclick="verDetalle(${producto.id})" class="botonproducto">Ver más</button>
          </div>
        </div>
      `;

      contenedorProductos.appendChild(tarjeta);
    });
  }

  // ==========================
  // FUNCIONES PARA VOLTEAR TARJETAS
  // ==========================
  window.voltearTarjeta = function(boton) {
    const tarjeta = boton.closest('.tarjeta');
    tarjeta.classList.add('volteada');
  }

  window.volverTarjeta = function(boton) {
    const tarjeta = boton.closest('.tarjeta');
    tarjeta.classList.remove('volteada');
  }

  // ==========================
  // PÁGINA DETALLE
  // ==========================
  window.verDetalle = function(idProducto){
    let detalleProducto = listaProductos.find(producto => producto.id === idProducto);
    
    if (!detalleProducto) {
      alert("Producto no encontrado");
      return;
    }
    
    localStorage.setItem("detalle", JSON.stringify(detalleProducto));
    window.location.href = "detalle/detalle.html";
  }

  // ==========================
  // AGREGAR PRODUCTO AL CARRITO
  // ==========================
  window.agregarProductoAlCarrito = function(idProducto) {
    const tarjeta = document.querySelector(`.tarjeta button[onclick='agregarProductoAlCarrito(${idProducto})']`).closest('.tarjeta');
    
    const tamano = tarjeta.querySelector('.select-tamano').value;
    const cantidad = parseInt(tarjeta.querySelector('.input-cantidad').value);
    const especificaciones = tarjeta.querySelector('.input-especificaciones').value.trim();

    if (cantidad < 1 || isNaN(cantidad)) {
      alert('Por favor ingresa una cantidad válida (mínimo 1)');
      return;
    }

    const producto = listaProductos.find(p => p.id === idProducto);

    const itemExistente = carrito.find(item => 
      item.id === idProducto && item.tamano === tamano && item.especificaciones === especificaciones
    );

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

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    alert(`Se agregó ${cantidad} "${producto.nombre}" (${tamano}) al carrito.`);
  }

  // ==========================
  // ACTUALIZAR CONTADOR DEL CARRITO
  // ==========================
  function actualizarContadorCarrito() {
    let totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    if (contadorCarrito) {
      contadorCarrito.textContent = `(${totalProductos})`;
    }
  }

  // ==========================
  // INICIALIZAR
  // ==========================
  cargarProductosDesdeFirebase();
  
}); // FIN DOMContentLoaded
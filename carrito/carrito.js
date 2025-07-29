let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const contenedor = document.getElementById('carrito-contenedor');

function renderCarrito() {
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>El carrito está vacío.</p>";
    return;
  }

  carrito.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "carrito-item";

    div.innerHTML = `
      <div>
        <strong>${item.nombre}</strong><br>
        <small><strong>Tamaño:</strong> ${item.tamano}</small><br>
        <small><strong>Especificaciones:</strong> ${item.especificaciones || 'Ninguna'}</small>
      </div>
      <div>
        $${item.precio} x 
        <input type="number" value="${item.cantidad}" min="1" onchange="actualizarCantidad(${index}, this.value)">
      </div>
      <div>
        <strong>Subtotal:</strong> $${item.precio * item.cantidad}
      </div>
      <div>
        <button onclick="eliminarItem(${index})">Eliminar</button>
      </div>
    `;

    contenedor.appendChild(div);
  });

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const totalDiv = document.createElement("div");
  totalDiv.className = "carrito-total";
  totalDiv.innerHTML = `<strong>Total:</strong> $${total}`;
  contenedor.appendChild(totalDiv);

  const finalizarBtn = document.createElement("button");
  finalizarBtn.className = "btn-finalizar";
  finalizarBtn.textContent = "Finalizar compra";
  finalizarBtn.onclick = () => {
    alert("¡Gracias por tu compra!");
    carrito = [];
    localStorage.removeItem("carrito");
    renderCarrito();
  };
  contenedor.appendChild(finalizarBtn);

  const vaciarBtn = document.createElement("button");
  vaciarBtn.className = "btn-finalizar";
  vaciarBtn.style.backgroundColor = "#dc3545";
  vaciarBtn.style.marginTop = "1rem";
  vaciarBtn.textContent = "Vaciar carrito";
  vaciarBtn.onclick = () => {
    if (confirm("¿Estás seguro de que querés vaciar el carrito?")) {
      carrito = [];
      localStorage.removeItem("carrito");
      renderCarrito();
    }
  };
  contenedor.appendChild(vaciarBtn);
}

function eliminarItem(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
}

function actualizarCantidad(index, nuevaCantidad) {
  carrito[index].cantidad = parseInt(nuevaCantidad);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
}

renderCarrito();
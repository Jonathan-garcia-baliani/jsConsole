// carrito.js

document.addEventListener("DOMContentLoaded", function () {
    const url = 'http://localhost:3000/api/carrito';

    // Ejemplo de obtención de productos del carrito
    fetch(url)
        .then(response => response.json())
        .then(productos => {
            if (productos.length > 0) {
                // Mostrar productos en el carrito
                productos.forEach(producto => {
                    const productoElement = document.createElement('div');
                    productoElement.classList.add('producto-en-carrito');
                    productoElement.innerHTML = `
                        <p>Producto: ${producto.nombre}</p>
                        <p>Opción seleccionada: ${producto.opcion}</p>
                        <p>Precio: $${producto.precio}</p>
                        <button onclick="eliminarProducto('${producto._id}')">Eliminar</button>
                    `;
                    document.getElementById('carrito').appendChild(productoElement);
                });
            } else {
                // Mostrar mensaje si no hay productos en el carrito
                document.getElementById('carrito').innerHTML = "<p>No hay productos en el carrito.</p>";
            }
        })
        .catch(error => {
            console.error('Error al obtener productos del carrito:', error);
        });

    // Función para eliminar producto del carrito
    function eliminarProducto(id) {
        fetch(`${url}/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            // Actualizar la interfaz después de eliminar el producto
            document.getElementById('carrito').innerHTML = "<p>No hay productos en el carrito.</p>"; // O recargar la lista de productos
        })
        .catch(error => {
            console.error('Error al eliminar producto del carrito:', error);
        });
    }

    // Formulario para finalizar compra
    const formPago = document.getElementById("formPago");
    formPago.addEventListener("submit", function (event) {
        event.preventDefault();
        const metodoPago = formPago.metodo.value;
        alert(`Compra realizada con ${metodoPago}. Gracias por su compra.`);
        // Puedes agregar aquí la lógica para limpiar el carrito después de la compra
        window.location.href = "../index.html"; // Redirige al inicio después de la compra
    });
});

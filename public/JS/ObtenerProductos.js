const respuesta = fetch('https://arjsonfb.onrender.com/productos')
.then(respuesta => respuesta.json())
.then(datos => mostrarProductos(datos));

const mostrarProductos = (datos) => {
    let productos = "";
    const contenedor = document.querySelector('#contenedor');
    datos.forEach(dato => {
        productos += `
        <div class="card m-2" style="width: 100%; max-width: 250px;">
              <img src=${dato.imagen} class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">${dato.nombre}</h5>
                <p class="card-text">${dato.descripcion}</p>
                <p class="card-text">$${dato.precio}</p>   
                 <div style="margin-left:20px; justify-content:center;">
                <a href="#" class="btn btn-primary" style:"width: 200px;">Comprar</a>
              </div>
              </div>
        </div>
        `;

    }

    );
    contenedor.innerHTML = productos;
}
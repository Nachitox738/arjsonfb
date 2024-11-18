//modulos
const express = require('express');
const fs = require('fs') //Permite trabajar con archivos (file system) incluida con node, no se instala
const cors = require('cors')
const app = express();
const port = 3000;


//Middleware
app.use(express.json())
app.use(express.static('./public')) //Ejecuta directamente el front al correr el servidor
app.use(cors())


//Función para leer los datos del archivo .json

const leerDatos = () => {
    try {   //intenta convertir cadena, si no funciona nos muestra por consol el error (catch)
        const datos = fs.readFileSync('public/data/datos.json')

        return JSON.parse(datos); // Convierte una cadena JSON en un objeto JavaScript
    } catch (error) {
        console.log(error)
    }
}
//leerDatos()
const escribirDatos = (datos) => {
    try {
        fs.writeFileSync('public/data/datos.json', JSON.stringify(datos)) //writeFile permite escribir datos || JSON.stringify convierte un objeto JS en JSON

    } catch (error) {
        console.log(error)

    }
}



app.get('/productos', (req, res) => {
   const datos= leerDatos();
   res.json(datos.productos);
})

app.get('/productos/:id', (req, res) => {
    const datos = leerDatos();
    const prodEncontrado= datos.productos.find ((p) => p.id == req.params.id)
    if (!prodEncontrado) { // ! (no) o diferente
        return res.status(404).json(`No se encuentra el producto`)
    }
    res.json({
        mensaje: "producto encontrado",
        producto: prodEncontrado
    })
})

app.post('/productos', (req, res) => {
    const datos= leerDatos();
    nuevoProducto = { id: datos.productos.length + 1, ...req.body }     //Genera un ID y agrega una copia de req.body
    datos.productos.push(nuevoProducto)
    escribirDatos(datos);
    res.json({"mensaje":'Nuevo producto agregado',
        producto: nuevoProducto});
    })


app.put('/productos/:id', (req, res) => {
    const id= req.params.id;
    const nuevosDatos= req.body;
    const datos = leerDatos()
    const prodEncontrado=datos.productos.find((p)=>p.id ==req.params.id)
    console.log(prodEncontrado)
    if (!prodEncontrado) {
        return res.status(404).json({mensaje:"No se encontró el producto"})
    }
    datos.productos = datos.productos.map(p => p.id == req.params.id ? { ...p, ...nuevosDatos } : p)
    escribirDatos(datos)
    res.json({mensaje:"Producto Actualizado"})
})

app.delete('/productos/:id', (req, res) => {
    const id=req.params.id;
    const datos= leerDatos()
    const prodEncontrado = datos.productos.find((p) => p.id == req.params.id)
    if (!prodEncontrado) {
        return res.status(404).json(`No se encuentra el producto`)
    }
    datos.productos= datos.productos.filter((p)=>p.id != req.params.id)
    let indice=1
    datos.productos.map((p)=>{
        p.id=indice
        indice++
    })
    escribirDatos(datos)
    res.json({"mensaje":"Producto Eliminado"}) 
})

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`)
});
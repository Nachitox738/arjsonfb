//modulos
const express = require('express');
const db = require('./bd/conexion.js');
const fs = require('fs'); //Permite trabajar con archivos (file system) incluida con node, no se instala
const cors = require('cors');
require('dotenv/config');
const app = express();
const port = process.env.MYSQL_ADDON_PORT || 3000;

//Middleware
app.use(express.json())
app.use(express.static('./public')) //Ejecuta directamente el front al correr el servidor
app.use(cors())

app.get('/productos', (req, res) => {
   const sql = "SELECT * FROM articulos";
   db.query(sql,(err,result)=>{
    if(err){
        console.error("Error de lectura");
        return;
    }
    res.json(result);
   })
})

app.get('/productos/:id', (req, res) => {
    const datos = leerDatos();
    const prodEncontrado = datos.productos.find ((p) => p.id == req.params.id)
    if (!prodEncontrado) { // ! (no) o diferente
        return res.status(404).json(`No se encuentra el producto`)
    }
    res.json({
        mensaje: "Producto encontrado",
        producto: prodEncontrado
    })
})

app.post('/productos', (req, res) => {
    const sql = "INSERT INTO articulos (nombre, descripcion, precio, imagen) VALUES (?,?,?,?)";
    const values = Object.values(req.body);
    db.query(sql,values,(err,result)=>{
        if(err){
            console.error("Error al guardar", err);
            return;
        }
        res.json({mensaje:"Nuevo producto agregado"});
       })
    })


app.put('/productos', (req, res) => {
    const valores = Object.values(req.body);
    const sql = "UPDATE articulos SET nombre=?, descripcion=?, precio=? WHERE id=?";
    db.query(sql,valores,(err,result)=>{
        if(err){
            console.error("Error al modificar: ",err);
            return;
        }
        res.json({mensaje:'Producto actualizado', data:result});
    })
})

app.delete('/productos/:id', (req, res) => {
    const id = req.params.id;
    sql = "DELETE FROM articulos WHERE id=?";
    db.query(sql,[id],(err,result)=>{
        if(err){
            console.error("Error al borrar", err);
            return;
        }
        res.json({mensaje:"Producto borrado"});
       })

})

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`)
});
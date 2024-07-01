const express = require("express");
// libreria para variables de entorno
//const dotenv = require('dotenv');
require('dotenv').config();
// cors
const cors = require('cors');

// acceder a variables de entorno
//console.log(process.env);

// crear el servidor de express
const app = express();

// CORS
app.use( cors() );

// directorio público
app.use( express.static('public') );

// parseo y lectura del body - leer información del body
// {
//     "name" : "jorge",
//     "email": "jrg@gmail.com",
//     "pasword": "123456"
// }

app.use( express.json() );

// ruta generica
/*app.get('/', ( req , res ) => {
    console.log('Se requiere /');
    res.json({
        ok: true,
    });
});*/

// rutas
// auth - crear usuarios, login, renew
app.use('/api/auth', require('./routes/auth') );

// CRUD - peticiones a BBDD
app.use('/api/anuncios', require('./routes/anuncios') );

// escuchar peticiones
app.listen( process.env.PORT , () => {
    console.log( `Servidor escuchando en puerto ${ process.env.PORT }`);
});


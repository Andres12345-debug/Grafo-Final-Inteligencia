const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());
app.use(express.static('public')); // Asegúrate de servir tus archivos estáticos
app.use(express.json());

// Crear el pool de conexiones a la base de datos
const pool = mysql.createPool({
    connectionLimit: 10, // El límite de conexiones que el pool manejará
    host: 'localhost',   // Asumiendo que tu base de datos está en el mismo servidor
    user: 'root',        // Usuario de la base de datos
    password: '',        // Sin contraseña
    database: 'grafos',  // Nombre de tu base de datos
    port: 3306           // Puerto estándar de MySQL, incluir solo si es necesario
});

app.get('/consultaEncuestados', (req, res) => {
    pool.query('SELECT * FROM encuestado', (error, results, fields) => {
        if (error) {
            return res.status(500).send(error);
        }
        console.log(results); // Imprime los resultados en la consola del servidor
        res.json(results);
    });
});



// Servir index.html como la página de entrada
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

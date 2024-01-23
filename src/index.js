import express from "express";
import cors from 'cors';
import morgan from "morgan";
import databeRutas from './routes/database.routes.js';

const app = express();

// Configuración del backend
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '20mb' }));
// Configuracion de los endpoints
app.use(databeRutas);


// Para el manejo de errores 
app.use((err, req, res, next) => {
    return res.json({
        message: err.message
    });
}); 
app.listen(3000, () => {
    console.log('servidor ejecutandose');
});

import pool from "../db.js";

import { config } from 'dotenv';
config();
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.CHATGPT_API_KEY});

export const createUser = async (req, res) => {
    const {nombre, contrasena} = req.body;

    try {
        const result = await pool.query(
            'insert into Usuario(nombre, contrasena) values($1, $2) returning *', 
            [nombre, contrasena]);

        res.send('pruebita');
    } catch (e) {
       res.json({error: e.message});
    }
}

export const crearProyecto = async (req, res) => {
    const {nombre, descripcion} = req.body;
    try {
        const result = await pool.query(
        'INSERT INTO Proyecto(Nombre, Descripcion) VALUES($1, $2) RETURNING *',
        [nombre, descripcion]);
        res.json(result.rows[0]);
    } catch (e) {
        res.status(404).json({mensaje: e});
    }
}

export const getUsuarios = async (req, res) => {
    try {
        const result = await pool.query('select * from Usuario');
        res.json(result.rows);
    } catch (e) {
       res.json({error: e.message});
    }
}

export const getProyectos = async (req, res) => {
    try {
        const result = await pool.query('select * from Proyecto');
        res.json(result.rows);
    } catch (e) {
       res.json({error: e.message});
    }
}


export const getUsuariosById = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query('select * from Usuario where id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).json({mensaje: 'No encontre nada con ese id'});
        }

    } catch (e) {
       res.json({error: e});
    }
}

export const getProyectById = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query(`select id, nombre, descripcion, TO_CHAR(FechaCreacion, 'DD/MM/YYYY HH24:MI') as fechaCrea, TO_CHAR(fechamodificacion, 'DD/MM/YYYY HH24:MI') as fechaModi, imagen, diagrama
        from proyecto where id = $1;
        `, [id]);
        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).json({mensaje: 'No encontre nada con ese id'});
        }

    } catch (e) {
       res.json({error: e});
    }
}

export const deleteProyecto = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query('delete from Proyecto where id = $1 returning *', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).json({mensaje: 'No encontre nada con ese id'});
        }
        
    } catch (e) {
        res.json({error: e.message});
    }
}


export const updateUser = async (req, res, next) => {
    const {id} = req.params;
    const {nombre, contrasena} = req.body;
    try {
        const result = await pool.query(
            'update Usuario set nombre = $1, contrasena = $2 where id = $3 returning *', 
            [nombre, contrasena, id]);
        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).json({mensaje: 'No encontre nada con ese id'});
        }

    } catch (e) {
       next(e);
    }
}

export const updateNameDescProyect = async (req, res, next) => {
    const {id} = req.params;
    const {
        nombre,
        descripcion,
    } = req.body;
    try {
        const result = await pool.query(
            `update Proyecto set nombre = $1, descripcion = $2 where id = $3 returning *`, 
            [nombre, descripcion, id]);
        // const result = await pool.query(
        //     `select TO_CHAR(fechamodificacion, 'DD/MM/YYYY HH24:MI') from Proyecto`);
        // const result = await pool.query(
        //     `SELECT CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE '-04:00'`);
        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).json({mensaje: 'No encontre nada con ese id'});
        }

    } catch (e) {
       next(e);
    }
}

export const updateDiagram = async (req, res, next) => {
    const {id} = req.params;
    const { diagrama } = req.body;
    try {
        const result = await pool.query(
            `update Proyecto set diagrama = $1 where id = $2 returning *`, 
            [diagrama, id]);
        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).json({mensaje: 'No encontre nada con ese id'});
        }

    } catch (e) {
       next(e);
    }
}

export const updateImageProyect = async (req, res) => {
    const { id } = req.params;
    const imagen = req.file.buffer; 

    console.log(req.file);

    try {
        const result = await pool.query(
            `update Proyecto set imagen = $1 where id = $2 returning *`, 
            [imagen, id]); 
        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).json({mensaje: 'No encontre nada con ese id'});
        }
    } catch (error) {
        console.error('Error al actualizar la imagen:', error);
        res.status(500).send('Error interno del servidor');
    }
};




// LOS METODOS DE IA
export const diagramToJSON = async (req, res, next) => {
    const {
        diagrama,
    } = req.body;
    try {

        const completion = await openai.chat.completions.create({
            messages: [{"role": "system", "content": "Eres un experto en formatos json, mermaidjs y eres muy silencioso"},
                {"role": "user", "content": "Convierte el siguiente diagrama de secuencia escrito en formato MermaidJS a un JSON y solo dame el código, no digas nada más: "},
                {"role": "assistant", "content": diagrama}],
            model: "gpt-3.5-turbo",
          });
          res.json({content: completion.choices[0].message.content});
        
    } catch (e) {
       next(e);
    }
}

export const diagramToXML = async (req, res, next) => {
    const {
        diagrama,
    } = req.body;
    try {
        const completion = await openai.chat.completions.create({
            messages: [{"role": "system", "content": "Eres un experto en formatos XML, mermaidjs y eres muy silencioso"},
                {"role": "user", "content": "Convierte el siguiente diagrama de secuencia escrito en formato MermaidJS a un XML y solo dame el código, no digas nada más: "},
                {"role": "assistant", "content": diagrama}],
            model: "gpt-3.5-turbo",
          });
          res.json({content: completion.choices[0].message.content});
        
    } catch (e) {
       next(e);
    }
}


export const diagramToJava = async (req, res, next) => {
    const {
        diagrama,
    } = req.body;
    try {
        const completion = await openai.chat.completions.create({
            messages: [{"role": "system", "content": "Eres un experto en formatos JAVA, mermaidjs y eres muy silencioso"},
                {"role": "user", "content": "Representa (no de manera gráfica, sino  creando clases y objetos) el siguiente diagrama de secuencia escrito en formato MermaisJS en java, usando una estructura basica, no hace falta que sea exacto: "},
                {"role": "assistant", "content": diagrama},
                {"role": "assistant", "content": "Dame la respuesta asi: este codigo no representa el diagrama de secuencia solo es una ayuda para ver como representaria usando una notación báse. <codigo que responderas"}],
            model: "gpt-3.5-turbo",
          });
          res.json({content: completion.choices[0].message.content});
        
    } catch (e) {
       next(e);
    }
}

export const diagramToPython = async (req, res, next) => {
    const {
        diagrama,
    } = req.body;
    try {
        const completion = await openai.chat.completions.create({
            messages: [{"role": "system", "content": "Eres un experto en formatos PYTHON, mermaidjs y eres muy silencioso"},
                {"role": "user", "content": "Representa (no de manera gráfica, sino  creando clases de python) el siguiente diagrama de secuencia escrito en formato MermaisJS en python, usando una estructura basica, no hace falta que sea exacto: "},
                {"role": "assistant", "content": diagrama},
                {"role": "assistant", "content": "Dame la respuesta asi: este codigo no representa el diagrama de secuencia solo es una ayuda para ver como representaria usando una notación báse. <codigo que responderas>"}],
            model: "gpt-3.5-turbo",
          });
          res.json({content: completion.choices[0].message.content});
        
    } catch (e) {
       next(e);
    }
}

export const diagramToJavascript= async (req, res, next) => {
    const {
        diagrama,
    } = req.body;
    try {
        const completion = await openai.chat.completions.create({
            messages: [{"role": "system", "content": "Eres un experto en formatos JAVASCRIPT, mermaidjs y eres muy silencioso"},
                {"role": "user", "content": "Representa (no de manera gráfica, sino  creando clases de javascript) el siguiente diagrama de secuencia escrito en formato MermaisJS en javascript, usando una estructura basica, no hace falta que sea exacto: "},
                {"role": "assistant", "content": diagrama},
                {"role": "assistant", "content": "Dame la respuesta asi: este codigo no representa el diagrama de secuencia solo es una ayuda para ver como representaria usando una notación báse. <codigo que responderas>"}],
            model: "gpt-3.5-turbo",
          });
          res.json({content: completion.choices[0].message.content});
        
    } catch (e) {
       next(e);
    }
}
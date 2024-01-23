import { Router } from "express";
import {
  createUser,
  getUsuarios,
  getUsuariosById,
  deleteProyecto,
  updateUser,
  crearProyecto,
  getProyectos,
  updateNameDescProyect,
  getProyectById,
  updateImageProyect,
  updateDiagram,
  diagramToJSON,
  diagramToXML,
  diagramToJava,
  diagramToJavascript,
  diagramToPython
  
} from "../controllers/database.controller.js";

import multer from 'multer';



const router = Router();

const upload = multer();

/* RUTAS PARA LOS USUARIOS */

router.post("/crear-usuario", createUser);

router.get("/obtener-usuarios", getUsuarios);

router.get("/obtener-usuario/:id", getUsuariosById);

router.put('/actualizar-usuario/:id', updateUser);


/* RUTAS PARA LOS PROYECTOS */
 
router.post('/crear-proyecto', crearProyecto);

router.get('/obtener-proyectos', getProyectos);

router.get('/obtener-proyecto/:id', getProyectById);

router.delete("/eliminar-proyecto/:id", deleteProyecto);

router.put('/actualizar-nombre-descripcion-proyecto/:id', updateNameDescProyect);

router.put('/actualizar-imagen-proyecto/:id', upload.single('imagen'), updateImageProyect);

router.put('/actualizar-diagrama/:id', updateDiagram);


/* IA */

router.post('/diagrama-to-json', diagramToJSON);
router.post('/diagrama-to-xml', diagramToXML);
router.post('/diagrama-to-java', diagramToJava);
router.post('/diagrama-to-python', diagramToPython);
router.post('/diagrama-to-javascript', diagramToJavascript);

export default router;

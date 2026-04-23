// src/routes/motoristasRoutes.js
import express from "express";

// Database
import { database } from "../database/databaseInstance.js";

// Repositories
import { MotoristasRepository } from "../repositories/inMemory/MotoristasRepository.js";
import { EntregasRepository } from "../repositories/inMemory/EntregasRepository.js";

// Services
import { MotoristasService } from "../services/MotoristasService.js";
import { EntregasService } from "../services/EntregasService.js";

// Controllers
import { MotoristasController } from "../controllers/MotoristasController.js";

const router = express.Router();

/* COMPOSIÇÃO */


const motoristasRepository = new MotoristasRepository(database);
const entregasRepository = new EntregasRepository(database);

const motoristasService = new MotoristasService(motoristasRepository);

const entregasService = new EntregasService(
  entregasRepository,
  motoristasRepository
);

const controller = new MotoristasController(
  motoristasService,
  entregasService
);

/*ROTAS*/

router.post("/motoristas", controller.criar);

router.get("/motoristas", controller.listar);

router.get("/motoristas/:id", controller.buscar);

// 🔥 MAIS IMPORTANTE
router.get(
  "/motoristas/:id/entregas",
  controller.listarEntregas
);

export { router as motoristasRoutes };
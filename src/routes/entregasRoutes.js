// src/routes/entregasRoutes.js
import express from "express";
import { Database } from "../database/database.js";
import { EntregasRepository } from "../repositories/EntregasRepository.js";
import { EntregasService } from "../services/EntregasService.js";
import { EntregasController } from "../controllers/EntregasController.js";

const router = express.Router();

// Injeção de dependência
const database = new Database();
const repository = new EntregasRepository(database);
const service = new EntregasService(repository);
const controller = new EntregasController(service);

// Rotas
router.post("/entregas", controller.criar);
router.get("/entregas", controller.listar);
router.get("/entregas/:id", controller.buscar);
router.patch("/entregas/:id/avancar", controller.avancar);
router.patch("/entregas/:id/cancelar", controller.cancelar);
router.get("/entregas/:id/historico", controller.historico);

export default router;
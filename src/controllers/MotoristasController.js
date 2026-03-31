// src/controllers/MotoristasController.js
export class MotoristasController {
  constructor(service, entregasService) {
    this.service = service;
    this.entregasService = entregasService; // 👈 para buscar entregas do motorista
  }

  // POST /api/motoristas
  criar = (req, res) => {
    try {
      const motorista = this.service.criar(req.body);
      res.status(201).json(motorista);
    } catch (e) {
      res.status(e.status || 500).json({ erro: e.message });
    }
  };

  // GET /api/motoristas
  listar = (req, res) => {
    try {
      const motoristas = this.service.listar();
      res.json(motoristas);
    } catch (e) {
      res.status(500).json({ erro: e.message });
    }
  };

  // GET /api/motoristas/:id
  buscar = (req, res) => {
    try {
      const motorista = this.service.buscarPorId(req.params.id);
      res.json(motorista);
    } catch (e) {
      res.status(e.status || 404).json({ erro: e.message });
    }
  };

  // GET /api/motoristas/:id/entregas
  listarEntregas = (req, res) => {
    try {
      const { status } = req.query;

      const entregas = this.entregasService.listarPorMotorista(
        req.params.id,
        status
      );

      res.json(entregas);
    } catch (e) {
      res.status(500).json({ erro: e.message });
    }
  };
}
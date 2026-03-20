// src/controllers/EntregasController.js
export class EntregasController {
  constructor(service) {
    this.service = service;
  }

  criar = (req, res) => {
    try {
      const entrega = this.service.criarEntrega(req.body);
      res.status(201).json(entrega);
    } catch (e) {
      res.status(400).json({ erro: e.message });
    }
  };

  listar = (req, res) => {
    const { status } = req.query;
    const entregas = this.service.listar(status);
    res.json(entregas);
  };

  buscar = (req, res) => {
    try {
      const entrega = this.service.buscarPorId(Number(req.params.id));
      res.json(entrega);
    } catch (e) {
      res.status(404).json({ erro: e.message });
    }
  };

  avancar = (req, res) => {
    try {
      const entrega = this.service.avancarStatus(Number(req.params.id));
      res.json(entrega);
    } catch (e) {
      res.status(400).json({ erro: e.message });
    }
  };

  cancelar = (req, res) => {
    try {
      const entrega = this.service.cancelar(Number(req.params.id));
      res.json(entrega);
    } catch (e) {
      res.status(400).json({ erro: e.message });
    }
  };

  historico = (req, res) => {
    try {
      const historico = this.service.historico(Number(req.params.id));
      res.json(historico);
    } catch (e) {
      res.status(404).json({ erro: e.message });
    }
  };
}
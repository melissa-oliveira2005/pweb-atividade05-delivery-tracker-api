export class EntregasController {
  constructor(service) {
    this.service = service;
  }

  criar = (req, res) => {
    try {
      const entrega = this.service.criarEntrega(req.body);
      res.status(201).json(entrega);
    } catch (e) {
      res.status(e.status || 500).json({ erro: e.message });
    }
  };

  listar = (req, res) => {
    const { status, motoristaId } = req.query;
    const entregas = this.service.listar(status, motoristaId);
    res.json(entregas);
  };

  buscar = (req, res) => {
    try {
      const entrega = this.service.buscarPorId(req.params.id);
      res.json(entrega);
    } catch (e) {
      res.status(e.status || 404).json({ erro: e.message });
    }
  };

  avancar = (req, res) => {
    try {
      const entrega = this.service.avancarStatus(req.params.id);
      res.json(entrega);
    } catch (e) {
      res.status(e.status || 400).json({ erro: e.message });
    }
  };

  cancelar = (req, res) => {
    try {
      const entrega = this.service.cancelar(req.params.id);
      res.json(entrega);
    } catch (e) {
      res.status(e.status || 400).json({ erro: e.message });
    }
  };

  historico = (req, res) => {
    try {
      const historico = this.service.historico(req.params.id);
      res.json(historico);
    } catch (e) {
      res.status(e.status || 404).json({ erro: e.message });
    }
  };

  // 🚀 NOVO MÉTODO
  atribuirMotorista = (req, res) => {
    try {
      const { motoristaId } = req.body;

      const entrega = this.service.atribuirMotorista(
        req.params.id,
        motoristaId
      );

      res.json(entrega);
    } catch (e) {
      res.status(e.status || 400).json({ erro: e.message });
    }
  };
}
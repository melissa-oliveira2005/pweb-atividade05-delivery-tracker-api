export class EntregasService {
  constructor(entregasRepository, motoristasRepository) {
    this.entregasRepository = entregasRepository;
    this.motoristasRepository = motoristasRepository;
  }

  criarEntrega({ descricao, origem, destino }) {
    if (origem === destino) {
      throw new Error("Origem e destino não podem ser iguais");
    }

    const entregas = this.entregasRepository.listarTodos();

    const duplicada = entregas.find(e =>
      e.descricao === descricao &&
      e.origem === origem &&
      e.destino === destino &&
      !["ENTREGUE", "CANCELADA"].includes(e.status)
    );

    if (duplicada) {
      throw new Error("Já existe uma entrega em aberto com esses dados");
    }

    const novaEntrega = {
      descricao,
      origem,
      destino,
      status: "CRIADA",
      motoristaId: null, // 👈 NOVO CAMPO
      historico: [
        {
          data: new Date().toISOString(),
          descricao: "Entrega criada"
        }
      ]
    };

    return this.entregasRepository.criar(novaEntrega);
  }

  listar(status, motoristaId) {
    let entregas = this.entregasRepository.listarTodos();

    if (status) {
      entregas = entregas.filter(e => e.status === status);
    }

    if (motoristaId) {
      entregas = entregas.filter(e => e.motoristaId === motoristaId);
    }

    return entregas;
  }

  buscarPorId(id) {
    const entrega = this.entregasRepository.buscarPorId(id);

    if (!entrega) {
      throw new Error("Entrega não encontrada");
    }

    return entrega;
  }

  // 🚀 NOVO MÉTODO (RF-02)
  atribuirMotorista(entregaId, motoristaId) {
    const entrega = this.buscarPorId(entregaId);

    // Regra: só pode atribuir se estiver CRIADA
    if (entrega.status !== "CRIADA") {
      const erro = new Error("Só é possível atribuir motorista a entregas CRIADAS");
      erro.status = 422;
      throw erro;
    }

    const motorista = this.motoristasRepository.buscarPorId(motoristaId);

    if (!motorista) {
      throw new Error("Motorista não encontrado");
    }

    // Regra: motorista precisa estar ATIVO
    if (motorista.status === "INATIVO") {
      const erro = new Error("Motorista está inativo");
      erro.status = 422;
      throw erro;
    }

    // Histórico (substituição também entra aqui)
    this._addHistorico(
      entrega,
      `Motorista ${motoristaId} atribuído à entrega`
    );

    entrega.motoristaId = motoristaId;

    return this.entregasRepository.atualizar(entregaId, entrega);
  }

  avancarStatus(id) {
    const entrega = this.buscarPorId(id);

    if (["ENTREGUE", "CANCELADA"].includes(entrega.status)) {
      throw new Error("Não é possível avançar o status dessa entrega");
    }

    const transicoes = {
      CRIADA: "EM_TRANSITO",
      EM_TRANSITO: "ENTREGUE"
    };

    const proximoStatus = transicoes[entrega.status];

    if (!proximoStatus) {
      throw new Error("Transição de status inválida");
    }

    if (proximoStatus === "ENTREGUE") {
      const passouPorTransito = entrega.historico.some(h =>
        h.descricao.includes("EM_TRANSITO")
      );

      if (!passouPorTransito) {
        throw new Error("Entrega deve passar por EM_TRANSITO antes de ser ENTREGUE");
      }
    }

    entrega.status = proximoStatus;

    this._addHistorico(
      entrega,
      `Status alterado para ${proximoStatus}`
    );

    return this.entregasRepository.atualizar(id, entrega);
  }

  cancelar(id) {
    const entrega = this.buscarPorId(id);

    if (["ENTREGUE", "CANCELADA"].includes(entrega.status)) {
      throw new Error("Não é possível cancelar essa entrega");
    }

    entrega.status = "CANCELADA";

    this._addHistorico(entrega, "Entrega cancelada");

    return this.entregasRepository.atualizar(id, entrega);
  }

  historico(id) {
    const entrega = this.buscarPorId(id);
    return entrega.historico;
  }

  // 🚀 NOVO (RF-03)
  listarPorMotorista(motoristaId, status) {
    const motorista = this.motoristasRepository.buscarPorId(motoristaId);
    if (!motorista) throw new Error("Motorista não encontrado");

    let entregas = this.entregasRepository.listarTodos().filter(e => e.motoristaId === motoristaId);
    if (status) {
      entregas = entregas.filter(e => e.status === status);
    };

    return this.entregasRepository
    .listar()
    .filter(e => e.motoristaId === motoristaId);
  }

  _addHistorico(entrega, descricao) {
    entrega.historico.push({
      data: new Date().toISOString(),
      descricao
    });
  }
}
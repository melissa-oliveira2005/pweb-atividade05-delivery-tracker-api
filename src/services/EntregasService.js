// src/services/EntregasService.js

export class EntregasService {
  constructor(repository) {
    this.repository = repository;
  }

  criarEntrega({ descricao, origem, destino }) {
    // Regra: origem != destino
    if (origem === destino) {
      throw new Error("Origem e destino não podem ser iguais");
    }

    const entregas = this.repository.listarTodos();

    // Regra: evitar duplicidade ativa
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
      historico: [
        {
          data: new Date().toISOString(),
          descricao: "Entrega criada"
        }
      ]
    };

    return this.repository.criar(novaEntrega);
  }

  listar(status) {
    const entregas = this.repository.listarTodos();

    if (status) {
      return entregas.filter(e => e.status === status);
    }

    return entregas;
  }

  buscarPorId(id) {
    const entrega = this.repository.buscarPorId(id);

    if (!entrega) {
      throw new Error("Entrega não encontrada");
    }

    return entrega;
  }

  avancarStatus(id) {
    const entrega = this.buscarPorId(id);

    // Regra: não pode avançar se já finalizada ou cancelada
    if (["ENTREGUE", "CANCELADA"].includes(entrega.status)) {
      throw new Error("Não é possível avançar o status dessa entrega");
    }

    // Definição explícita de transições válidas
    const transicoes = {
      CRIADA: "EM_TRANSITO",
      EM_TRANSITO: "ENTREGUE"
    };

    const proximoStatus = transicoes[entrega.status];

    if (!proximoStatus) {
      throw new Error("Transição de status inválida");
    }

    // Regra: não pode ir direto para ENTREGUE sem passar por EM_TRANSITO
    if (proximoStatus === "ENTREGUE") {
      const passouPorTransito = entrega.historico.some(h =>
        h.descricao.includes("EM_TRANSITO")
      );

      if (!passouPorTransito) {
        throw new Error("Entrega deve passar por EM_TRANSITO antes de ser ENTREGUE");
      }
    }

    // Atualiza status
    entrega.status = proximoStatus;

    // Histórico
    this._addHistorico(
      entrega,
      `Status alterado para ${proximoStatus}`
    );

    return this.repository.atualizar(id, entrega);
  }

  cancelar(id) {
    const entrega = this.buscarPorId(id);

    // Regra: não pode cancelar se já ENTREGUE ou CANCELADA
    if (["ENTREGUE", "CANCELADA"].includes(entrega.status)) {
      throw new Error("Não é possível cancelar essa entrega");
    }

    entrega.status = "CANCELADA";

    this._addHistorico(entrega, "Entrega cancelada");

    return this.repository.atualizar(id, entrega);
  }

  historico(id) {
    const entrega = this.buscarPorId(id);
    return entrega.historico;
  }

  _addHistorico(entrega, descricao) {
    entrega.historico.push({
      data: new Date().toISOString(),
      descricao
    });
  }
}
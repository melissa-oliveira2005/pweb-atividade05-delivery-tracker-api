export class EntregasRepository {
  constructor(database) {
    this.database = database;
  }

  listarTodos() {
    return this.database.getEntregas();
  }

  buscarPorId(id) {
    return this.database.getEntregas().find(e => e.id === id) || null;
  }

  criar(dados) {
    const nova = {
      id: this.database.generateId(),
      motoristaId: null,
      ...dados
    };

    this.database.getEntregas().push(nova);
    return nova;
  }

  atualizar(id, dados) {
    const entrega = this.buscarPorId(id);
    if (!entrega) return null;

    Object.assign(entrega, dados);
    return entrega;
  }
}
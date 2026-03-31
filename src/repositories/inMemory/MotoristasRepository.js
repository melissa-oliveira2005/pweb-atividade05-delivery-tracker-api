export class MotoristasRepository {
  constructor(database) {
    this.database = database;
    this.collection = "motoristas";
  }

  listarTodos() {
    return this.database[this.collection] || [];
  }

  buscarPorId(id) {
    return this.listarTodos().find(m => m.id == id) || null;
  }

  buscarPorCPF(cpf) {
    return this.listarTodos().find(m => m.cpf === cpf) || null;
  }

  criar(dados) {
    const lista = this.listarTodos();

    const novo = {
      id: Date.now().toString(),
      ...dados
    };

    lista.push(novo);
    this.database[this.collection] = lista;

    return novo;
  }

  atualizar(id, dados) {
    const lista = this.listarTodos();

    const index = lista.findIndex(m => m.id == id);

    if (index === -1) return null;

    lista[index] = { ...lista[index], ...dados };

    this.database[this.collection] = lista;

    return lista[index];
  }
}
export class MotoristasService {
  constructor(motoristasRepository) {
    this.motoristasRepository = motoristasRepository;
  }

  criar({ nome, cpf, placaVeiculo }) {
    const existente = this.motoristasRepository.buscarPorCPF(cpf);

    if (existente) {
      const erro = new Error("CPF já cadastrado");
      erro.status = 409;
      throw erro;
    }

    const motorista = {
      nome,
      cpf,
      placaVeiculo,
      status: "ATIVO"
    };

    return this.motoristasRepository.criar(motorista);
  }

  listar() {
    return this.motoristasRepository.listarTodos();
  }

  buscarPorId(id) {
    const motorista = this.motoristasRepository.buscarPorId(id);

    if (!motorista) {
      throw new Error("Motorista não encontrado");
    }

    return motorista;
  }
}
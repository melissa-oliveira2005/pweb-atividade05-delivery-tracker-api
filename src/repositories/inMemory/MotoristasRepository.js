import { pool } from "../database/pg.js";

export class MotoristasRepository {

  async listarTodos() {
    const result = await pool.query("SELECT * FROM motoristas");
    return result.rows;
  }

  async buscarPorId(id) {
    const result = await pool.query(
      "SELECT * FROM motoristas WHERE id = $1",
      [id]
    );

    return result.rows[0] || null;
  }

  async buscarPorCPF(cpf) {
    const result = await pool.query(
      "SELECT * FROM motoristas WHERE cpf = $1",
      [cpf]
    );

    return result.rows[0] || null;
  }

  async criar({ nome, cpf }) {
    try {
      const result = await pool.query(
        "INSERT INTO motoristas (nome, cpf) VALUES ($1, $2) RETURNING *",
        [nome, cpf]
      );

      return result.rows[0];
    } catch (e) {
      if (e.code === "23505") {
        throw new Error("CPF já cadastrado");
      }
      throw e;
    }
  }

  async atualizar(id, { nome, cpf }) {
    const motorista = await this.buscarPorId(id);
    if (!motorista) return null;

    try {
      const result = await pool.query(
        `UPDATE motoristas
         SET nome = $1, cpf = $2
         WHERE id = $3
         RETURNING *`,
        [nome, cpf, id]
      );

      return result.rows[0];
    } catch (e) {
      if (e.code === "23505") {
        throw new Error("CPF já cadastrado");
      }
      throw e;
    }
  }
}
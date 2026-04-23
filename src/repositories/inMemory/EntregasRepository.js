import { pool } from "../database/pg.js";

export class EntregasRepository {

  async listarTodos() {
    const result = await pool.query("SELECT * FROM entregas");
    return result.rows;
  }

  async buscarPorId(id) {
    const result = await pool.query(
      "SELECT * FROM entregas WHERE id = $1",
      [id]
    );

    return result.rows[0] || null;
  }

  async criar(dados) {
    const { descricao, origem, destino } = dados;

    const result = await pool.query(
      `INSERT INTO entregas (descricao, origem, destino, status, motorista_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [descricao, origem, destino, "CRIADA", null] // ✅ corrigido
    );

    return result.rows[0];
  }

  async atualizar(id, dados) {
    const entrega = await this.buscarPorId(id);
    if (!entrega) return null;

    const { descricao, origem, destino, status, motoristaId } = dados;

    const result = await pool.query(
      `UPDATE entregas 
       SET descricao = $1,
           origem = $2,
           destino = $3,
           status = $4,
           motorista_id = $5
       WHERE id = $6
       RETURNING *`,
      [descricao, origem, destino, status, motoristaId, id]
    );

    return result.rows[0];
  }

  async entregasPorStatus() {
    const result = await pool.query(`
      SELECT status, COUNT(*) as total
      FROM entregas
      GROUP BY status
    `);

    const resposta = {};
    result.rows.forEach(r => {
      resposta[r.status] = Number(r.total);
    });

    return resposta;
  }

  async motoristasAtivos() {
    const result = await pool.query(`
      SELECT 
        m.id as "motoristaId",
        m.nome,
        COUNT(e.id) as "entregasEmAberto"
      FROM motoristas m
      JOIN entregas e ON e.motorista_id = m.id
      WHERE e.status NOT IN ('ENTREGUE', 'CANCELADA')
      GROUP BY m.id, m.nome
    `);

    return result.rows;
  }
}
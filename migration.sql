CREATE TABLE IF NOT EXISTS motoristas (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS entregas (
  id SERIAL PRIMARY KEY,
  descricao TEXT NOT NULL,
  origem TEXT NOT NULL,
  destino TEXT NOT NULL,
  status TEXT NOT NULL CHECK (
    status IN ('CRIADA', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADA')
  ),
  motorista_id INTEGER,
  CONSTRAINT fk_motorista
    FOREIGN KEY (motorista_id)
    REFERENCES motoristas(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS eventos_entrega (
  id SERIAL PRIMARY KEY,
  entrega_id INTEGER NOT NULL,
  descricao TEXT NOT NULL,
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_entrega
    FOREIGN KEY (entrega_id)
    REFERENCES entregas(id)
    ON DELETE CASCADE
);
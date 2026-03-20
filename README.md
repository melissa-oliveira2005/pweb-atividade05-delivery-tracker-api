# Delivery Tracker API

API REST para rastreamento de entregas entre cidades, desenvolvida como atividade da disciplina de Programação Web II (PWEB2).

---

## Tecnologias Utilizadas

- Node.js
- Express
- JavaScript (ES Modules)

---

## Estrutura do Projeto

```

src/
├── controllers/
├── services/
├── repositories/
├── database/
├── routes/
├── utils/

```

---

## Arquitetura

O projeto segue o padrão de arquitetura em camadas:

- Controller → Responsável pelas requisições HTTP
- Service → Contém as regras de negócio
- Repository → Acesso aos dados (simulado)
- Database → Persistência em memória

Também foi aplicada injeção de dependência manual.

---

## Funcionalidades

- Cadastro de entregas
- Controle de status:
  - CRIADA
  - EM_TRANSITO
  - ENTREGUE
  - CANCELADA
- Histórico de eventos por entrega
- Filtro por status
- Validação de regras de negócio

---

## Regras de Negócio

- Origem e destino não podem ser iguais
- Status inicial é CRIADA
- Fluxo permitido:
  - CRIADA → EM_TRANSITO → ENTREGUE
- Não é permitido:
  - Pular etapas
  - Avançar após finalização
  - Cancelar entrega já entregue
- Não pode existir entrega duplicada em aberto
- Toda alteração gera histórico

---

## Rotas da API

| Método | Rota | Descrição |
|------|------|--------|
| POST | /api/entregas | Criar entrega |
| GET | /api/entregas | Listar entregas |
| GET | /api/entregas/:id | Buscar por ID |
| PATCH | /api/entregas/:id/avancar | Avançar status |
| PATCH | /api/entregas/:id/cancelar | Cancelar entrega |
| GET | /api/entregas/:id/historico | Ver histórico |

---

## Como Executar

### 1. Instalar dependências

```

npm install

```

### 2. Rodar o servidor

```

node src/app.js

```

Servidor disponível em:

```

[http://localhost:3000](http://localhost:3000)

```

---

## Testes

Os testes podem ser realizados de três formas:

- Postman
- Thunder Client (VS Code)
- Script `test.js`

### Executar teste via script:

```

node test.js

```

---

## Exemplo de Requisição

### Criar entrega

```

POST /api/entregas

````

```json
{
  "descricao": "Entrega 1",
  "origem": "Maceió",
  "destino": "Recife"
}
````

---

## Cenários Testados

* Criação de entrega
* Validação de duplicidade
* Transição de status
* Bloqueio de fluxo inválido
* Cancelamento
* Consulta de histórico
* Filtro por status

---

## Autora

Melissa Carolyne Alves de Oliveira

---

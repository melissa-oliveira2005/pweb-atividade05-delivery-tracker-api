# Delivery Tracker API

API REST para rastreamento de entregas entre cidades, desenvolvida como atividade da disciplina de Programação Web II (PWEB2).

---
## 🎯 Objetivo

Implementar persistência real utilizando PostgreSQL e SQL puro, substituindo o armazenamento em memória da versão anterior, mantendo a arquitetura existente (sem alterar services).

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
  ├── EntregasController.js.js
  └── MotoristasController.js
├── services/
  ├── EntregasService.js
  └── MotoristasService.js
├── repositories/
    ├── inMemory/
      ├── EntregasRepository.js
      └── MotoristasRepository.js
    ├── interfaces/
      ├── IEntregasRepository.js
      └── IMotoristasRepository.js
├── database/
  ├── database.js
  └── databaseInstance.js
├── routes/
  ├── entregasRoutes.js
  └── motoristasRoutes.js
└── utils/
  └── erros.js


```

---

## Arquitetura

O projeto segue o padrão de arquitetura em camadas:

- Controller → Responsável pelas requisições HTTP
- Service → Contém as regras de negócio
- Repository → Acesso aos dados (simulado)
- Database → Persistência em memória

Também foi aplicada injeção de dependência manual.
Os services dependem apenas de contratos (interfaces), permitindo troca de implementação sem impacto.

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

## 🗄️ Banco de Dados
✔ Modelagem

O banco possui as seguintes tabelas:

motoristas
entregas
eventos_entrega
🔹 Regras implementadas
Integridade referencial com FOREIGN KEY
ON DELETE CASCADE em eventos_entrega
Controle de status com CHECK CONSTRAINT
Campos obrigatórios com NOT NULL
CPF com UNIQUE

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
## ⚙️ Configuração
1. Variáveis de ambiente

Criar arquivo .env:

DATABASE_URL=postgresql://usuario:500207@localhost:5432/delivery_tracker
2. Criar banco
CREATE DATABASE delivery_tracker;
3. Executar migration
psql -U postgres -d delivery_tracker -f migration.sql
4. Instalar dependências
npm install
▶️ 5. Executar aplicação
npm run dev

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
## 📡 Endpoints
  🔹 Motoristas
      Método	Rota	Descrição
      POST	/api/motoristas	Criar motorista
      GET	/api/motoristas	Listar motoristas
  🔹 Entregas
      Método	Rota	Descrição
      POST	/api/entregas	Criar entrega
      GET	/api/entregas/:id	Buscar por ID

## 📊 Relatórios
✔ Entregas por status
GET /api/relatorios/entregas-por-status

Retorno:

{
  "CRIADA": 5,
  "EM_TRANSITO": 3,
  "ENTREGUE": 12,
  "CANCELADA": 2
}
✔ Motoristas ativos
GET /api/relatorios/motoristas-ativos

Retorno:

[
  {
    "motoristaId": 1,
    "nome": "João",
    "entregasEmAberto": 2
  }
]

## 🧠 Decisões Técnicas
Uso de SQL puro para aprendizado de queries
Utilização de pg.Pool para gerenciamento de conexões
Tratamento de erros de banco no repository
Manutenção dos services intactos (restrição da atividade)

## ⚠️ Tratamento de Erros
CPF duplicado → erro de domínio
Registro não encontrado → retorno null
Erros de banco não são expostos diretamente

## 🧪 Cenários Validados
Persistência após reinicialização do servidor
Inserção e consulta de dados no banco
Violação de UNIQUE (CPF) tratada corretamente
Relatórios com GROUP BY e JOIN funcionando

## 📌 Requisitos Atendidos
Requisito	Status
Modelagem relacional	✅
Migration manual	✅
Uso de pg.Pool	✅
Repositories reimplementados	✅
Services não alterados	✅
Tratamento de erros	✅
Queries com JOIN e GROUP BY	✅

---
💡 Observação

O projeto foi estruturado mantendo separação clara entre camadas, permitindo futura substituição de SQL puro por ORM sem impacto nos services.

---
## Autora

Melissa Carolyne Alves de Oliveira

---

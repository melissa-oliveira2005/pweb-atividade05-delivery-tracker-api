// test.js

const baseURL = "http://localhost:3000/api/entregas";

async function runTests() {
  try {
    // 🔹 1. Criar entrega
    let response = await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        descricao: "Entrega Teste",
        origem: "Maceió",
        destino: "Recife"
      })
    });

    let data = await response.json();
    console.log("✅ Criada:", data);

    const id = data.id;

    // 🔹 2. Avançar para EM_TRANSITO
    response = await fetch(`${baseURL}/${id}/avancar`, {
      method: "PATCH"
    });

    data = await response.json();
    console.log("🚚 Em trânsito:", data.status);

    // 🔹 3. Avançar para ENTREGUE
    response = await fetch(`${baseURL}/${id}/avancar`, {
      method: "PATCH"
    });

    data = await response.json();
    console.log("📦 Entregue:", data.status);

    // 🔹 4. Tentar avançar novamente (erro esperado)
    response = await fetch(`${baseURL}/${id}/avancar`, {
      method: "PATCH"
    });

    data = await response.json();
    console.log("❌ Erro esperado:", data);

    // 🔹 5. Buscar histórico
    response = await fetch(`${baseURL}/${id}/historico`);
    data = await response.json();

    console.log("📜 Histórico:", data);

  } catch (error) {
    console.error("Erro geral:", error.message);
  }
}

runTests();
// src/app.js
import express from "express";
import entregasRoutes from "./routes/entregasRoutes.js";
import motoristasRoutes from "./routes/motoristasRoutes.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api", entregasRoutes);
app.use("/api", motoristasRoutes);

app.get("/api", (req, res) => {
  res.json({ mensagem: "Bem-vindo à API Delivery Tracker" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
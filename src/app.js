// src/app.js
import express from "express";
import entregasRoutes from "./routes/entregasRoutes.js";

const app = express();

app.use(express.json());
app.use("/api", entregasRoutes);

app.get("/api", (req, res) => {
  res.send("Bem-vindo à API");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
// parte
import mongoose from "mongoose";

// parte manu
import express from "express";
import cors from "cors";
import produtoRoutes from "./rotas/produto.routes.js";
import carrinhoRoutes from "./carrinho/carrinho.routes.js"; //jessica

const app = express(); // ✅ declare antes de usar

app.use(cors());
app.use(express.json());

app.use(produtoRoutes);
app.use(carrinhoRoutes); //jessica

app.listen(8000, () => {
  console.log("Servidor rodando na porta 8000");
});


import { Router } from "express";
import Usuario from "../usuarios/usuario.controller.js"; // ajuste se necessário

const rotasNaoAutenticadas = Router();

// Rota de login
rotasNaoAutenticadas.post('/login', Usuario.login);

// Rota de teste sem autenticação
rotasNaoAutenticadas.get('/b2', (req, res) => {
  res.send("Rota B2 funcionando sem token!");
});

export default rotasNaoAutenticadas;

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import rotasNaoAutenticadas from './rotas/rotas-nao-autenticadas.js';
import rotasAutenticadas from './rotas/rotas-autenticadas.js';
import { verificarToken } from './middleware/auth.js';

// Configuração da aplicação
const app = express();
app.use(cors());
app.use(express.json());

// Rotas públicas (ex: login, cadastro de usuário)
app.use(rotasNaoAutenticadas);

// Middleware para proteger as rotas autenticadas
app.use(verificarToken);

// Rotas privadas (ex: listar produtos, excluir produto, etc)
app.use(rotasAutenticadas);

// 🔗 Conexão com MongoDB Atlas
mongoose
  .connect('mongodb+srv://admin:admin123@lojacelulares.s2ux2hf.mongodb.net/lojacelulares')
  .then(() => console.log('💗 Conectado ao MongoDB Atlas com sucesso!'))
  .catch((err) => console.error('❌ Erro ao conectar ao Banco:', err));

// 🚀 Subindo o servidor
app.listen(8000, () => {
  console.log('Servidor rodando na porta 8000 🚀');
});

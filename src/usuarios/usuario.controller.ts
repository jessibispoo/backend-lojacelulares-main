import type { Request, Response } from 'express'
import { db } from '../database/banco-mongo.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongoose from "mongoose"

// ------------------------
// Mongoose Schema
// ------------------------
const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  idade: { type: Number, required: true }, // jessica ✅ Adicionado idade
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  tipo: { type: String, enum: ["admin", "usuario"], default: "usuario" }, // jessica ✅ Tipo de usuário
  criadoEm: { type: Date, default: Date.now },
  ativo: { type: Boolean, default: true }
})

export const Usuario = mongoose.model("Usuario", usuarioSchema)

// ------------------------
// Controller
// ------------------------
class UsuariosController {

  // ------------------------
  // Adicionar usuário
  // ------------------------
  async adicionar(req: Request, res: Response) {
    const { nome, idade, email, senha, tipo } = req.body // jessica ✅ Recebendo tipo

    if (!nome || !idade || !email || !senha)
      return res.status(400).json({ error: "Nome, idade, email e senha são obrigatórios" })
    if (senha.length < 6)
      return res.status(400).json({ error: "A senha deve ter no mínimo 6 caracteres" })
    if (!email.includes('@') || !email.includes('.'))
      return res.status(400).json({ error: "Email inválido" })

    const senhaCriptografada = await bcrypt.hash(senha, 10)

    const usuario = {
      nome,
      idade,
      email,
      senha: senhaCriptografada,
      tipo: tipo === "admin" ? "admin" : "usuario" // jessica ✅ Garantindo valor válido
    }

    const resultado = await db.collection('usuarios').insertOne(usuario) // jessica ✅ Corrigido
    res.status(201).json({ nome, idade, email, tipo: usuario.tipo, _id: resultado.insertedId }) // jessica ✅ Corrigido
  }

  // ------------------------
  // Listar usuários
  // ------------------------
  async listar(req: Request, res: Response) {
    const usuarios = await db.collection('usuarios').find().toArray()
    const usuariosSemSenha = usuarios.map(({ senha, ...resto }) => resto)
    res.status(200).json(usuariosSemSenha)
  }

  // ------------------------
  // Login
  // ------------------------
  async login(req: Request, res: Response) {
    const { email, senha } = req.body
    if (!email || !senha) return res.status(400).json({ mensagem: "Email e senha são obrigatórios!" })

    const usuario = await db.collection('usuarios').findOne({ email })
    if (!usuario) return res.status(401).json({ mensagem: "Usuário Incorreto!" })

    const senhaValida = await bcrypt.compare(senha, usuario.senha)
    if (!senhaValida) return res.status(401).json({ mensagem: "Senha Incorreta!" })

    // jessica ✅ Incluindo tipo no token
    const token = jwt.sign(
      { usuarioId: usuario._id, tipo: usuario.tipo }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '1h' }
    )

    res.status(200).json({ token }) // jessica ✅ Token agora carrega tipo
  }

}

export default new UsuariosController()

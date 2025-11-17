import type { Request, Response } from 'express'
import { db } from '../database/banco-mongo.js'
import { ObjectId } from 'mongodb'


class ProdutoController {
    async listar(req: Request, res: Response) {
        const produtos = await db.collection('produtos').find().toArray()
        res.status(200).json(produtos)
    }

    async adicionar(req: Request, res: Response) {
        const { nome, preco, categoria } = req.body
        if (!nome || !preco || !categoria)
            return res.status(400).json({ msg: "Nome, preço e categoria são obrigatórios" })

        const resultado = await db.collection('produtos').insertOne({ nome, preco, categoria })
        res.status(201).json({ _id: resultado.insertedId, nome, preco, categoria })
    }

    async editar(req: Request, res: Response) {
        const { id } = req.params
        const { nome, preco, categoria } = req.body

        if (!nome && !preco && !categoria)
            return res.status(400).json({ msg: "Pelo menos um campo deve ser fornecido para editar" })

        const updateDoc: any = {}
        if (nome) updateDoc.nome = nome
        if (preco) updateDoc.preco = preco
        if (categoria) updateDoc.categoria = categoria

        await db.collection('produtos').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateDoc }
        )

        res.status(200).json({ msg: "Produto atualizado" })
    }

    async excluir(req: Request, res: Response) {
        const { id } = req.params
        await db.collection('produtos').deleteOne({ _id: new ObjectId(id) })
        res.status(200).json({ msg: "Produto excluído" })
    }
}

export default new ProdutoController()

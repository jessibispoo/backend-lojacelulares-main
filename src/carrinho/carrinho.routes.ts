import express from "express";
import Carrinho from "../models/carrinho.model.js"; //jessica; Ana Luíza
import Produto from "../models/produto.model.js"; //Ana Luíza
import { verificarToken } from "../middleware/auth.js"; //jessica; Ana Luíza

const router = express.Router();

// Alterar quantidade de item no carrinho //jessica
router.put("/carrinho/:produtoId", verificarToken, async (req, res) => {
  try {
    const userId = (req as any).user.id; //jessica

    const { produtoId } = req.params; //jessica
    const { quantidade } = req.body; //jessica

    const carrinho = await Carrinho.findOne({ usuario: userId }); //jessica
    if (!carrinho) return res.status(404).json({ message: "Carrinho não encontrado" }); //jessica

    const item = carrinho.itens.find(i => i.produto.toString() === produtoId); //jessica
    if (!item) return res.status(404).json({ message: "Item não encontrado no carrinho" }); //jessica

    item.quantidade = quantidade; //jessica
    await carrinho.save(); //jessica

    res.status(200).json({ message: "Quantidade atualizada com sucesso", carrinho }); //jessica
  } catch (error) {
    console.error(error); //jessica
    res.status(500).json({ message: "Erro ao atualizar quantidade", error }); //jessica
  }
});

router.delete("/carrinho/:produtoId", verificarToken, async (req, res) => { //Ana Luíza B1
  try {
    const userId = (req as any).user.id;
    const { produtoId } = req.params; //Ana Luíza B1

    const carrinho = await Carrinho.findOne({ usuario: userId }); //Ana Luíza B1
    if (!carrinho)
      return res.status(404).json({ msg: "Carrinho não encontrado." }); //Ana Luíza B1

    carrinho.itens = carrinho.itens.filter( //Ana Luíza B1
      (item) => item.produto.toString() !== produtoId
    ) as any; //Ana Luíza B1

    await carrinho.save(); //Ana Luíza B1

    res.json({ msg: "Item removido com sucesso.", carrinho }); //Ana Luíza B1
  } catch (err) {
    console.error(err); //Ana Luíza B1
    res.status(500).json({ msg: "Erro ao remover item." }); //Ana Luíza B1
  }
}); //Ana Luíza B1

router.get("/carrinho", verificarToken, async (req, res) => { //Ana Luíza B5
  try {
    const userId = (req as any).user.id; //Ana Luíza B5

    const carrinho = await Carrinho.findOne({ usuario: userId }); //Ana Luíza B5
    if (!carrinho)
      return res.status(404).json({ msg: "Carrinho vazio" }); //Ana Luíza B5

    const produtosIds = carrinho.itens.map(item => item.produto); //Ana Luíza B5

    const produtos = await Produto.find({ //Ana Luíza B5
      _id: { $in: produtosIds }
    });

    const total = carrinho.itens.reduce((soma, item) => { //Ana Luíza B5
      const produtoInfo = produtos.find(
        (p: any) => p._id.toString() === item.produto.toString() //Ana Luíza B5
      );

      const preco = produtoInfo?.preco || 0; //Ana Luíza B5

      return soma + preco * item.quantidade; //Ana Luíza B5
    }, 0);

    res.json({ carrinho, total }); //Ana Luíza B5

  } catch (err) { //Ana Luíza B5
    console.error(err);
    res.status(500).json({ msg: "Erro ao buscar carrinho" }); //Ana Luíza B5
  }
}); //Ana Luíza B5


export default router; //jessica

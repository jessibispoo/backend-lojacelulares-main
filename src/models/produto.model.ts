import mongoose from "mongoose"; //Ana Luíza B5

const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true }, //Ana Luíza B5
  preco: { type: Number, required: true },
  categoria: { type: String, required: true }, //Ana Luíza B5
});

const Produto = mongoose.model("Produto", ProdutoSchema); //Ana Luíza B5

export default Produto; //Ana Luíza B5

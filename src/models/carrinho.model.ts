import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  produto: { type: mongoose.Schema.Types.ObjectId, ref: "Produto", required: true }, //jessica
  quantidade: { type: Number, required: true, default: 1 }, //jessica
});

const CarrinhoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true }, //jessica
  itens: [ItemSchema], //jessica
});

const Carrinho = mongoose.model("Carrinho", CarrinhoSchema);

export default Carrinho; //jessica

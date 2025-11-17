import { Router } from "express";
import ProdutoController from "../produtos/produto.controller.js";
import { verificarToken, verificarAdmin } from "../middleware/auth.js"; // ✅

const router = Router();

router.get("/produtos", ProdutoController.listar); // qualquer usuário
router.post("/produtos", verificarToken, verificarAdmin, ProdutoController.adicionar); // admin apenas
router.put("/produtos/:id", verificarToken, verificarAdmin, ProdutoController.editar); // admin apenas
router.delete("/produtos/:id", verificarToken, verificarAdmin, ProdutoController.excluir); // admin apenas

export default router;

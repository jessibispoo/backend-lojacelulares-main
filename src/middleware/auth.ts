import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global { //Ana Luíza
  namespace Express {
    interface Request { //Ana Luíza
      user?: any;
    } //Ana Luíza
  } 
} //Ana Luíza

const SECRET = process.env.JWT_SECRET || "segredo";

// jessica ✅ Verifica token
export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "Token não fornecido" });

    try {
        const decoded = jwt.verify(token, SECRET) as any;
        (req as any).user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Token inválido" });
    }
};

// jessica ✅ Verifica se o usuário é admin
export const verificarAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user.tipo || user.tipo !== "admin") {
        return res.status(403).json({ msg: "Acesso negado: Admin apenas" });
    }
    next();
};


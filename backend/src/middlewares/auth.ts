// middleware/auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔑 Token reçu:", token);

  try {
    // Vérifier si c'est notre token simple "admin_ok"
    if (token === "admin_ok") {
      console.log("✅ Token admin simple accepté");
      req.user = { 
        id: 9999, 
        email: "admin@sugu-link.com", 
        user_type: "admin" 
      };
      return next();
    }
    
    // Sinon, essayer de le vérifier comme JWT normal
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
    
  } catch (err) {
    console.error("❌ Token invalide:", err);
    return res.status(403).json({ message: "Token invalide" });
  }
};
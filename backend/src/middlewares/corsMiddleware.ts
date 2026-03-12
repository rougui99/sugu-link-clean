import { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Options CORS
const corsOptions: cors.CorsOptions = {
  origin: ['http://localhost:5173'], // frontend dev
  credentials: true,
};

// Middleware principal
export const corsMiddleware = cors(corsOptions);

// Middleware wrapper pour Express
export const applyCors = (req: Request, res: Response, next: NextFunction) => {
  corsMiddleware(req, res, (err?: Error) => {
    if (err) return res.status(500).json({ error: 'CORS error' });
    next();
  });
};

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  console.error('❌ Error:', message);
  res.status(500).json({ error: message });
};

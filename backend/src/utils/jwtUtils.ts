import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

const SECRET: Secret = process.env.JWT_SECRET || 'YourSecretKey123';

// Générer un token JWT
export const generateJWT = (
  payload: string | object | Buffer,
  expiresIn: SignOptions['expiresIn'] = '1h'
): string => {

  const options: SignOptions = { expiresIn };

  return jwt.sign(payload, SECRET, options);
};

// Vérifier un token JWT
export const verifyJWT = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, SECRET);
    return typeof decoded === 'object' ? decoded : null;
  } catch {
    return null;
  }
};

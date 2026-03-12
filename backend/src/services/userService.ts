import { pool } from '../config/database';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

// Récupérer tous les utilisateurs
export const getAllUsers = async (): Promise<User[]> => {
  const result = await pool.query(
    'SELECT id, first_name, last_name, email, created_at FROM users ORDER BY id ASC'
  );
  return result.rows;
};

// Récupérer un utilisateur par ID
export const getUserById = async (userId: number): Promise<User | null> => {
  const result = await pool.query(
    'SELECT id, first_name, last_name, email, created_at FROM users WHERE id=$1',
    [userId]
  );
  return result.rows[0] ?? null;
};

// Créer un nouvel utilisateur
export const createUser = async (user: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}): Promise<User> => {
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password)
     VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email, created_at`,
    [user.first_name, user.last_name, user.email, hashedPassword]
  );

  return result.rows[0];
};

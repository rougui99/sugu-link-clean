import { Request, Response } from 'express';
import { pool } from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET = process.env.JWT_SECRET || 'YourSecretKey123';

// ========== AUTHENTIFICATION ==========

// INSCRIPTION (Register)
export const register = async (req: Request, res: Response) => {
  const { first_name, last_name, email, password } = req.body;
  
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insérer l'utilisateur
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password)
       VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email, created_at`,
      [first_name, last_name, email, hashedPassword]
    );

    const user = result.rows[0];
    
    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        first_name: user.first_name,
        last_name: user.last_name 
      }, 
      SECRET, 
      { expiresIn: '1d' }
    );

    res.status(201).json({ 
      message: "Inscription réussie",
      token, 
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Erreur register:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// CONNEXION (Login)
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  try {
    // Vérifier si l'utilisateur existe
    const result = await pool.query(
      'SELECT id, first_name, last_name, email, password FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const user = result.rows[0];

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Générer le token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        first_name: user.first_name,
        last_name: user.last_name 
      },
      SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Erreur login:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// ========== GESTION DES UTILISATEURS ==========

// GET all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, first_name, last_name, email, created_at FROM users ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur getAllUsers:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// GET user by ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, first_name, last_name, email, created_at FROM users WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur getUserById:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// CREATE user (alias pour register)
export const createUser = async (req: Request, res: Response) => {
  return register(req, res);
};

// UPDATE user
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { first_name, last_name, email, password } = req.body;
  
  try {
    // Vérifier si l'utilisateur existe
    const checkUser = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
    if (checkUser.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Construire la requête dynamiquement
    let query = 'UPDATE users SET ';
    const values = [];
    let paramCount = 1;

    if (first_name) {
      query += `first_name = $${paramCount}, `;
      values.push(first_name);
      paramCount++;
    }
    if (last_name) {
      query += `last_name = $${paramCount}, `;
      values.push(last_name);
      paramCount++;
    }
    if (email) {
      query += `email = $${paramCount}, `;
      values.push(email);
      paramCount++;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += `password = $${paramCount}, `;
      values.push(hashedPassword);
      paramCount++;
    }

    // Enlever la dernière virgule
    query = query.slice(0, -2);
    query += ` WHERE id = $${paramCount} RETURNING id, first_name, last_name, email`;
    values.push(id);

    const result = await pool.query(query, values);
    
    res.json({
      message: "Utilisateur mis à jour avec succès",
      user: result.rows[0]
    });
  } catch (err) {
    console.error("Erreur updateUser:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// DELETE user
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    console.error("Erreur deleteUser:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};
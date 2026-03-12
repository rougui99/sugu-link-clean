import { Router } from 'express';
import { pool } from '../config/database';
import { register, login, getUsers } from '../controllers/usersController';

const router = Router();

// ===== ROUTES AVEC CONTROLLERS =====
router.post('/register', register);  // POST /api/users/register
router.post('/login', login);        // POST /api/users/login
router.get('/', getUsers);           // GET /api/users (utilise le controller)

// ===== ROUTES DIRECTES AVEC POOL =====
// GET all users (version directe - si pas de controller)
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur GET /all:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur GET /:id:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST create user (inscription manuelle)
router.post('/', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  
  // Validation basique
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  try {
    // Vérifier si l'email existe déjà
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Ici tu devrais hasher le mot de passe !!!
    // const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email',
      [first_name, last_name, email, password] // Remplace password par hashedPassword
    );
    
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Erreur POST /:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, password } = req.body;
  
  try {
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
      // Ici aussi, hasher le mot de passe !
      query += `password = $${paramCount}, `;
      values.push(password);
      paramCount++;
    }

    // Enlever la dernière virgule et espace
    query = query.slice(0, -2);
    query += ` WHERE id = $${paramCount} RETURNING id, first_name, last_name, email`;
    values.push(id);

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json({
      message: 'Utilisateur mis à jour avec succès',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Erreur PUT /:id:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    console.error('Erreur DELETE /:id:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// GET all user_roles
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM user_roles ORDER BY user_id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// POST assign role to user
router.post('/', async (req, res) => {
  const { user_id, role_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) RETURNING *',
      [user_id, role_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// DELETE role from user
router.delete('/', async (req, res) => {
  const { user_id, role_id } = req.body;
  try {
    await pool.query('DELETE FROM user_roles WHERE user_id=$1 AND role_id=$2', [user_id, role_id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

export default router;

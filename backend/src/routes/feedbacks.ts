import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// GET all feedbacks
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM feedbacks ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// POST create feedback
router.post('/', async (req, res) => {
  const { user_id, message } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO feedbacks (user_id, message) VALUES ($1, $2) RETURNING *',
      [user_id, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

export default router;

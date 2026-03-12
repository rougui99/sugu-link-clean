import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// GET all logs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM logs ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

export default router;

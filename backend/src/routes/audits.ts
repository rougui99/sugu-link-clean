import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// GET all audit logs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM audits ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

export default router;

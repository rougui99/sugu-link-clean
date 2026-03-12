import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// GET all settings
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM settings ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// PUT update setting
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { key, value } = req.body;
  try {
    const result = await pool.query(
      'UPDATE settings SET key=$1, value=$2 WHERE id=$3 RETURNING *',
      [key, value, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Setting non trouvé');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

export default router;

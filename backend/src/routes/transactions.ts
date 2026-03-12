import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// GET transaction by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM transactions WHERE id=$1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Transaction non trouvée');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// POST create transaction
router.post('/', async (req, res) => {
  const { user_id, amount, type } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO transactions (user_id, amount, type) VALUES ($1, $2, $3) RETURNING *',
      [user_id, amount, type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// PUT update transaction
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, amount, type } = req.body;
  try {
    const result = await pool.query(
      'UPDATE transactions SET user_id=$1, amount=$2, type=$3 WHERE id=$4 RETURNING *',
      [user_id, amount, type, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Transaction non trouvée');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// DELETE transaction
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM transactions WHERE id=$1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

export default router;

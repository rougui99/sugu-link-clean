import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// GET all documents
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM documents ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// GET document by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM documents WHERE id=$1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Document non trouvé');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// POST create document
router.post('/', async (req, res) => {
  const { user_id, name, url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO documents (user_id, name, url) VALUES ($1, $2, $3) RETURNING *',
      [user_id, name, url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// PUT update document
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, name, url } = req.body;
  try {
    const result = await pool.query(
      'UPDATE documents SET user_id=$1, name=$2, url=$3 WHERE id=$4 RETURNING *',
      [user_id, name, url, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Document non trouvé');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// DELETE document
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM documents WHERE id=$1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

export default router;

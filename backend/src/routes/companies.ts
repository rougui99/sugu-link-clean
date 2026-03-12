import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// GET all companies
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM companies ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// GET company by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM companies WHERE id=$1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Company non trouvée');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// POST create company
router.post('/', async (req, res) => {
  const { name, country } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO companies (name, country) VALUES ($1, $2) RETURNING *',
      [name, country]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// PUT update company
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, country } = req.body;
  try {
    const result = await pool.query(
      'UPDATE companies SET name=$1, country=$2 WHERE id=$3 RETURNING *',
      [name, country, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Company non trouvée');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// DELETE company
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM companies WHERE id=$1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

export default router;

import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// GET all job listings
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM job_listings ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// GET job by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM job_listings WHERE id=$1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Job non trouvé');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// POST create job listing
router.post('/', async (req, res) => {
  const { company_id, title, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO job_listings (company_id, title, description) VALUES ($1, $2, $3) RETURNING *',
      [company_id, title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// PUT update job
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { company_id, title, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE job_listings SET company_id=$1, title=$2, description=$3 WHERE id=$4 RETURNING *',
      [company_id, title, description, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Job non trouvé');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// DELETE job
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM job_listings WHERE id=$1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

export default router;

import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// GET all job applications
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM job_applications ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// GET application by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM job_applications WHERE id=$1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Application non trouvée');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// POST create application
router.post('/', async (req, res) => {
  const { user_id, job_id, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO job_applications (user_id, job_id, status) VALUES ($1, $2, $3) RETURNING *',
      [user_id, job_id, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// PUT update application
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, job_id, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE job_applications SET user_id=$1, job_id=$2, status=$3 WHERE id=$4 RETURNING *',
      [user_id, job_id, status, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Application non trouvée');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// DELETE application
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM job_applications WHERE id=$1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

export default router;

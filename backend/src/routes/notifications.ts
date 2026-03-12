import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// GET all notifications
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notifications ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// POST create notification
router.post('/', async (req, res) => {
  const { user_id, message, read } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO notifications (user_id, message, read) VALUES ($1, $2, $3) RETURNING *',
      [user_id, message, read]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// PUT update notification (mark read)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { read } = req.body;
  try {
    const result = await pool.query(
      'UPDATE notifications SET read=$1 WHERE id=$2 RETURNING *',
      [read, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Notification non trouvée');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// DELETE notification
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM notifications WHERE id=$1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

export default router;

import express from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/auth';

const router = express.Router();
const pool = new Pool({ /* ta config */ });

// Récupérer les notifications de l'utilisateur connecté
router.get('/', authenticateJWT, async (req: any, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Marquer une notification comme lue
router.put('/:id/read', authenticateJWT, async (req: any, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Marquer toutes les notifications comme lues
router.put('/read-all', authenticateJWT, async (req: any, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET read = true WHERE user_id = $1',
      [req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Créer une notification (pour admin)
router.post('/', authenticateJWT, async (req: any, res) => {
  try {
    const { user_id, type, title, message, link } = req.body;
    const result = await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, link)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, type, title, message, link]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
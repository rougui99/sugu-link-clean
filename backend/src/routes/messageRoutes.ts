import express from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/auth';

const router = express.Router();
const pool = new Pool({ /* ta config */ });

// Envoyer un message
router.post('/', authenticateJWT, async (req: any, res) => {
  try {
    const { receiver_id, content } = req.body;
    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.user.id, receiver_id, content]
    );
    
    // Créer une notification pour le destinataire
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, link)
       VALUES ($1, 'message', 'Nouveau message', 'Vous avez reçu un message', '/messages')`,
      [receiver_id]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Récupérer les conversations de l'utilisateur
router.get('/conversations', authenticateJWT, async (req: any, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT 
        u.id, u.first_name, u.last_name, u.email,
        (SELECT content FROM messages 
         WHERE (sender_id = u.id AND receiver_id = $1)
            OR (sender_id = $1 AND receiver_id = u.id)
         ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM messages 
         WHERE (sender_id = u.id AND receiver_id = $1)
            OR (sender_id = $1 AND receiver_id = u.id)
         ORDER BY created_at DESC LIMIT 1) as last_message_time
       FROM messages m
       JOIN users u ON u.id = CASE 
         WHEN m.sender_id = $1 THEN m.receiver_id
         ELSE m.sender_id
       END
       WHERE m.sender_id = $1 OR m.receiver_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Récupérer les messages avec un utilisateur spécifique
router.get('/with/:userId', authenticateJWT, async (req: any, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM messages 
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [req.user.id, req.params.userId]
    );
    
    // Marquer comme lus
    await pool.query(
      `UPDATE messages SET read = true 
       WHERE sender_id = $2 AND receiver_id = $1`,
      [req.user.id, req.params.userId]
    );
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
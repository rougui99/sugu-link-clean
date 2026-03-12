const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Utilisez PDF, JPEG ou PNG.'));
    }
  }
});

// Middleware d'authentification (à adapter)
const authenticateJWT = require('../middleware/auth');

// 📤 Upload d'un document
router.post('/upload', authenticateJWT, upload.single('document'), async (req, res) => {
  try {
    const { documentType, documentNumber, issueDate, expiryDate } = req.body;
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const documentUrl = `/uploads/documents/${req.file.filename}`;

    const result = await pool.query(
      `INSERT INTO supplier_documents 
       (user_id, document_type, document_url, document_number, issue_date, expiry_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, documentType, documentUrl, documentNumber, issueDate, expiryDate]
    );

    res.status(201).json({
      success: true,
      document: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur upload document:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 📋 Liste des documents d'un utilisateur
router.get('/my-documents', authenticateJWT, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM supplier_documents WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur récupération documents:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 🔍 Soumettre une demande de vérification
router.post('/request-verification', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const { documentIds } = req.body;

    // Vérifier que les documents appartiennent bien à l'utilisateur
    const docsCheck = await pool.query(
      'SELECT id FROM supplier_documents WHERE user_id = $1 AND id = ANY($2::int[])',
      [userId, documentIds]
    );

    if (docsCheck.rows.length !== documentIds.length) {
      return res.status(400).json({ error: 'Documents invalides' });
    }

    // Créer la demande
    const result = await pool.query(
      `INSERT INTO verification_requests (user_id, documents)
       VALUES ($1, $2) RETURNING *`,
      [userId, JSON.stringify(documentIds)]
    );

    res.status(201).json({
      success: true,
      request: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur demande vérification:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 👑 Routes admin
router.get('/admin/pending-requests', authenticateJWT, async (req, res) => {
  try {
    // Vérifier que l'utilisateur est admin
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const result = await pool.query(
      `SELECT vr.*, u.email, u.first_name, u.last_name, u.company_name
       FROM verification_requests vr
       JOIN users u ON vr.user_id = u.id
       WHERE vr.status = 'pending'
       ORDER BY vr.submitted_at ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erreur récupération demandes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ Approuver/rejeter une demande
router.post('/admin/review-request/:requestId', authenticateJWT, async (req, res) => {
  try {
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const { requestId } = req.params;
    const { status, comments } = req.body; // 'approved' ou 'rejected'

    // Mettre à jour la demande
    await pool.query(
      `UPDATE verification_requests 
       SET status = $1, reviewed_at = NOW(), reviewed_by = $2, comments = $3
       WHERE id = $4`,
      [status, req.user.id, comments, requestId]
    );

    // Si approuvé, mettre à jour les documents et le statut vérifié de l'utilisateur
    if (status === 'approved') {
      const request = await pool.query('SELECT user_id, documents FROM verification_requests WHERE id = $1', [requestId]);
      const userId = request.rows[0].user_id;
      const documentIds = request.rows[0].documents;

      // Marquer les documents comme vérifiés
      await pool.query(
        'UPDATE supplier_documents SET verified = true, verified_at = NOW(), verified_by = $1 WHERE id = ANY($2::int[])',
        [req.user.id, documentIds]
      );

      // Marquer l'utilisateur comme vérifié
      await pool.query(
        'UPDATE users SET is_verified = true WHERE id = $1',
        [userId]
      );
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Erreur revue demande:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
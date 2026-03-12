import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Pool } from 'pg';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ CONNEXION POSTGRESQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sugulink',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// TEST CONNEXION
pool.connect((err) => {
  if (err) {
    console.error('❌ Erreur connexion PostgreSQL:', err);
  } else {
    console.log('✅ Connecté à PostgreSQL');
  }
});

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

// ------------------------
// 🔐 MIDDLEWARE JWT
// ------------------------
const authenticateJWT = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token manquant" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: "Token invalide" });
    req.user = user;
    next();
  });
};

// ------------------------
// 🧪 ROUTE TEST
// ------------------------
app.get("/", (req, res) => {
  res.send("Backend OK 🚀");
});

// ===================================================
// ✅ ROUTE D'INSCRIPTION (avec tous les champs)
// ===================================================
app.post("/api/users/register", async (req, res) => {
  console.log("=".repeat(50));
  console.log("📥 NOUVELLE TENTATIVE D'INSCRIPTION");
  console.log("Données reçues:", req.body);
  
  const { first_name, last_name, email, password, user_type, company_name, phone, city } = req.body;

  if (!first_name || !email || !password) {
    return res.status(400).json({ message: "Prénom, email et mot de passe sont requis" });
  }

  try {
    // Vérifier si l'utilisateur existe
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Cet email existe déjà" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Construction dynamique de la requête
    const fields = ['first_name', 'last_name', 'email', 'password', 'user_type'];
    const values = [first_name, last_name || null, email, hashedPassword, user_type || 'professional'];
    const placeholders = ['$1', '$2', '$3', '$4', '$5'];
    
    let index = 6;
    
    if (company_name) {
      fields.push('company_name');
      values.push(company_name);
      placeholders.push(`$${index++}`);
    }
    
    if (phone) {
      fields.push('phone');
      values.push(phone);
      placeholders.push(`$${index++}`);
    }
    
    if (city) {
      fields.push('city');
      values.push(city);
      placeholders.push(`$${index++}`);
    }

    const query = `
      INSERT INTO users (${fields.join(', ')}) 
      VALUES (${placeholders.join(', ')}) 
      RETURNING id, first_name, last_name, email, user_type, company_name, phone, city, created_at
    `;

    const result = await pool.query(query, values);
    const newUser = result.rows[0];

    // Générer token JWT
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        first_name: newUser.first_name,
        user_type: newUser.user_type 
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log("✅ Inscription réussie:", newUser.email);

    res.status(201).json({
      message: "✅ Inscription réussie",
      token,
      user: newUser
    });

  } catch (err) {
    console.error("🔥 ERREUR INSCRIPTION:", err);
    res.status(500).json({ message: "Erreur serveur", error: (err as any).message });
  }
});

// ===================================================
// ✅ ROUTE DE CONNEXION
// ===================================================
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        first_name: user.first_name,
        user_type: user.user_type 
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: "✅ Connexion réussie",
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        user_type: user.user_type,
        company_name: user.company_name,
        phone: user.phone,
        city: user.city,
        avatar_url: user.avatar_url
      }
    });

  } catch (err) {
    console.error("❌ Erreur connexion:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ===================================================
// ✅ ROUTES PROFIL
// ===================================================
app.get("/api/auth/profile", authenticateJWT, async (req: any, res) => {
  try {
    const result = await pool.query(
      'SELECT id, first_name, last_name, email, user_type, company_name, phone, city, avatar_url FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.put("/api/auth/profile", authenticateJWT, async (req: any, res) => {
  const { first_name, last_name, email, phone, city } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET 
        first_name = COALESCE($1, first_name), 
        last_name = COALESCE($2, last_name), 
        email = COALESCE($3, email),
        phone = COALESCE($4, phone),
        city = COALESCE($5, city)
      WHERE id = $6 
      RETURNING id, first_name, last_name, email, user_type, company_name, phone, city, avatar_url`,
      [first_name, last_name, email, phone, city, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Erreur update:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ===================================================
// ✅ UPLOAD PHOTO DE PROFIL
// ===================================================
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/avatars';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req: any, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user.id}-${Date.now()}${ext}`);
  }
});

const uploadAvatar = multer({ 
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Format image uniquement'));
    }
  }
});

app.post('/api/users/avatar', authenticateJWT, uploadAvatar.single('avatar'), async (req: any, res) => {
  try {
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await pool.query('UPDATE users SET avatar_url = $1 WHERE id = $2', [avatarUrl, req.user.id]);
    res.json({ avatarUrl });
  } catch (err) {
    console.error("❌ Erreur upload avatar:", err);
    res.status(500).json({ error: "Erreur upload" });
  }
});

// ===================================================
// ✅ NOTIFICATIONS
// ===================================================
// Récupérer les notifications
app.get('/api/notifications', authenticateJWT, async (req: any, res) => {
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
app.put('/api/notifications/:id/read', authenticateJWT, async (req: any, res) => {
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
app.put('/api/notifications/read-all', authenticateJWT, async (req: any, res) => {
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
app.post('/api/notifications', authenticateJWT, async (req: any, res) => {
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

// ===================================================
// ✅ MESSAGERIE
// ===================================================
// Envoyer un message
app.post('/api/messages', authenticateJWT, async (req: any, res) => {
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

// Récupérer les conversations
app.get('/api/messages/conversations', authenticateJWT, async (req: any, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT 
        u.id, u.first_name, u.last_name, u.email, u.avatar_url,
        (SELECT content FROM messages 
         WHERE (sender_id = u.id AND receiver_id = $1)
            OR (sender_id = $1 AND receiver_id = u.id)
         ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM messages 
         WHERE (sender_id = u.id AND receiver_id = $1)
            OR (sender_id = $1 AND receiver_id = u.id)
         ORDER BY created_at DESC LIMIT 1) as last_message_time,
        (SELECT COUNT(*) FROM messages 
         WHERE sender_id = u.id AND receiver_id = $1 AND read = false) as unread_count
       FROM messages m
       JOIN users u ON u.id = CASE 
         WHEN m.sender_id = $1 THEN m.receiver_id
         ELSE m.sender_id
       END
       WHERE m.sender_id = $1 OR m.receiver_id = $1
       ORDER BY last_message_time DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Récupérer les messages avec un utilisateur
app.get('/api/messages/with/:userId', authenticateJWT, async (req: any, res) => {
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

// ===================================================
// ✅ ROUTES ADMIN
// ===================================================
app.get("/api/admin/users", authenticateJWT, async (req: any, res) => {
  try {
    const result = await pool.query(
      'SELECT id, first_name, last_name, email, user_type, company_name, phone, city, is_verified, avatar_url, created_at FROM users ORDER BY id DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Erreur récupération users:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ===================================================
// 📄 ROUTES DE VÉRIFICATION DOCUMENTS
// ===================================================
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/documents';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadDocument = multer({
  storage: documentStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Utilisez PDF, JPEG ou PNG.'));
    }
  }
});

app.post('/api/verification/upload', authenticateJWT, uploadDocument.single('document'), async (req: any, res) => {
  try {
    const { documentType, documentNumber } = req.body;
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const documentUrl = `/uploads/documents/${req.file.filename}`;

    const result = await pool.query(
      `INSERT INTO supplier_documents 
       (user_id, document_type, document_url, document_number)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, documentType, documentUrl, documentNumber]
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

app.get('/api/verification/my-documents', authenticateJWT, async (req: any, res) => {
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

// Servir les fichiers uploadés
app.use('/uploads', express.static('uploads'));

// ------------------------
// 🚀 START SERVER
// ------------------------
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📦 Connexion PostgreSQL: ${process.env.DB_NAME || 'sugulink'}`);
});
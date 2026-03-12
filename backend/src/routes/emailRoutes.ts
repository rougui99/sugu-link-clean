// backend/src/routes/emailRoutes.ts
import express from 'express';
import { sendEmail, emailTemplates } from '../services/emailService';
import { authenticateJWT } from '../middlewares/auth';

const router = express.Router();

// Envoyer un email de bienvenue
router.post('/welcome', authenticateJWT, async (req: any, res) => {
  try {
    const { email, name } = req.body;
    await sendEmail({
      to: email,
      ...emailTemplates.welcomeProfessional(name)
    });
    res.json({ success: true, message: 'Email de bienvenue envoyé' });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'envoi" });
  }
});

// Alerte nouvelle offre
router.post('/job-alert', authenticateJWT, async (req: any, res) => {
  try {
    const { emails, jobTitle, company } = req.body;
    
    // Envoyer à tous les professionnels concernés
    for (const email of emails) {
      await sendEmail({
        to: email,
        ...emailTemplates.newJobAlert(jobTitle, company)
      });
    }
    
    res.json({ success: true, message: 'Alertes envoyées' });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'envoi" });
  }
});

export default router;
// backend/src/services/emailService.ts
import nodemailer from 'nodemailer';

// Configuration du transporteur (utilise un service gratuit comme Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Types de notifications
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Envoyer un email
export async function sendEmail(options: EmailOptions) {
  try {
    const mailOptions = {
      from: `"Sugu-Link" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw error;
  }
}

// Notifications spécifiques
export const emailTemplates = {
  // Bienvenue nouveau professionnel
  welcomeProfessional: (name: string) => ({
    subject: 'Bienvenue sur Sugu-Link !',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Bienvenue ${name} !</h2>
        <p>Merci de rejoindre la communauté Sugu-Link.</p>
        <p>Vous pouvez maintenant :</p>
        <ul>
          <li>✅ Parcourir les offres d'emploi</li>
          <li>✅ Postuler aux appels d'offres</li>
          <li>✅ Mettre en avant votre profil</li>
        </ul>
        <a href="${process.env.FRONTEND_URL}/dashboard" 
           style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Accéder à mon espace
        </a>
      </div>
    `
  }),

  // Nouvelle offre d'emploi
  newJobAlert: (jobTitle: string, company: string) => ({
    subject: `Nouvelle offre : ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h3>📢 Nouvelle opportunité !</h3>
        <p><strong>${company}</strong> recherche un(e) <strong>${jobTitle}</strong></p>
        <a href="${process.env.FRONTEND_URL}/jobs">Voir l'offre</a>
      </div>
    `
  }),

  // Candidature reçue (pour entreprise)
  applicationReceived: (jobTitle: string, candidateName: string) => ({
    subject: 'Nouvelle candidature reçue',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h3>📥 Nouvelle candidature</h3>
        <p><strong>${candidateName}</strong> a postulé à votre offre <strong>${jobTitle}</strong></p>
        <a href="${process.env.FRONTEND_URL}/applications">Voir la candidature</a>
      </div>
    `
  })
};
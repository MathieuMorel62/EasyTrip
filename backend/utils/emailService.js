import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


// Charger les variables d'environnement
dotenv.config();

// Créer un transporteur
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Fonction pour envoyer un email de bienvenue
export const sendWelcomeEmail = (to, firstName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Bienvenue sur EasyTrip!',
    text: `Bonjour ${firstName},\n\nMerci de vous être inscrit sur EasyTrip ! Nous sommes ravis de vous compter parmi nous.\n\nCordialement,\nL'équipe EasyTrip`,
    html: `<p>Bonjour ${firstName},</p>
          <p>Nous sommes ravis de vous accueillir sur <strong>EasyTrip</strong> !</p>
          <p>Merci de vous être inscrit. Nous avons hâte de vous aider à planifier vos voyages de rêve.</p>
          <p>N'hésitez pas à explorer notre plateforme et à nous contacter si vous avez des questions.</p>
          <p><a href="https://www.easytrip.com" style="color: blue; text-decoration: underline;">Visitez notre site</a></p>
          <p>Cordialement,<br>L'équipe EasyTrip</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Erreur lors de l\'envoi de l\'email:', error);
    }
    console.log('Email envoyé:', info.response);
  });
};

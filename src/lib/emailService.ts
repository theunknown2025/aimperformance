import { SavedRegistration } from './registrationService';

import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'bboslama@gmail.com',
    pass: process.env.EMAIL_PASS || 'jpbi sqib iwuk pbno'
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

export const sendConfirmationEmail = async (registration: any): Promise<boolean> => {
  try {
    const eventDetails = getEventDetails(registration.selectedEvent);
    
    console.log('=== SENDING CONFIRMATION EMAIL ===');
    console.log('To:', registration.email);
    console.log('Subject: Confirmation de votre inscription - Rencontres Régionales EXPORT');
    console.log('Event:', eventDetails.name);
    console.log('=====================================');
    
    const mailOptions = {
      from: emailConfig.auth.user,
      to: registration.email,
      subject: 'Confirmation de votre inscription - Rencontres Régionales EXPORT',
      html: generateConfirmationEmailHTML(registration, eventDetails)
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Confirmation email sent successfully!');
    
    return true;
  } catch (error) {
    console.error('❌ Confirmation email sending failed:', error);
    return false;
  }
};

export const sendValidationEmail = async (registration: SavedRegistration): Promise<boolean> => {
  try {
    const eventDetails = getEventDetails(registration.selectedEvent);
    
    console.log('=== SENDING VALIDATION EMAIL ===');
    console.log('To:', registration.email);
    console.log('Subject: Validation de votre inscription - Rencontres Régionales EXPORT');
    console.log('Password:', registration.userPassword);
    console.log('Event:', eventDetails.name);
    console.log('=====================================');
    
    const mailOptions = {
      from: emailConfig.auth.user,
      to: registration.email,
      subject: 'Validation de votre inscription - Rencontres Régionales EXPORT',
      html: generateValidationEmailHTML(registration, eventDetails)
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
};

const getEventDetails = (eventId: string) => {
  const events = {
    casablanca: {
      name: 'Casablanca',
      date: '15 Septembre 2025',
      location: 'Casablanca, Maroc',
      documents: ['doc1.pdf', 'doc2.pdf', 'doc3.pdf']
    },
    tanger: {
      name: 'Tanger',
      date: '22 Septembre 2025',
      location: 'Tanger, Maroc',
      documents: ['doc1.pdf', 'doc2.pdf', 'doc3.pdf']
    },
    fes: {
      name: 'Fes',
      date: '29 Septembre 2025',
      location: 'Fes, Maroc',
      documents: ['doc1.pdf', 'doc2.pdf', 'doc3.pdf']
    }
  };
  
  return events[eventId as keyof typeof events] || events.casablanca;
};

const generateConfirmationEmailHTML = (registration: any, eventDetails: any) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmation de votre inscription</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #51b960; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Confirmation de votre inscription</h1>
          <p>Rencontres Régionales EXPORT</p>
        </div>
        
        <div class="content">
          <h2>Cher(e) ${registration.representativeName},</h2>
          
          <p>Nous avons bien reçu votre demande d'inscription pour l'événement <strong>${eventDetails.name}</strong> (${eventDetails.name.toUpperCase()}). Nous vous remercions de l'intérêt que vous portez à notre événement.</p>
          
          <p>Votre demande est en cours d'examen. Nous vous confirmerons votre inscription dans les 48 heures.</p>
          
          <p>Dans l'attente de vous retrouver, nous restons à votre disposition pour toute question.</p>
          
          <p>Cordialement,<br>
          L'équipe AIM Performance</p>
        </div>
        
        <div class="footer">
          <p>© 2025 AIM Performance. Tous droits réservés.</p>
          <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateValidationEmailHTML = (registration: SavedRegistration, eventDetails: any) => {
  const documentsList = eventDetails.documents.map((doc: string) => 
    `<li><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/docs/${doc}" target="_blank">${doc}</a></li>`
  ).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Validation de votre inscription</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #51b960; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .credentials { background-color: #e8f5e8; padding: 15px; border-left: 4px solid #51b960; margin: 20px 0; }
        .button { display: inline-block; background-color: #51b960; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Validation de votre inscription</h1>
          <p>Rencontres Régionales EXPORT</p>
        </div>
        
        <div class="content">
          <h2>Bonjour ${registration.representativeName},</h2>
          
          <p>Nous avons le plaisir de vous informer que votre inscription aux <strong>Rencontres Régionales EXPORT</strong> a été validée avec succès !</p>
          
          <h3>📋 Détails de votre inscription :</h3>
          <ul>
            <li><strong>Entreprise :</strong> ${registration.companyName}</li>
            <li><strong>Événement :</strong> ${eventDetails.name} - ${eventDetails.date}</li>
            <li><strong>Lieu :</strong> ${eventDetails.location}</li>
            <li><strong>Date de validation :</strong> ${new Date().toLocaleDateString('fr-FR')}</li>
          </ul>
          
          <div class="credentials">
            <h3>🔐 Vos identifiants de connexion :</h3>
            <p><strong>Email :</strong> ${registration.email}</p>
            <p><strong>Mot de passe :</strong> ${registration.userPassword}</p>
            <p><em>Conservez précieusement ces identifiants pour accéder à votre espace utilisateur.</em></p>
          </div>
          
          <h3>📄 Documents de l'événement :</h3>
          <p>Vous trouverez ci-dessous les documents importants pour votre participation :</p>
          <ul>
            ${documentsList}
          </ul>
          
          <h3>🚀 Accéder à votre espace utilisateur :</h3>
          <p>Cliquez sur le bouton ci-dessous pour vous connecter à votre espace personnel :</p>
          
          <p style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login" class="button">
              Se connecter
            </a>
          </p>
          
          <h3>📞 Contact et support :</h3>
          <p>Pour toute question ou assistance, n'hésitez pas à nous contacter :</p>
          <ul>
            <li>Email : contact@rencontres-export.ma</li>
            <li>Téléphone : +212 5 22 123 456</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>© 2025 Rencontres Régionales EXPORT. Tous droits réservés.</p>
          <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

import { NextRequest, NextResponse } from 'next/server';
import { saveRegistration, checkEmailExists } from '../../../lib/registrationService';
import { initializeDatabase } from '../../../lib/database';
import { sendConfirmationEmail } from '../../../lib/emailService';

export async function POST(request: NextRequest) {
  try {
    // Initialize database tables if they don't exist
    await initializeDatabase();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'companyName', 'selectedActivities', 'companySize', 'address',
      'representativeName', 'position', 'email', 'phone', 'selectedEvent', 'acceptTerms'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Le champ ${field} est requis` },
          { status: 400 }
        );
      }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const emailExists = await checkEmailExists(body.email);
    if (emailExists) {
      return NextResponse.json(
        { error: 'Cette adresse email est déjà utilisée' },
        { status: 409 }
      );
    }
    
    // Validate selected activities
    if (!Array.isArray(body.selectedActivities) || body.selectedActivities.length === 0) {
      return NextResponse.json(
        { error: 'Veuillez sélectionner au moins une activité' },
        { status: 400 }
      );
    }
    
    if (body.selectedActivities.length > 3) {
      return NextResponse.json(
        { error: 'Maximum 3 activités autorisées' },
        { status: 400 }
      );
    }
    
    // Validate terms acceptance
    if (!body.acceptTerms) {
      return NextResponse.json(
        { error: 'Vous devez accepter les conditions d\'utilisation' },
        { status: 400 }
      );
    }
    
    // Save registration to database
    const savedRegistration = await saveRegistration({
      companyName: body.companyName,
      selectedActivities: body.selectedActivities,
      companySize: body.companySize,
      address: body.address,
      representativeName: body.representativeName,
      position: body.position,
      email: body.email,
      phone: body.phone,
      selectedEvent: body.selectedEvent,
      additionalInfo: body.additionalInfo || '',
      acceptTerms: body.acceptTerms
    });
    
    // Send confirmation email immediately
    try {
      const emailSent = await sendConfirmationEmail(savedRegistration);
      if (emailSent) {
        console.log('✅ Confirmation email sent successfully to:', savedRegistration.email);
      } else {
        console.log('⚠️ Failed to send confirmation email to:', savedRegistration.email);
      }
    } catch (emailError) {
      console.error('❌ Error sending confirmation email:', emailError);
      // Don't fail the registration if email fails
    }
    
    return NextResponse.json({
      success: true,
      message: 'Inscription enregistrée avec succès. Un email de confirmation a été envoyé.',
      registration: savedRegistration
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Initialize database tables if they don't exist
    await initializeDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'API de registration disponible'
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Erreur du serveur' },
      { status: 500 }
    );
  }
}

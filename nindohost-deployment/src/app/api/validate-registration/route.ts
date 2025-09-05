import { NextRequest, NextResponse } from 'next/server';
import { validateRegistration } from '../../../lib/registrationService';
import { sendValidationEmail } from '../../../lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationId } = body;
    
    if (!registrationId) {
      return NextResponse.json(
        { error: 'ID de registration requis' },
        { status: 400 }
      );
    }
    
    // Validate the registration
    const validatedRegistration = await validateRegistration(registrationId);
    
    // Send validation email
    const emailSent = await sendValidationEmail(validatedRegistration);
    
    return NextResponse.json({
      success: true,
      message: 'Inscription validée avec succès',
      registration: validatedRegistration,
      emailSent: emailSent
    });
    
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la validation' },
      { status: 500 }
    );
  }
}

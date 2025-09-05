import { NextRequest, NextResponse } from 'next/server';
import { getRegistrations } from '../../../lib/registrationService';
import { initializeDatabase } from '../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    // Initialize database tables if they don't exist
    await initializeDatabase();
    
    // Get all registrations
    const registrations = await getRegistrations();
    
    return NextResponse.json({
      success: true,
      registrations: registrations
    });
    
  } catch (error) {
    console.error('Fetch registrations error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des inscriptions' },
      { status: 500 }
    );
  }
}

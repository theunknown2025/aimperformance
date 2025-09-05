import pool from './database';
import { ActivityOption } from '../data/activityOptions';

export interface RegistrationData {
  companyName: string;
  selectedActivities: ActivityOption[];
  companySize: string;
  address: string;
  representativeName: string;
  position: string;
  email: string;
  phone: string;
  selectedEvent: string;
  additionalInfo: string;
  acceptTerms: boolean;
}

export interface SavedRegistration {
  id: number;
  companyName: string;
  companySize: string;
  address: string;
  representativeName: string;
  position: string;
  email: string;
  phone: string;
  selectedEvent: string;
  additionalInfo: string;
  acceptTerms: boolean;
  isValidated: boolean;
  validatedAt: Date | null;
  userPassword: string | null;
  createdAt: Date;
  activities: ActivityOption[];
}

export const saveRegistration = async (data: RegistrationData): Promise<SavedRegistration> => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Insert main registration data
    const [registrationResult] = await connection.execute(
      `INSERT INTO registrations (
        company_name, company_size, address, representative_name, 
        position, email, phone, selected_event, additional_info, accept_terms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.companyName,
        data.companySize,
        data.address,
        data.representativeName,
        data.position,
        data.email,
        data.phone,
        data.selectedEvent,
        data.additionalInfo,
        data.acceptTerms
      ]
    );
    
    const registrationId = (registrationResult as any).insertId;
    
    // Insert selected activities
    if (data.selectedActivities.length > 0) {
      const activityValues = data.selectedActivities.map(activity => [
        registrationId,
        activity.id,
        activity.label,
        activity.category
      ]);
      
      const activityPlaceholders = activityValues.map(() => '(?, ?, ?, ?)').join(', ');
      
      await connection.execute(
        `INSERT INTO registration_activities (
          registration_id, activity_id, activity_label, activity_category
        ) VALUES ${activityPlaceholders}`,
        activityValues.flat()
      );
    }
    
    await connection.commit();
    
    // Fetch the saved registration with activities
    const [savedRegistration] = await connection.execute(
      'SELECT * FROM registrations WHERE id = ?',
      [registrationId]
    );
    
    const [savedActivities] = await connection.execute(
      'SELECT activity_id, activity_label, activity_category FROM registration_activities WHERE registration_id = ?',
      [registrationId]
    );
    
    const registration = (savedRegistration as any[])[0];
    const activities = (savedActivities as any[]).map(activity => ({
      id: activity.activity_id,
      label: activity.activity_label,
      category: activity.activity_category
    }));
    
    return {
      id: registration.id,
      companyName: registration.company_name,
      companySize: registration.company_size,
      address: registration.address,
      representativeName: registration.representative_name,
      position: registration.position,
      email: registration.email,
      phone: registration.phone,
      selectedEvent: registration.selected_event,
      additionalInfo: registration.additional_info,
      acceptTerms: registration.accept_terms,
      createdAt: registration.created_at,
      activities
    };
    
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getRegistrations = async (): Promise<SavedRegistration[]> => {
  const connection = await pool.getConnection();
  
  try {
    const [registrations] = await connection.execute('SELECT * FROM registrations ORDER BY created_at DESC');
    const registrationsList = registrations as any[];
    
    const result: SavedRegistration[] = [];
    
    for (const registration of registrationsList) {
      const [activities] = await connection.execute(
        'SELECT activity_id, activity_label, activity_category FROM registration_activities WHERE registration_id = ?',
        [registration.id]
      );
      
      const activitiesList = (activities as any[]).map(activity => ({
        id: activity.activity_id,
        label: activity.activity_label,
        category: activity.activity_category
      }));
      
             result.push({
         id: registration.id,
         companyName: registration.company_name,
         companySize: registration.company_size,
         address: registration.address,
         representativeName: registration.representative_name,
         position: registration.position,
         email: registration.email,
         phone: registration.phone,
         selectedEvent: registration.selected_event,
         additionalInfo: registration.additional_info,
         acceptTerms: registration.accept_terms,
         isValidated: registration.is_validated,
         validatedAt: registration.validated_at,
         userPassword: registration.user_password,
         createdAt: registration.created_at,
         activities: activitiesList
       });
    }
    
    return result;
  } finally {
    connection.release();
  }
};

export const getRegistrationById = async (id: number): Promise<SavedRegistration | null> => {
  const connection = await pool.getConnection();
  
  try {
    const [registrations] = await connection.execute(
      'SELECT * FROM registrations WHERE id = ?',
      [id]
    );
    
    if ((registrations as any[]).length === 0) {
      return null;
    }
    
    const registration = (registrations as any[])[0];
    
    const [activities] = await connection.execute(
      'SELECT activity_id, activity_label, activity_category FROM registration_activities WHERE registration_id = ?',
      [id]
    );
    
    const activitiesList = (activities as any[]).map(activity => ({
      id: activity.activity_id,
      label: activity.activity_label,
      category: activity.activity_category
    }));
    
    return {
      id: registration.id,
      companyName: registration.company_name,
      companySize: registration.company_size,
      address: registration.address,
      representativeName: registration.representative_name,
      position: registration.position,
      email: registration.email,
      phone: registration.phone,
      selectedEvent: registration.selected_event,
      additionalInfo: registration.additional_info,
      acceptTerms: registration.accept_terms,
      createdAt: registration.created_at,
      activities: activitiesList
    };
  } finally {
    connection.release();
  }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  const connection = await pool.getConnection();
  
  try {
    const [result] = await connection.execute(
      'SELECT COUNT(*) as count FROM registrations WHERE email = ?',
      [email]
    );
    
    return (result as any[])[0].count > 0;
  } finally {
    connection.release();
  }
};

export const validateRegistration = async (id: number): Promise<SavedRegistration> => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Generate a random password
    const password = generatePassword();
    
    // Update registration to validated
    await connection.execute(
      `UPDATE registrations 
       SET is_validated = TRUE, validated_at = NOW(), user_password = ? 
       WHERE id = ?`,
      [password, id]
    );
    
    // Fetch the updated registration
    const [registrations] = await connection.execute(
      'SELECT * FROM registrations WHERE id = ?',
      [id]
    );
    
    if ((registrations as any[]).length === 0) {
      throw new Error('Registration not found');
    }
    
    const registration = (registrations as any[])[0];
    
    // Fetch activities
    const [activities] = await connection.execute(
      'SELECT activity_id, activity_label, activity_category FROM registration_activities WHERE registration_id = ?',
      [id]
    );
    
    const activitiesList = (activities as any[]).map(activity => ({
      id: activity.activity_id,
      label: activity.activity_label,
      category: activity.activity_category
    }));
    
    await connection.commit();
    
    return {
      id: registration.id,
      companyName: registration.company_name,
      companySize: registration.company_size,
      address: registration.address,
      representativeName: registration.representative_name,
      position: registration.position,
      email: registration.email,
      phone: registration.phone,
      selectedEvent: registration.selected_event,
      additionalInfo: registration.additional_info,
      acceptTerms: registration.accept_terms,
      isValidated: registration.is_validated,
      validatedAt: registration.validated_at,
      userPassword: registration.user_password,
      createdAt: registration.created_at,
      activities: activitiesList
    };
    
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const authenticateUser = async (email: string, password: string): Promise<SavedRegistration | null> => {
  const connection = await pool.getConnection();
  
  try {
    const [registrations] = await connection.execute(
      'SELECT * FROM registrations WHERE email = ? AND user_password = ? AND is_validated = TRUE',
      [email, password]
    );
    
    if ((registrations as any[]).length === 0) {
      return null;
    }
    
    const registration = (registrations as any[])[0];
    
    // Fetch activities
    const [activities] = await connection.execute(
      'SELECT activity_id, activity_label, activity_category FROM registration_activities WHERE registration_id = ?',
      [registration.id]
    );
    
    const activitiesList = (activities as any[]).map(activity => ({
      id: activity.activity_id,
      label: activity.activity_label,
      category: activity.activity_category
    }));
    
    return {
      id: registration.id,
      companyName: registration.company_name,
      companySize: registration.company_size,
      address: registration.address,
      representativeName: registration.representative_name,
      position: registration.position,
      email: registration.email,
      phone: registration.phone,
      selectedEvent: registration.selected_event,
      additionalInfo: registration.additional_info,
      acceptTerms: registration.accept_terms,
      isValidated: registration.is_validated,
      validatedAt: registration.validated_at,
      userPassword: registration.user_password,
      createdAt: registration.created_at,
      activities: activitiesList
    };
    
  } finally {
    connection.release();
  }
};

// Generate a random password with letters, numbers, and symbols
const generatePassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

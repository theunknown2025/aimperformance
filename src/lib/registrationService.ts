import { SupabaseDatabase, supabase } from './supabase';
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
  try {
    // Insert main registration data using Supabase
    const registrationData = {
      company_name: data.companyName,
      company_size: data.companySize,
      address: data.address,
      representative_name: data.representativeName,
      position: data.position,
      email: data.email,
      phone: data.phone,
      selected_event: data.selectedEvent,
      additional_info: data.additionalInfo,
      accept_terms: data.acceptTerms,
      is_validated: false,
      user_password: null
    };

    const registration = await SupabaseDatabase.createRegistration(registrationData);
    
    // Insert selected activities
    if (data.selectedActivities.length > 0) {
      for (const activity of data.selectedActivities) {
        await SupabaseDatabase.addRegistrationActivity({
          registration_id: registration.id,
          activity_id: activity.id,
          activity_label: activity.label,
          activity_category: activity.category
        });
      }
    }
    
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
      activities: data.selectedActivities
    };
    
  } catch (error) {
    throw error;
  }
};

export const getRegistrations = async (): Promise<SavedRegistration[]> => {
  try {
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select(`
        *,
        registration_activities(activity_id, activity_label, activity_category)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return registrations.map(registration => ({
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
      activities: registration.registration_activities.map(activity => ({
        id: activity.activity_id,
        label: activity.activity_label,
        category: activity.activity_category
      }))
    }));
  } catch (error) {
    throw error;
  }
};

export const getRegistrationById = async (id: number): Promise<SavedRegistration | null> => {
  try {
    const { data: registration, error } = await supabase
      .from('registrations')
      .select(`
        *,
        registration_activities(activity_id, activity_label, activity_category)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
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
      activities: registration.registration_activities.map(activity => ({
        id: activity.activity_id,
        label: activity.activity_label,
        category: activity.activity_category
      }))
    };
  } catch (error) {
    throw error;
  }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('id')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error) {
    throw error;
  }
};

export const validateRegistration = async (id: number): Promise<SavedRegistration> => {
  try {
    // Generate a random password
    const password = generatePassword();
    
    // Update registration to validated using Supabase
    const validatedRegistration = await SupabaseDatabase.validateRegistration(id);
    
    // Update the password
    const { data: updatedRegistration, error } = await supabase
      .from('registrations')
      .update({ user_password: password })
      .eq('id', id)
      .select(`
        *,
        registration_activities(activity_id, activity_label, activity_category)
      `)
      .single();
    
    if (error) throw error;
    
    return {
      id: updatedRegistration.id,
      companyName: updatedRegistration.company_name,
      companySize: updatedRegistration.company_size,
      address: updatedRegistration.address,
      representativeName: updatedRegistration.representative_name,
      position: updatedRegistration.position,
      email: updatedRegistration.email,
      phone: updatedRegistration.phone,
      selectedEvent: updatedRegistration.selected_event,
      additionalInfo: updatedRegistration.additional_info,
      acceptTerms: updatedRegistration.accept_terms,
      isValidated: updatedRegistration.is_validated,
      validatedAt: updatedRegistration.validated_at,
      userPassword: updatedRegistration.user_password,
      createdAt: updatedRegistration.created_at,
      activities: updatedRegistration.registration_activities.map(activity => ({
        id: activity.activity_id,
        label: activity.activity_label,
        category: activity.activity_category
      }))
    };
    
  } catch (error) {
    throw error;
  }
};

export const authenticateUser = async (email: string, password: string): Promise<SavedRegistration | null> => {
  try {
    const { data: registration, error } = await supabase
      .from('registrations')
      .select(`
        *,
        registration_activities(activity_id, activity_label, activity_category)
      `)
      .eq('email', email)
      .eq('user_password', password)
      .eq('is_validated', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
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
      activities: registration.registration_activities.map(activity => ({
        id: activity.activity_id,
        label: activity.activity_label,
        category: activity.activity_category
      }))
    };
    
  } catch (error) {
    throw error;
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

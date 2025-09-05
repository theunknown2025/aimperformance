import { SupabaseDatabase, supabase } from '../supabase';

export interface User {
  id: number;
  representative_name: string;
  email: string;
  company_name: string;
  is_validated: boolean;
  created_at: string;
  activities?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  representative_name: string;
  email: string;
  company_name: string;
  phone: string;
  activities: number[];
  password: string;
}

export class AuthService {
  /**
   * Authenticate user with email and password
   */
  static async login(credentials: LoginCredentials): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          id,
          representative_name,
          email,
          company_name,
          is_validated,
          created_at,
          password
        `)
        .eq('email', credentials.email)
        .eq('password', credentials.password)
        .eq('is_validated', true)
        .single();

      if (error || !data) {
        console.error('Login error:', error);
        return null;
      }

      // Get user activities
      const { data: activities } = await supabase
        .from('registration_activities')
        .select(`
          activity_options (
            label
          )
        `)
        .eq('registration_id', data.id);

      return {
        id: data.id,
        representative_name: data.representative_name,
        email: data.email,
        company_name: data.company_name,
        is_validated: data.is_validated,
        created_at: data.created_at,
        activities: activities?.map(a => a.activity_options?.label) || []
      };
    } catch (error) {
      console.error('Login service error:', error);
      return null;
    }
  }

  /**
   * Register a new user
   */
  static async register(data: RegistrationData): Promise<{ success: boolean; id?: number; error?: string }> {
    try {
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('registrations')
        .select('id')
        .eq('email', data.email)
        .single();

      if (existingUser) {
        return { success: false, error: 'Email already exists' };
      }

      // Insert new registration
      const { data: registration, error: regError } = await supabase
        .from('registrations')
        .insert({
          representative_name: data.representative_name,
          email: data.email,
          company_name: data.company_name,
          phone: data.phone,
          password: data.password,
          is_validated: false
        })
        .select('id')
        .single();

      if (regError || !registration) {
        console.error('Registration error:', regError);
        return { success: false, error: 'Failed to create registration' };
      }

      // Insert activities
      if (data.activities.length > 0) {
        const activityInserts = data.activities.map(activityId => ({
          registration_id: registration.id,
          activity_id: activityId
        }));

        const { error: activityError } = await supabase
          .from('registration_activities')
          .insert(activityInserts);

        if (activityError) {
          console.error('Activity insertion error:', activityError);
          // Don't fail registration if activities fail
        }
      }

      return { success: true, id: registration.id };
    } catch (error) {
      console.error('Registration service error:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Validate a registration (admin function)
   */
  static async validateRegistration(id: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ is_validated: true })
        .eq('id', id);

      if (error) {
        console.error('Validation error:', error);
        return { success: false, error: 'Failed to validate registration' };
      }

      return { success: true };
    } catch (error) {
      console.error('Validation service error:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get all registrations (admin function)
   */
  static async getAllRegistrations(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          id,
          representative_name,
          email,
          company_name,
          is_validated,
          created_at,
          registration_activities (
            activity_options (
              label
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get registrations error:', error);
        return [];
      }

      return data.map(reg => ({
        id: reg.id,
        representative_name: reg.representative_name,
        email: reg.email,
        company_name: reg.company_name,
        is_validated: reg.is_validated,
        created_at: reg.created_at,
        activities: reg.registration_activities?.map(a => a.activity_options?.label) || []
      }));
    } catch (error) {
      console.error('Get registrations service error:', error);
      return [];
    }
  }

  /**
   * Get registration by ID
   */
  static async getRegistrationById(id: number): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          id,
          representative_name,
          email,
          company_name,
          is_validated,
          created_at,
          registration_activities (
            activity_options (
              label
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Get registration error:', error);
        return null;
      }

      return {
        id: data.id,
        representative_name: data.representative_name,
        email: data.email,
        company_name: data.company_name,
        is_validated: data.is_validated,
        created_at: data.created_at,
        activities: data.registration_activities?.map(a => a.activity_options?.label) || []
      };
    } catch (error) {
      console.error('Get registration service error:', error);
      return null;
    }
  }

  /**
   * Check if email exists
   */
  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('id')
        .eq('email', email)
        .single();

      return !error && !!data;
    } catch (error) {
      console.error('Check email service error:', error);
      return false;
    }
  }
}

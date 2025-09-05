// Import Supabase client instead of MySQL
import { supabase, SupabaseDatabase } from './supabase';

// Legacy MySQL configuration (kept for reference during migration)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aim3_registrations',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool (legacy - will be removed after migration)
// const pool = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('id')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    console.log('Supabase connected successfully');
    return true;
  } catch (error) {
    console.error('Supabase connection failed:', error);
    return false;
  }
};

// Initialize database tables (Supabase version)
export const initializeDatabase = async () => {
  try {
    // Test connection first
    const { data, error } = await supabase
      .from('registrations')
      .select('id')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    console.log('Supabase database initialized successfully');
    console.log('Tables should be created via Supabase Dashboard or migrations');
    return true;
  } catch (error) {
    console.error('Supabase initialization failed:', error);
    console.log('Please ensure tables are created in Supabase Dashboard');
    return false;
  }
};

// Legacy function - now returns Supabase client
export const getConnection = async () => {
  return supabase;
};

// Export Supabase client as default
export default supabase;

import mysql from 'mysql2/promise';

// Database configuration using environment variables
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

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Initialize database tables
export const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.query(`USE ${dbConfig.database}`);
    
         // Create registrations table
     const createRegistrationsTable = `
       CREATE TABLE IF NOT EXISTS registrations (
         id INT AUTO_INCREMENT PRIMARY KEY,
         company_name VARCHAR(255) NOT NULL,
         company_size VARCHAR(50) NOT NULL,
         address TEXT NOT NULL,
         representative_name VARCHAR(255) NOT NULL,
         position VARCHAR(255) NOT NULL,
         email VARCHAR(255) NOT NULL UNIQUE,
         phone VARCHAR(50) NOT NULL,
         selected_event VARCHAR(100) NOT NULL,
         additional_info TEXT,
         accept_terms BOOLEAN NOT NULL DEFAULT FALSE,
         is_validated BOOLEAN NOT NULL DEFAULT FALSE,
         validated_at TIMESTAMP NULL,
         user_password VARCHAR(255) NULL,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
       )
     `;
    
    // Create activities table
    const createActivitiesTable = `
      CREATE TABLE IF NOT EXISTS registration_activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        registration_id INT NOT NULL,
        activity_id VARCHAR(100) NOT NULL,
        activity_label VARCHAR(255) NOT NULL,
        activity_category VARCHAR(100) NOT NULL,
        FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE
      )
    `;
    
    await connection.execute(createRegistrationsTable);
    await connection.execute(createActivitiesTable);
    
    console.log('Database tables created successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
};

// Get connection from pool
export const getConnection = async () => {
  return await pool.getConnection();
};

export default pool;

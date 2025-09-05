const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.supabase' });

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://tcmmloypcovltgciocdm.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required in .env.supabase');
  console.log('Please add your service role key to .env.supabase file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  try {
    console.log('🚀 Creating Supabase tables for AIM3 project...');
    console.log('================================================');
    
    // Test connection first
    console.log('📡 Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .limit(1);
    
    if (testError) {
      throw new Error(`Connection failed: ${testError.message}`);
    }
    console.log('✅ Supabase connection successful!');
    
    // Create registrations table
    console.log('📊 Creating registrations table...');
    const { error: regError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS registrations (
          id SERIAL PRIMARY KEY,
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
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    });
    
    if (regError) {
      console.log('⚠️  Using alternative method for registrations table...');
      // Alternative: Use direct SQL execution
      const { error: altError } = await supabase
        .from('registrations')
        .select('id')
        .limit(1);
      
      if (altError && altError.code === 'PGRST116') {
        console.log('📝 Table registrations does not exist, creating...');
        // We'll need to use the Supabase dashboard for table creation
        console.log('❌ Cannot create tables programmatically with current setup.');
        console.log('📋 Please use the Supabase Dashboard to create tables.');
        console.log('');
        console.log('🔗 Go to: https://supabase.com/dashboard/project/tcmmloypcovltgciocdm/sql');
        console.log('📄 Copy and paste the contents of setup-supabase-tables.sql');
        console.log('');
        return;
      }
    } else {
      console.log('✅ Registrations table created successfully!');
    }
    
    // Since we can't create tables programmatically with the current setup,
    // let's provide instructions
    console.log('');
    console.log('📋 MANUAL TABLE CREATION REQUIRED');
    console.log('==================================');
    console.log('');
    console.log('Due to Supabase security policies, tables must be created manually.');
    console.log('Please follow these steps:');
    console.log('');
    console.log('1. Go to Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/tcmmloypcovltgciocdm/sql');
    console.log('');
    console.log('2. Copy the contents of setup-supabase-tables.sql');
    console.log('');
    console.log('3. Paste and run the SQL script');
    console.log('');
    console.log('4. Verify tables are created in the Table Editor:');
    console.log('   https://supabase.com/dashboard/project/tcmmloypcovltgciocdm/editor');
    console.log('');
    
    // Let's check what tables already exist
    console.log('🔍 Checking existing tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (!tablesError && tables) {
      console.log('📋 Existing tables:');
      tables.forEach(table => {
        console.log(`   - ${table.table_name}`);
      });
    }
    
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('1. Create tables using Supabase Dashboard');
    console.log('2. Run: npm run migrate-to-supabase (if you have existing data)');
    console.log('3. Update your application to use Supabase');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
    console.log('📋 Alternative approach:');
    console.log('1. Go to: https://supabase.com/dashboard/project/tcmmloypcovltgciocdm/sql');
    console.log('2. Copy contents of setup-supabase-tables.sql');
    console.log('3. Paste and execute the SQL');
  }
}

// Run the table creation
createTables();

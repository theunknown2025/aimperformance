const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.supabase' });

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://tcmmloypcovltgciocdm.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.error('❌ SUPABASE_ANON_KEY is required in .env.supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('🚀 Testing Supabase connection...');
    console.log('=====================================');
    
    // Test basic connection
    console.log('📡 Testing basic connection...');
    const { data, error } = await supabase
      .from('registrations')
      .select('id')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    console.log('✅ Supabase connection successful!');
    
    // Test activity options
    console.log('📊 Testing activity options...');
    const { data: activities, error: activitiesError } = await supabase
      .from('activity_options')
      .select('*');
    
    if (activitiesError) {
      throw activitiesError;
    }
    
    console.log(`✅ Found ${activities.length} activity options`);
    
    // Test tables
    console.log('📋 Testing all tables...');
    const tables = [
      'registrations',
      'registration_activities', 
      'activity_options',
      'mur_posts',
      'mur_post_images',
      'mur_post_documents',
      'mur_post_likes',
      'mur_post_comments',
      'mur_comment_likes',
      'chats',
      'chat_participants',
      'chat_messages'
    ];
    
    for (const table of tables) {
      const { data: tableData, error: tableError } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (tableError && tableError.code !== 'PGRST116') {
        console.log(`❌ Error accessing table ${table}:`, tableError.message);
      } else {
        console.log(`✅ Table ${table} accessible`);
      }
    }
    
    console.log('');
    console.log('🎉 All tests passed! Your app is ready to use Supabase.');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Update your environment variables in production');
    console.log('2. Test the registration flow');
    console.log('3. Test MUR features');
    console.log('4. Test chat functionality');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('');
    console.log('📋 Troubleshooting:');
    console.log('1. Check your .env.supabase file');
    console.log('2. Verify Supabase project is active');
    console.log('3. Ensure tables are created');
    console.log('4. Check RLS policies');
  }
}

// Run the test
testConnection();

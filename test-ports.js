// Test different ports with aim-event.com
const mysql = require('mysql2/promise');

const ports = [3306, 3307, 3308, 1433, 5432];

async function testPort(port) {
  console.log(`\n🔍 Testing aim-event.com:${port}`);
  
  const config = {
    host: 'aim-event.com',
    user: 'aimevent_admin',
    password: 'badBOY@2010',
    database: 'aimevent_aim3_registrations',
    port: port,
    connectTimeout: 5000
  };
  
  try {
    const connection = await mysql.createConnection(config);
    console.log(`✅ SUCCESS: Port ${port} works!`);
    
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`📋 Tables: ${tables.map(t => Object.values(t)[0]).join(', ')}`);
    
    await connection.end();
    return port;
    
  } catch (error) {
    console.log(`❌ Port ${port}: ${error.code} - ${error.message}`);
    return null;
  }
}

async function testAllPorts() {
  console.log('🧪 Testing different ports with aim-event.com...');
  
  for (const port of ports) {
    const workingPort = await testPort(port);
    if (workingPort) {
      console.log(`\n🎉 FOUND WORKING CONFIG: aim-event.com:${workingPort}`);
      return workingPort;
    }
  }
  
  console.log('\n❌ No working port found.');
  console.log('💡 The issue might be:');
  console.log('1. Remote access not properly enabled');
  console.log('2. Firewall blocking connections');
  console.log('3. Different host format needed');
  
  return null;
}

testAllPorts();

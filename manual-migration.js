const { Client } = require('pg');

async function migrateDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'admin',
    database: 'blogdb'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // First, delete users with NULL email
    const deleteResult = await client.query('DELETE FROM users WHERE email IS NULL');
    console.log(`Deleted ${deleteResult.rowCount} users with NULL email`);

    // Then, add the role column if it doesn't exist
    try {
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user'
      `);
      console.log('Added role column to users table');
    } catch (error) {
      console.log('Role column might already exist:', error.message);
    }

    // Update any existing users to have 'user' role
    const updateResult = await client.query(`
      UPDATE users 
      SET role = 'user' 
      WHERE role IS NULL OR role = ''
    `);
    console.log(`Updated ${updateResult.rowCount} users with default role`);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.end();
  }
}

migrateDatabase();
const { Client } = require('pg');

async function addIsActiveColumn() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'admin',
    database: 'blogdb'
  });

  try {
    await client.connect();
    console.log('Conectado a la base de datos');

    // Verificar si la columna ya existe
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'categories' AND column_name = 'isactive'
    `);

    if (checkColumn.rows.length > 0) {
      console.log('La columna isActive ya existe');
      return;
    }

    // Agregar la columna isActive
    await client.query(`
      ALTER TABLE categories 
      ADD COLUMN "isActive" BOOLEAN DEFAULT true
    `);
    
    console.log('Columna isActive agregada exitosamente');
    
    // Verificar que se agregó correctamente
    const verify = await client.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'categories' AND column_name = 'isActive'
    `);
    
    console.log('Columna verificada:', verify.rows[0]);

  } catch (error) {
    console.error('Error al agregar la columna:', error);
  } finally {
    await client.end();
  }
}

addIsActiveColumn();
const { Pool } = require('pg');

const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'budgetapp',
    password: '0912',
    port: 5432,
});

const createTables = async () => {
  const queries = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL,
        balance NUMERIC(12, 2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS budget_categories (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(50) NOT NULL,
        balance NUMERIC(12, 2) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        account_id INT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
        category_id INT REFERENCES budget_categories(id) ON DELETE SET NULL,
        transaction_type VARCHAR(50) NOT NULL,
        amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
        description TEXT,
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transfers (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        account_id_source INT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
        account_id_destination INT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
        amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
        description TEXT,
        transfer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;


  try {
    await pool.query(queries);
    console.log('Tables created successfully.');
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    await pool.end();
  }
};

createTables();

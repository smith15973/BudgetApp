const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'budgetapp',
  password: '0912',
  port: 5432,
})

module.exports.getTransfers = (req, res) => {
    const query = `
      SELECT
        transfers.*,
      aSource.name as account_source_name,
      aDest.name as account_destination_name
      FROM transfers
      JOIN accounts aSource 
      ON transfers.account_id_source = aSource.id
      JOIN accounts aDest 
      ON transfers.account_id_destination = aDest.id
      ORDER BY transfer_date ASC;
    `;
  
    pool.query(query, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
  
      return res.status(200).json(results.rows);
    });
  }
  
  
  
  
  
  
  
  module.exports.addTransfer = async (req, res) => {
    const { transfer_date, account_id_source, account_id_destination, amount, description, user_id } = req.body
  
    if (!transfer_date || !account_id_source || !account_id_destination || !amount || !description || !user_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
  
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      const insertTransferQuery = `
           INSERT INTO transfers (transfer_date, account_id_source, account_id_destination, amount, description, user_id)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id`;
  
      await client.query(insertTransferQuery, [transfer_date, account_id_source, account_id_destination, amount, description, user_id]);
  
  
      // Update balances
      const updateSourceAccountQuery = `UPDATE accounts SET balance = balance - $1 WHERE id = $2`
      const updateDestinationBalancesQuery = `UPDATE accounts SET balance = balance + $1 WHERE id = $2`;
  
      await client.query(updateSourceAccountQuery, [amount, account_id_source]);
      await client.query(updateDestinationBalancesQuery, [amount, account_id_destination]);
  
      await client.query('COMMIT');
  
      await client.query('COMMIT');
      res.status(201).send(`Transfer Added Successfully`);
  
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction rolled back due to error:', error);
    } finally {
      // Release the client back to the pool
      client.release();
    }
  
  }
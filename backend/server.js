const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')


const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(cors());

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'budgetapp',
  password: '0912',
  port: 5432,
})


const getCategories = (req, res) => {
  pool.query('SELECT * FROM budget_categories ORDER BY name ASC', (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message })
    }
    res.status(200).json(results.rows)
  })
}
const getAccounts = (req, res) => {
  pool.query('SELECT * FROM accounts ORDER BY name ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

// const getTransactions = (req, res) => {
//   pool.query('Select * FROM transactions ORDER BY transaction_date ASC', (error, results) => {
//     if (error) {
//       throw error
//     }
//     res.status(200).json(results.rows);
//   })
// }
const getTransactions = (req, res) => {
  const query = `
    SELECT
	  transactions.*,
    a.name as account_name,
    bc.name as category_name
    FROM transactions
    JOIN accounts a 
    ON transactions.account_id = a.id
    JOIN budget_categories bc 
    ON transactions.category_id = bc.id
    ORDER BY transaction_date ASC;
  `;

  pool.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
    }
    res.status(200).json(results.rows);
  });
}

const getTransfers = (req, res) => {
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





const addTransaction = async (req, res) => {
  const { transaction_date, account_id, transaction_type, amount, category_id, description, user_id } = req.body

  if (!transaction_date || !account_id || !transaction_type || !amount || !category_id || !description || !user_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }


  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const insertTransactionQuery = `
         INSERT INTO transactions (transaction_date, account_id, transaction_type, amount, category_id, description, user_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`;

    await client.query(insertTransactionQuery, [transaction_date, account_id, transaction_type, amount, category_id, description, user_id]);


    // Update balances
    let updateAccountBalancesQuery;
    let updateCategoriesBalancesQuery;
    if (transaction_type === "Spending") {
      updateCategoriesBalancesQuery = `UPDATE budget_categories SET balance = balance - $1 WHERE id = $2`;
      updateAccountBalancesQuery = `UPDATE accounts SET balance = balance - $1 WHERE id = $2`;
    }
    else if (transaction_type === "Income") {
      updateCategoriesBalancesQuery = `UPDATE budget_categories SET balance = balance + $1 WHERE id = $2`;
      updateAccountBalancesQuery = `UPDATE accounts SET balance = balance + $1 WHERE id = $2`;
    }


    await client.query(updateAccountBalancesQuery, [amount, account_id])
    await client.query(updateCategoriesBalancesQuery, [amount, category_id])

    await client.query('COMMIT');

    await client.query('COMMIT');
    res.status(201).send(`Transaction Added Successfully`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transaction rolled back due to error:', error);
  } finally {
    // Release the client back to the pool
    client.release();
  }

}

const deleteTransaction = async (req, res) => {
  const { transaction_id } = req.body;

  if (!transaction_id) {
    return res.status(400).json({ error: 'Transaction ID is required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const transactionQueryResult = await client.query('SELECT amount, transaction_type, acount_id, category_id FROM transactions WHERE id = $1'[transaction_id]);

    if (transactionQueryResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const { amount, transaction_type, account_id, category_id } = transactionQueryResult.rows[0];

    // reverse category and account balances
    if (transaction_type === 'Spending') {
      await client.query(`UPDATE budget_categories SET balance = balance + $1 WHERE id = $2`, [amount, category_id]);
      await client.query(`UPDATE accounts SET balance = balance + $1 WHERE id = $2`, [amount, account_id]);
    } else {
      await client.query(`UPDATE budget_categories SET balance = balance - $1 WHERE id = $2`, [amount, category_id]);
      await client.query(`UPDATE accounts SET balance = balance - $1 WHERE id = $2`, [amount, account_id]);
    }

    // Delete the transaction
    await client.query(`DELETE FROM transactions WHERE id = $1`, [transaction_id]);

    await client.query('COMMIT');
    res.status(200).json({ message: 'Transaction deleted successfully' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to delete transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction: ' + error.message });
  } finally {
    client.release();
  }



}

const addTransfer = async (req, res) => {
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





app.get('/budget_categories', getCategories)
app.get('/accounts', getAccounts)
app.get('/transactions', getTransactions)
app.post('/transactions', addTransaction)
app.get('/transfers', getTransfers)
app.post('/transfers', addTransfer)






app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`)
})


const Pool = require('pg').Pool
const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'budgetapp',
    password: '0912',
    port: 5432,
})

module.exports.getTransactions = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(`
            SELECT
                transactions.*,
                a.name as account_name
            FROM transactions
            JOIN accounts a 
            ON transactions.account_id = a.id
            ORDER BY transaction_date ASC;
        `);

        

        for (let i = 0; i < result.rows.length; i++) {
            const rowResult = await client.query(`
                SELECT 
                    amount, c.name as category_name
                FROM transaction_categories
                JOIN budget_categories c
                ON transaction_categories.category_id = c.id
                WHERE transaction_categories.transaction_id = $1
            `, [result.rows[i].id]);

            result.rows[i].categories = rowResult.rows;
            console.log(rowResult.rows)
        }
        await client.query('COMMIT');

        console.log(result.rows)
        
        // return res.status(200).json("hi");
        return res.status(200).json(result.rows);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Failed to get transactions:', error);
        res.status(500).json({ error: 'Failed to get transactions: ' + error.message });
    } finally {
        client.release();
    }
}

module.exports.addTransaction = async (req, res) => {
    const { transaction_date, account_id, transaction_type, transaction_categories, description, user_id } = req.body

    console.log(req.body)

    if (!transaction_date || !account_id || !transaction_type || !transaction_categories || !description || !user_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const insertTransactionQuery = `
           INSERT INTO transactions (transaction_date, account_id, transaction_type, description, user_id)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id`;

        const result = await client.query(insertTransactionQuery, [transaction_date, account_id, transaction_type, description, user_id]);
        const transaction_id = result.rows[0].id;

        let total = 0;
        for (let category of transaction_categories) {
            await client.query(
                `INSERT INTO transaction_categories (transaction_id, category_id, amount)
            VALUES ($1, $2, $3)`, [transaction_id, category.category_id, category.amount])

            if (transaction_type === "Spending") {
                await client.query(`UPDATE budget_categories SET balance = balance - $1 WHERE id = $2`, [category.amount, category.category_id])
            }
            else if (transaction_type === "Income") {
                await client.query(`UPDATE budget_categories SET balance = balance + $1 WHERE id = $2`, [category.amount, category.category_id])
            }
            total += category.amount;

        }


        // Update balances
        let updateAccountBalancesQuery;
        if (transaction_type === "Spending") {
            updateAccountBalancesQuery = `UPDATE accounts SET balance = balance - $1 WHERE id = $2`;
        }
        else if (transaction_type === "Income") {
            updateAccountBalancesQuery = `UPDATE accounts SET balance = balance + $1 WHERE id = $2`;
        }


        await client.query(updateAccountBalancesQuery, [total.toFixed(2), account_id])


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

module.exports.deleteTransaction = async (req, res) => {
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
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'budgetapp',
  password: '0912',
  port: 5432,
})



module.exports.getAccounts = (req, res) => {
  pool.query('SELECT * FROM accounts ORDER BY name ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

module.exports.addAccount = async (req, res) => {
  const { name, type, startingBalance } = req.body;
  console.log(name, type, startingBalance)

  try {
    const result = await pool.query('INSERT INTO accounts (name, type, balance, user_id) VALUES ($1, $2, $3, $4) RETURNING id', [name, type, startingBalance, 1]);
    res.status(200).json({ message: `Account "${name}" created successfully`, id: result.rows[0].id });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
}
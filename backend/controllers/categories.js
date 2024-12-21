const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'budgetapp',
  password: '0912',
  port: 5432,
})


module.exports.getCategories = (req, res) => {
  pool.query('SELECT * FROM budget_categories ORDER BY name ASC', (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message })
    }
    res.status(200).json(results.rows)
  })
}


module.exports.addCategory = async (req, res) => {
  const { name, startingBalance } = req.body;

  try {
    const result = await pool.query('INSERT INTO budget_categories (name, balance, user_id) VALUES ($1, $2, $3) RETURNING id', [name, startingBalance, 1]);
    res.status(200).json({ message: `Category "${name}" created successfully`, id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
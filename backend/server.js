const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const { getTransactions, addTransaction, deleteTransaction, updateTransaction } = require('./controllers/transactions');
const { getCategories, addCategory } = require('./controllers/categories');
const { getAccounts, addAccount } = require('./controllers/accounts');
const { getTransfers, addTransfer } = require('./controllers/transfers');



const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(cors());


app.get('/budget_categories', getCategories)
app.post('/budget_categories', addCategory)
app.get('/accounts', getAccounts)
app.post('/accounts', addAccount)
app.get('/transactions', getTransactions)
app.post('/transactions', addTransaction)
app.put('/transactions/:id', updateTransaction)
app.get('/transfers', getTransfers)
app.post('/transfers', addTransfer)






app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`)
})


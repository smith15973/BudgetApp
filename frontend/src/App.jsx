import './App.css'
import NewTransModal from './components/transactions/NewTransModal';
import axios from 'axios'
import { useState, useEffect } from 'react';
import Transactions from './components/transactions/Transactions';
import BudgetCategories from './components/categories/BudgetCategories';
import Accounts from './components/accounts/Accounts';
import { Box } from '@mui/material';

function App() {

  const [transactions, setTransactions] = useState([]);
  const [transfers, setTransfers] = useState([]);

  const getTransactions = async () => {
    const response = await axios.get("http://localhost:3000/transactions");
    setTransactions(response.data);

  }
  const getTransfers = async () => {
    const response = await axios.get("http://localhost:3000/transfers");
    setTransfers(response.data);
  }

  const [categories, setCategories] = useState([]);

  const getBudgetCategories = async () => {
    const response = await axios.get('http://localhost:3000/budget_categories');
    setCategories(response.data)
  }

  const [accounts, setAccounts] = useState([]);

  const getAccounts = async () => {
    const response = await axios.get('http://localhost:3000/accounts');
    setAccounts(response.data)
  }

  const loadData = () => {
    getTransactions();
    getTransfers();
    getBudgetCategories();
    getAccounts();
  }

  useEffect(loadData, [])

  const openTransaction = (transaction_id) => {
    console.log(`OPENING TRANSACTION ${transaction_id}!`)
  }

  return (
    <>
      <Box sx={{display: 'flex',}}>
        <Box sx={{ maxWidth: '50%', mr: 20 }}>
          <NewTransModal updateTransactionsList={loadData} updateTransfersList={loadData} />
          <Transactions transactions={transactions} handleRowClick={openTransaction} onTransactionUpdate={getTransactions} />
        </Box>


        <Box sx={{ display: "flex",}}>
          <BudgetCategories categories={categories} />
          <Accounts accounts={accounts} />
        </Box>
      </Box>

    </>
  )
}

export default App

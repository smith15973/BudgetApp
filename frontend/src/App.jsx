import './App.css'
import NewTransModal from './components/transactions/NewTransModal';
import axios from 'axios'
import { useState, useEffect } from 'react';
import Transactions from './components/transactions/Transactions';
import BudgetCategories from './components/categories/BudgetCategories';
import Accounts from './components/accounts/Accounts';

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
    console.log(response.data)
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

  return (
    <>

      <NewTransModal updateTransactionsList={loadData} updateTransfersList={loadData} />
      <div style={{ display: "flex", gap: 20, flexDirection: 'row' }}>
        <Transactions transactions={transactions} />
        <div style={{ display: "flex", gap: 200 }}>
          <BudgetCategories categories={categories} />
          <Accounts accounts={accounts} />
        </div>
      </div>
    </>
  )
}

export default App

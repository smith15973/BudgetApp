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

  useEffect(() => {
    getTransactions();
    getTransfers();
  }, [])

  return (
    <>

      <NewTransModal updateTransactionsList={getTransactions} updateTransfersList={getTransfers} />
      <div style={{ display: "flex", gap: 20, flexDirection: 'row' }}>
        <Transactions transactions={transactions} />
        <div style={{ display: "flex", gap: 200 }}>
          <BudgetCategories />
          <Accounts />
        </div>
      </div>
    </>
  )
}

export default App

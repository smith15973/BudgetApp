import axios from 'axios'
import { useEffect, useState } from 'react'


export default function NewTransaction({ updateTransactionsList, handleClose }) {

    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);

    async function getAccounts() {
        const response = await axios.get("http://localhost:3000/accounts");
        setAccounts(response.data)
    }
    async function getCategories() {
        const response = await axios.get("http://localhost:3000/budget_categories");
        setCategories(response.data)
    }

    useEffect(() => {
        getAccounts();
        getCategories();
    }, [])


    const [transactionForm, setTransactionForm] = useState({ transaction_date: new Date().toISOString().split('T')[0], account_id: 0, category_id: 0, transaction_type: "", user_id: 1, description: "", amount: "" })

    const handleTransactionFormChange = (key, value) => {
        setTransactionForm({ ...transactionForm, [key]: value });
    }

    const handleSubmit = async () => {
        const response = await axios.post('http://localhost:3000/transactions', transactionForm)
        setTransactionForm({ transaction_date: new Date().toISOString().split('T')[0], account_id: 0, category_id: 0, transaction_type: "", user_id: 1, description: "", amount: "" })
        updateTransactionsList();
        handleClose();
    }

    return (
        <div>
            <input type="date" name="transaction_date" id="transaction_date"
                onChange={(e) => { handleTransactionFormChange(e.target.name, e.target.value) }}
                value={transactionForm.transaction_date}
            />

            <select
                id="accountSelect"
                name='account_id'
                value={transactionForm.account_id}
                onChange={(e) => { handleTransactionFormChange(e.target.name, e.target.value) }}
            >
                <option value="">Account</option>
                {accounts.map(account => {
                    return (
                        <option key={account.id} value={account.id}>{account.name}</option>
                    )
                })}
            </select>
            <select name="transaction_type" id="transaction_type"
                onChange={(e) => { handleTransactionFormChange(e.target.name, e.target.value) }}
                value={transactionForm.transaction_type}
            >
                <option value="">Transaction Type</option>
                <option value="Spending">Spending</option>
                <option value="Income">Income</option>
                <option value="Transfer">Transfer</option>
            </select>
            <input
                type="number"
                step="0.01"
                min="0"
                placeholder='Amount'
                name="amount"
                value={transactionForm.amount}
                onChange={(e) => handleTransactionFormChange(e.target.name, e.target.value ? parseFloat(e.target.value) : "")}
            />
            <select
                name="category_id"
                value={transactionForm.category_id}
                onChange={(e) => handleTransactionFormChange(e.target.name, e.target.value)}
            >
                <option value="">Category</option>
                {categories.map(category => {
                    return (
                        <option value={category.id} key={category.id}>{category.name}</option>
                    )
                })}
            </select>
            <textarea
                cols={50}
                rows={1}
                name="description"
                placeholder='Description'
                value={transactionForm.description}
                onChange={(e) => handleTransactionFormChange(e.target.name, e.target.value)}
            ></textarea>
            <button
                onClick={() => handleSubmit()}>
                Submit
            </button>
        </div>
    );
}

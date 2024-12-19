import axios from 'axios'
import { useEffect, useState } from 'react'


export default function NewTransfer({ updateTransfersList, handleClose }) {

    const [accounts, setAccounts] = useState([]);

    async function getAccounts() {
        const response = await axios.get("http://localhost:3000/accounts");
        setAccounts(response.data)
    }

    useEffect(() => {
        getAccounts();
    }, [])


    const [transferForm, setTransferForm] = useState({ transfer_date: new Date().toISOString().split('T')[0], account_id_source: 0, account_id_destination: 0, user_id: 1, description: "", amount: "" })

    const handleTransferFormChange = (key, value) => {
        setTransferForm({ ...transferForm, [key]: value });
    }

    const handleSubmit = async () => {
        const response = await axios.post('http://localhost:3000/transfers', transferForm)
        setTransferForm({ transfer_date: new Date().toISOString().split('T')[0], account_id_source: 0, account_id_destination: 0, user_id: 1, description: "", amount: "" })
        updateTransfersList();
        handleClose();
    }

    return (
        <div>
            <input type="date" name="transfer_date" id="transfer_date"
                onChange={(e) => { handleTransferFormChange(e.target.name, e.target.value) }}
                value={transferForm.transfer_date}
            />

            <select
                id="accountSourceSelect"
                name='account_id_source'
                value={transferForm.account_id_source}
                onChange={(e) => { handleTransferFormChange(e.target.name, e.target.value) }}
            >
                <option value="">From...</option>
                {accounts.map(account => {
                    return (
                        <option key={account.id} value={account.id}>{account.name}</option>
                    )
                })}
            </select>
            <select
                id="accountDestSelect"
                name='account_id_destination'
                value={transferForm.account_id_destination}
                onChange={(e) => { handleTransferFormChange(e.target.name, e.target.value) }}
            >
                <option value="">To...</option>
                {accounts.map(account => {
                    return (
                        <option key={account.id} value={account.id}>{account.name}</option>
                    )
                })}
            </select>
            <input
                type="number"
                step="0.01"
                min="0"
                placeholder='Amount'
                name="amount"
                value={transferForm.amount}
                onChange={(e) => handleTransferFormChange(e.target.name, e.target.value ? parseFloat(e.target.value) : "")}
            />
            <textarea
                cols={50}
                rows={1}
                name="description"
                placeholder='Description'
                value={transferForm.description}
                onChange={(e) => handleTransferFormChange(e.target.name, e.target.value)}
            ></textarea>
            <button
                onClick={() => handleSubmit()}>
                Submit
            </button>
        </div>
    );
}

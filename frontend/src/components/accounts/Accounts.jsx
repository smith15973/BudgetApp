import axios from "axios"
import { useState, useEffect } from "react"
import Account from "./Account";


export default function Accounts() {

    const [accounts, setAccounts] = useState([]);

    const getAccounts = async () => {
        const response = await axios.get('http://localhost:3000/accounts');
        setAccounts(response.data)
    }

    useEffect(() => {
        getAccounts();
    }, [])

    return (
        <div>
            <h1>ACCOUNTS</h1>
            {accounts.map(account => {
                return <Account key={account.id} account={account} />
            })}
        </div>
    )
}
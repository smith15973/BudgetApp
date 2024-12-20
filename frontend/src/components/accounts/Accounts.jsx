import axios from "axios"
import { useState, useEffect } from "react"
import Account from "./Account";


export default function Accounts({ accounts }) {



    return (
        <div>
            <h1>ACCOUNTS</h1>
            {accounts.map(account => {
                return <Account key={account.id} account={account} />
            })}
        </div>
    )
}
import axios from "axios"
import { useState, useEffect } from "react"
import Account from "./Account";
import NewAccount from "./NewAccount";


export default function Accounts({ accounts }) {



    return (
        <div>
            <h1>ACCOUNTS</h1>
            <NewAccount />
            {accounts.map(account => {
                return <Account key={account.id} account={account} />
            })}
        </div>
    )
}
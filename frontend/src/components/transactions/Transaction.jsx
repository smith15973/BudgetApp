import axios from 'axios'
import { useEffect, useState } from 'react';

export default function Transaction({ transaction }) {



    return (
        <div style={{ display: "flex" }}>
            <div style={{ padding: 2, border: "1px solid black" }}>
                {new Date(transaction.transaction_date).toLocaleString().split(',')[0]}
            </div>
            <div style={{ padding: 2, border: "1px solid black" }}>{transaction.account_id}</div>
            <div style={{ padding: 2, border: "1px solid black" }}>{transaction.transaction_type}</div>
            <div style={{ padding: 2, border: "1px solid black" }}>{transaction.amount}</div>
            <div style={{ padding: 2, border: "1px solid black" }}>{transaction.category_id}</div>
            <div style={{ padding: 2, border: "1px solid black" }}>{transaction.description}</div>
        </div>
    )
}
import { Box, Checkbox, TableCell, TableRow } from "@mui/material";
import axios from "axios";


export default function Transaction({ transaction, onTransactionUpdate }) {

    const handleClearTransaction = async (transaction_id) => {

        const response = await axios.put(`http://localhost:3000/transactions/${transaction_id}`, { name: 'cleared', value: !transaction.cleared });
        onTransactionUpdate();
    }


    return (

        <TableRow>
            <TableCell>
                {new Date(transaction.transaction_date).toLocaleString().split(',')[0]}
            </TableCell>
            <TableCell>{transaction.account_name}</TableCell>
            <TableCell>{transaction.transaction_type}</TableCell>
            <TableCell>{transaction.categories.map((category, index) => {
                return (
                    <Box key={index}>{category.category_name} : ${category.amount}</Box>
                )
            })}</TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell><Checkbox onClick={() => handleClearTransaction(transaction.id)} checked={transaction.cleared} /></TableCell>
            <TableCell>${transaction.categories.reduce((total, category) => total + Number(category.amount), 0)}</TableCell>
        </TableRow>
    )
}
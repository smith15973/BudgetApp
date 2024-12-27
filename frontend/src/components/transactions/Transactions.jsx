import * as React from 'react';
import Transaction from './Transaction';
import { TableBody, TableContainer, Table, TableHead, TableRow, TableCell } from '@mui/material';




export default function Transactions({ transactions, onTransactionUpdate }) {

    return (
        <TableContainer sx={{ maxWidth: '100%' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Account</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Categories</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Cleared</TableCell>
                        <TableCell>Total</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {transactions.map(transaction =>
                        <Transaction key={transaction.id} transaction={transaction} onTransactionUpdate={onTransactionUpdate} />
                    )}
                </TableBody>
            </Table>
        </TableContainer >
    );
}
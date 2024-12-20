import { useState } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const transactionTableHeadings = [
    {
        field: 'transaction_date', headerName: 'Date',
        valueGetter: (value) => new Date(value).toLocaleString().split(',')[0],
    },
    { field: 'account_name', headerName: 'Account' },
    {
        field: 'transaction_type',
        headerName: 'Type',
    },
    {
        field: 'category_name',
        headerName: 'Category',
    },
    {
        field: 'description',
        headerName: 'Description',
    },
    {
        field: 'amount',
        headerName: 'Amount',
    },
];



export default function Transactions({ transactions }) {
    return (
        <Box sx={{ height: '100%', width: '50%' }}>
            <DataGrid
                rows={transactions.map(transaction => ({
                    id: transaction.id,
                    transaction_date: transaction.transaction_date,
                    account_name: transaction.account_name,
                    transaction_type: transaction.transaction_type,
                    category_name: transaction.category_name,
                    description: transaction.description,
                    amount: transaction.amount,
                }))}
                columns={transactionTableHeadings}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5, 10, 20, 30]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
}
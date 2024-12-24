import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const transactionTableHeadings = [
    {
        field: 'transaction_date',
        headerName: 'Date',
        minWidth: 100,
        valueGetter: (value) => new Date(value).toLocaleString().split(',')[0],
    },
    {
        field: 'account_name',
        headerName: 'Account',
        minWidth: 100,
    },
    {
        field: 'transaction_type',
        headerName: 'Type',
        minWidth: 100,
    },
    {
        field: 'category_name',
        headerName: 'Category',
        width: 200,
    },
    {
        field: 'description',
        headerName: 'Description',
        minWidth: 300,
    },
    {
        field: 'cleared',
        headerName: 'Cleared',
        maxWidth: 75,
    },
    {
        field: 'total',
        headerName: 'Total',
        minWidth: 100,
    },
];

const handleClearTransactionClick = async (trasaction_id) => {

}


export default function Transactions({ transactions, handleRowClick }) {

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <DataGrid
                rows={transactions.map(transaction => ({
                    id: transaction.id,
                    transaction_date: transaction.transaction_date,
                    account_name: transaction.account_name,
                    transaction_type: transaction.transaction_type,
                    category_name: transaction.categories.length > 1 ? `${transaction.categories.length} Categories` : transaction.categories[0].category_name,
                    description: transaction.description,
                    cleared: transaction.cleared ? '✔' : '',
                    total: transaction.categories.reduce((total, category) => total + Number(category.amount), 0)
                }))}
                columns={transactionTableHeadings}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[5, 10, 20, 30]}
                checkboxSelection
                disableRowSelectionOnClick
                slots={{ toolbar: GridToolbar }}
                onRowClick={params => handleRowClick(params.id)}
                onCellClick={event => event.colDef.field === 'cleared' ? console.log(`Transaction ${event.row.id} set to ${!event.row.cleared}`) : ''}
            />
        </Box>
    );
}
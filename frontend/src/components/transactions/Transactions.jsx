import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';


import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

// {
    //     field: 'fullName',
    //     headerName: 'Full name',
    //     description: 'This column has a value getter and is not sortable.',
    //     sortable: false,
    //     width: 160,
    //     valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    //   }

const transactionTableHeadings = [
    {
        field: 'transaction_date', headerName: 'Date',
        valueGetter: (value) => new Date(value).toLocaleString().split(',')[0],
    },
    { field: 'account_name', headerName: 'Account'},
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
    const [page, setPage] = useState(0);
    const [transactionsPerPage, settransactionsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangetransactionsPerPage = (event) => {
        settransactionsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        // <Paper sx={{ width: '50%', overflow: 'hidden' }}>
        //     <TableContainer sx={{ maxHeight: 440 }}>
        //         <Table stickyHeader aria-label="sticky table">
        //             <TableHead>
        //                 <TableRow>
        //                     {transactionTableHeadings.map((column) => (
        //                         <TableCell
        //                             key={column.id}
        //                             align={column.align}
        //                             style={{ minWidth: column.minWidth }}
        //                         >
        //                             {column.label}
        //                         </TableCell>
        //                     ))}
        //                 </TableRow>
        //             </TableHead>
        //             <TableBody>
        //                 {transactions
        //                     .map((transaction) => {
        //                         return (
        //                             <TableRow hover role="checkbox" tabIndex={-1} key={transaction.id}>
        //                                 {transactionTableHeadings.map((column) => {
        //                                     const value = transaction[column.id];
        //                                     return (
        //                                         <TableCell key={column.id} align={column.align}>
        //                                             {column.format ? column.format(value) : value}
        //                                         </TableCell>
        //                                     );
        //                                 })}
        //                             </TableRow>
        //                         );
        //                     })}
        //             </TableBody>
        //         </Table>
        //     </TableContainer>
        //     <TablePagination
        //         rowsPerPageOptions={[10, 25, 100]}
        //         component="div"
        //         count={transactions.length}
        //         rowsPerPage={transactionsPerPage}
        //         page={page}
        //         onPageChange={handleChangePage}
        //         onRowsPerPageChange={handleChangetransactionsPerPage}
        //     />
        // </Paper>

        <Box sx={{ height: 400, width: '75%' }}>
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
                pageSizeOptions={[20]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
}



// const columns = [
//   { field: 'id', headerName: 'ID', width: 90 },
//   {
//     field: 'firstName',
//     headerName: 'First name',
//     width: 150,
//     editable: true,
//   },
//   {
//     field: 'lastName',
//     headerName: 'Last name',
//     width: 150,
//     editable: true,
//   },
//   {
//     field: 'age',
//     headerName: 'Age',
//     type: 'number',
//     width: 110,
//     editable: true,
//   },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 160,
//     valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
//   },
// ];

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

// export default function DataGridDemo() {
//   return (
//     <Box sx={{ height: 400, width: '75%' }}>
//       <DataGrid
//         rows={transactions}
//         columns={transactionTableHeadings}
//         initialState={{
//           pagination: {
//             paginationModel: {
//               pageSize: 5,
//             },
//           },
//         }}
//         pageSizeOptions={[5]}
//         checkboxSelection
//         disableRowSelectionOnClick
//       />
//     </Box>
//   );
// }




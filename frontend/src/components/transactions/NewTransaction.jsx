import axios from 'axios'
import { useEffect, useState } from 'react'
import { Button, RadioGroup, FormLabel, FormControlLabel, Radio, InputAdornment, Input, FormControl, InputLabel } from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';





export default function NewTransaction({ updateTransactionsList, handleClose }) {

    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);

    async function getAccounts() {
        const response = await axios.get("http://localhost:3000/accounts");
        setAccounts(response.data)
    }
    async function getCategories() {
        const response = await axios.get("http://localhost:3000/budget_categories");
        setCategories(response.data)
    }

    useEffect(() => {
        getAccounts();
        getCategories();
    }, [])


    const [transactionForm, setTransactionForm] = useState({ transaction_date: new Date().toLocaleString().split(',')[0], account_id: 0, category_id: 0, transaction_type: "Spending", user_id: 1, description: "", amount: "" })

    const handleTransactionFormChange = (key, value) => {
        setTransactionForm({ ...transactionForm, [key]: value });
    }

    const handleSubmit = async () => {
        const response = await axios.post('http://localhost:3000/transactions', transactionForm)
        setTransactionForm({ transaction_date: new Date().toLocaleString().split(',')[0], account_id: 0, category_id: 0, transaction_type: "Spending", user_id: 1, description: "", amount: "" })
        updateTransactionsList();
        handleClose();
    }


    return (
        <div>
            <RadioGroup
                tabIndex={-1}
                name="transaction_type"
                value={transactionForm.transaction_type}
                onChange={(e) => handleTransactionFormChange(e.target.name, e.target.value)}
                row
            >
                <FormControlLabel value="Spending" control={<Radio />} label="Spending" />
                <FormControlLabel value="Income" control={<Radio />} label="Income" />
                <FormControlLabel value="Transfer" control={<Radio />} label="Transfer" />
            </RadioGroup>

            <Autocomplete
                disablePortal
                options={accounts}
                getOptionLabel={(option) => option.name}
                sx={{ width: 300 }}
                onChange={(event, newValue) => handleTransactionFormChange('account_id', newValue ? newValue.id : '')}
                renderInput={(params) => <TextField {...params} label="Account" />}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    value={dayjs(transactionForm.transaction_date)}
                    onChange={(date) => handleTransactionFormChange('transaction_date', date ? date.format('MM-DD-YYYY') : '')}
                    name='transaction_date'
                />
            </LocalizationProvider>

            <FormLabel id="transaction-type-radio-group-label">Transaction Type</FormLabel>



            <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                <Input
                    id="amount_input"
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    label="Amount"
                    type="number"
                    name="amount"
                    value={transactionForm.amount}
                    onChange={(e) => handleTransactionFormChange(e.target.name, e.target.value ? parseFloat(e.target.value) : "")}
                />
            </FormControl>

            <Autocomplete
                disablePortal
                options={categories}
                getOptionLabel={(option) => option.name}
                sx={{ width: 300 }}
                onChange={(event, newValue) => handleTransactionFormChange('category_id', newValue ? newValue.id : '')}
                renderInput={(params) => <TextField {...params} label="Category" />}
            />

            <TextField
                id="description_input"
                label="Description"
                multiline
                rows={3}
                name="description"
                value={transactionForm.description}
                onChange={(e) => handleTransactionFormChange(e.target.name, e.target.value)}
            />

            <Button onClick={() => handleSubmit()} variant="contained">Submit</Button>
        </div>
    );
}

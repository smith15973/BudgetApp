import axios from 'axios'
import { useEffect, useState } from 'react'
import { Button, RadioGroup, FormLabel, FormControlLabel, Radio, InputAdornment, Input, FormControl, InputLabel, Box } from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';





export default function NewTransaction({ updateTransactionsList, handleClose }) {

    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [transaction_categories, setTransactionCategories] = useState([{ category_id: 0, amount: "" }])

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


    const [transactionForm, setTransactionForm] = useState({ transaction_date: new Date().toLocaleString().split(',')[0], account_id: 0, transaction_type: "Spending", user_id: 1, description: "" })

    const handleTransactionFormChange = (key, value) => {
        setTransactionForm({ ...transactionForm, [key]: value });
    }


    const handleAddTransactionCategory = () => {
        setTransactionCategories([...transaction_categories, { category_id: 0, amount: "" }]);
    }

    const handleTransactionCategoriesChange = (key, value, index) => {
        const updatedCategories = [...transaction_categories];
        updatedCategories[index] = { ...updatedCategories[index], [key]: value };
        setTransactionCategories(updatedCategories);
    }

    const handleSubmit = async () => {
        const response = await axios.post('http://localhost:3000/transactions', { ...transactionForm, transaction_categories })
        setTransactionCategories([{ category_id: 0, amount: "" }])
        setTransactionForm({ transaction_date: new Date().toLocaleString().split(',')[0], account_id: 0, category_id: 0, transaction_type: "Spending", user_id: 1, description: "" })
        updateTransactionsList();
        handleClose();
    }

    const total = transaction_categories.reduce((acc, category) => acc + (parseFloat(category.amount) || 0), 0);
    const handleRemoveTransactionCategory = (index) => {
        const updatedCategories = transaction_categories.filter((_, i) => i !== index);
        setTransactionCategories(updatedCategories);
    }

    return (
        <div>

            <Box>
                <FormLabel id="transaction-type-radio-group-label">Transaction Type</FormLabel>
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
            </Box>

            <Box sx={{ my: 3, display: 'flex' }}>
                <Box sx={{ mr: 3 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={dayjs(transactionForm.transaction_date)}
                            onChange={(date) => handleTransactionFormChange('transaction_date', date ? date.format('MM-DD-YYYY') : '')}
                            name='transaction_date'
                        />
                    </LocalizationProvider>
                </Box>

                <Box>
                    <Autocomplete
                        disablePortal
                        options={accounts}
                        getOptionLabel={(option) => option.name}
                        sx={{ width: 300 }}
                        onChange={(event, newValue) => handleTransactionFormChange('account_id', newValue ? newValue.id : '')}
                        renderInput={(params) => <TextField {...params} label="Account" />}
                    />
                </Box>
            </Box>




            <Box sx={{ my: 3 }}>
                {transaction_categories.map((category, index) => {
                    return (
                        <Box sx={{ my: 3, display: 'flex', justifyContent: 'space-between' }} key={index}>
                            <Autocomplete
                                style={{ width: '47.5%' }}
                                disablePortal
                                options={categories}
                                getOptionLabel={(option) => option.name}
                                sx={{ width: 300 }}
                                onChange={(event, newValue) => handleTransactionCategoriesChange('category_id', newValue ? newValue.id : '', index)}
                                renderInput={(params) => <TextField {...params} label="Category" />}

                            />

                            <TextField
                                sx={{ width: '47.5%' }}
                                variant="outlined"
                                id="amount_input"
                                // startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                label="Amount"
                                type="number"
                                name="amount"
                                value={transaction_categories[index].amount}
                                onChange={(e) => handleTransactionCategoriesChange(e.target.name, e.target.value ? Number(e.target.value) : "", index)}
                            />
                        </Box>
                    )
                })}

            </Box>
            <Button onClick={handleAddTransactionCategory} variant="outlined">Add Category</Button>

            <Box sx={{ my: 3 }}>
                <TextField
                    style={{ width: '100%' }}
                    id="description_input"
                    label="Description"
                    multiline
                    rows={3}
                    name="description"
                    value={transactionForm.description}
                    onChange={(e) => handleTransactionFormChange(e.target.name, e.target.value)}
                />
            </Box>

            <Box sx={{ my: 3 }}>
                <div>Total: $ {total.toFixed(2)}</div>
            </Box>

            <Box sx={{ my: 3 }}>
                <Button onClick={() => handleSubmit()} variant="contained">Submit</Button>
            </Box>
        </div>
    );
}

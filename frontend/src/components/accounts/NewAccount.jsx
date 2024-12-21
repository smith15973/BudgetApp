import { TextField, RadioGroup, Radio, FormControlLabel, FormControl, InputLabel, Input, InputAdornment, Button } from '@mui/material'
import axios from 'axios'
import { useState } from 'react'

export default function NewAccount() {

    const [newAccountForm, setNewAccountForm] = useState({ name: "", type: "Credit", startingBalance: 0 })

    const onAccountFormChange = (key, value) => {
        setNewAccountForm({ ...newAccountForm, [key]: value })
    }

    const handleSubmit = async () => {
        const response = await axios.post('http://localhost:3000/accounts', newAccountForm);
        setNewAccountForm({ name: "", type: "Credit", startingBalance: 0 })
    }

    return (
        <>
            <TextField
                name='name'
                label="Name"
                value={newAccountForm.name}
                onChange={(e) => onAccountFormChange(e.target.name, e.target.value)}
            />
            <RadioGroup
                name="type"
                value={newAccountForm.type}
                onChange={(e) => onAccountFormChange(e.target.name, e.target.value)}
            >
                <FormControlLabel value="Credit" control={<Radio />} label="Credit" />
                <FormControlLabel value="Debit" control={<Radio />} label="Debit" />
                <FormControlLabel value="Savings" control={<Radio />} label="Savings" />
            </RadioGroup>
            <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">Starting Balance</InputLabel>
                <Input
                    id="amount_input"
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    label="Starting Balance"
                    type="number"
                    name="startingBalance"
                    value={newAccountForm.startingBalance}
                    onChange={(e) => onAccountFormChange(e.target.name, e.target.value ? parseFloat(e.target.value) : "")}
                />
            </FormControl>
            <Button onClick={handleSubmit}>Submit</Button>
        </>
    )
}
import { TextField, FormControl, InputLabel, Input, InputAdornment, Button } from '@mui/material'
import axios from 'axios'
import { useState } from 'react'

export default function NewCategory() {

    const [newCategoryForm, setNewCategoryForm] = useState({ name: "", startingBalance: 0 })

    const onCategoryFormChange = (key, value) => {
        setNewCategoryForm({ ...newCategoryForm, [key]: value })
    }

    const handleSubmit = async () => {
        const response = await axios.post('http://localhost:3000/budget_categories', newCategoryForm);
        setNewCategoryForm({ name: "", startingBalance: 0 })
    }

    return (
        <>
            <TextField
                name='name'
                label="Name"
                value={newCategoryForm.name}
                onChange={(e) => onCategoryFormChange(e.target.name, e.target.value)}
            />
            <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">Starting Balance</InputLabel>
                <Input
                    id="amount_input"
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    label="Starting Balance"
                    type="number"
                    name="startingBalance"
                    value={newCategoryForm.startingBalance}
                    onChange={(e) => onCategoryFormChange(e.target.name, e.target.value ? parseFloat(e.target.value) : "")}
                />
            </FormControl>
            <Button onClick={handleSubmit}>Submit</Button>
        </>
    )
}
import { TextField, FormControl, InputLabel, Input, InputAdornment, Button, Modal, Box } from '@mui/material'
import axios from 'axios'
import { useState } from 'react'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function NewCategory() {

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [newCategoryForm, setNewCategoryForm] = useState({ name: "", startingBalance: 0 })

    const onCategoryFormChange = (key, value) => {
        setNewCategoryForm({ ...newCategoryForm, [key]: value })
    }

    const handleSubmit = async () => {
        const response = await axios.post('http://localhost:3000/budget_categories', newCategoryForm);
        handleClose();
        setNewCategoryForm({ name: "", startingBalance: 0 });
    }

    return (
        <>
            <Button onClick={handleOpen}>New Budget Category</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
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
                </Box>
            </Modal>
        </>
    )
}
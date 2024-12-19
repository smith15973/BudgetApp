import { useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import NewTransaction from './NewTransaction';
import NewTransfer from './NewTransfer';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


export default function NewTransModal({ updateTransactionsList, updateTransfersList }) {

    const [open, setOpen] = useState(false);
    const [transMode, setTransMode] = useState(true);
    const setTransactionMode = () => setTransMode(true);
    const setTransferMode = () => setTransMode(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button onClick={handleOpen}>New Transaction</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div style={{display:'flex', justifyContent: 'space-between'}}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Modal Title
                        </Typography>
                        {transMode ? <Button onClick={setTransferMode}>Transfer</Button> : <Button onClick={setTransactionMode}>Transaction</Button>}
                    </div>

                    {transMode ? <NewTransaction updateTransactionsList={updateTransactionsList} handleClose={handleClose} /> :
                        <NewTransfer updateTransfersList={updateTransfersList} handleClose={handleClose} />}



                </Box>
            </Modal>
        </div>
    );
}

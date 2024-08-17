import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    outline: 0,
};

const CustomModal = ({ open, handleClose, title, children, footer }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                {title && (
                    <Typography id="modal-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                )}
                <Box sx={{ mt: 2 }} id="modal-description">
                    {children}
                </Box>
                {footer && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        {footer}
                    </Box>
                )}
            </Box>
        </Modal>
    );
};

export default CustomModal;

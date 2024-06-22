import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

const ViewInvoiceModal = ({ open, onClose, invoice }) => {
    if (!invoice) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogContent dividers>
                <Box mb={2}>
                    <Typography variant="h6">Invoice Information</Typography>
                    <Typography><strong>Invoice ID:</strong> {invoice.id}</Typography>
                    <Typography><strong>Total:</strong> ${invoice.total.toFixed(2)}</Typography>
                    <Typography><strong>Date:</strong> {new Date(invoice.createdAt.seconds * 1000).toLocaleDateString()}</Typography>
                </Box>
                <Box mb={2}>
                    <Typography variant="h6">Customer Information</Typography>
                    <Typography><strong>Name:</strong> {invoice.customer.name}</Typography>
                    <Typography><strong>Address:</strong> {invoice.customer.address}</Typography>
                    <Typography><strong>Phone:</strong> {invoice.customer.phone}</Typography>
                    <Typography><strong>Gender:</strong> {invoice.customer.gender}</Typography>
                </Box>
                <Box>
                    <Typography variant="h6">Products</Typography>
                    {invoice.products.map((product, index) => (
                        <Box key={index} mb={1}>
                            <Typography><strong>Item:</strong> {product.itemName}</Typography>
                            <Typography><strong>Quantity:</strong> {product.quantity}</Typography>
                            <Typography><strong>Unit Price:</strong> ${product.unitPrice.toFixed(2)}</Typography>
                            <Typography><strong>Total:</strong> ${product.total.toFixed(2)}</Typography>
                        </Box>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

ViewInvoiceModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    invoice: PropTypes.object,
};

export default ViewInvoiceModal;

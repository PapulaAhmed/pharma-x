import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig.js';
import { doc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Grid, IconButton, Box, Typography, Autocomplete } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';

const EditInvoiceModal = ({ open, onClose, invoice }) => {
    const [customer, setCustomer] = useState({ name: '', address: '', phone: '', gender: '' });
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [createdAt, setCreatedAt] = useState('');

    useEffect(() => {
        if (invoice) {
            setCustomer(invoice.customer);
            setProducts(invoice.products);
            setTotal(invoice.total);
            setCreatedAt(new Date(invoice.createdAt.seconds * 1000).toISOString().split('T')[0]); // Convert to YYYY-MM-DD format
        }
    }, [invoice]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                const productsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setAllProducts(productsData.map(product => ({
                    label: product.ItemName,
                    unitPrice: product.UnitPrice
                })));
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    const handleCustomerChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (value, index) => {
        const newProducts = [...products];
        const product = allProducts.find(product => product.label === value);
        const unitPrice = product ? parseFloat(product.unitPrice) : 0;
        newProducts[index] = {
            ...newProducts[index],
            itemName: value,
            unitPrice: unitPrice,
            total: unitPrice * newProducts[index].quantity
        };
        setProducts(newProducts);
        updateTotal(newProducts);
    };

    const handleQuantityChange = (index, event) => {
        const newQuantity = parseInt(event.target.value, 10);
        const newProducts = [...products];
        if (newQuantity > 0) {
            newProducts[index].quantity = newQuantity;
            newProducts[index].total = newQuantity * newProducts[index].unitPrice;
            setProducts(newProducts);
            updateTotal(newProducts);
        }
    };

    const handleAddProduct = () => {
        const newProducts = [...products, { itemName: '', quantity: 1, unitPrice: 0, total: 0 }];
        setProducts(newProducts);
        updateTotal(newProducts);
    };

    const handleRemoveProduct = (index) => {
        const newProducts = products.filter((_, idx) => idx !== index);
        setProducts(newProducts);
        updateTotal(newProducts);
    };

    const updateTotal = (productsList) => {
        const newTotal = productsList.reduce((acc, product) => acc + (product.total), 0);
        setTotal(newTotal);
    };

    const handleSave = async () => {
        if (!invoice) return;
        try {
            const invoiceRef = doc(db, 'invoices', invoice.id);
            await updateDoc(invoiceRef, {
                customer,
                products,
                total,
                createdAt: new Date(createdAt) // Use the state variable for date
            });
            console.log("Invoice updated successfully");
            onClose(true); // close modal and signal changes
        } catch (error) {
            console.error("Error updating invoice:", error);
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogContent>
                {Object.entries(customer).map(([key, value]) => (
                    <TextField
                        key={key}
                        name={key}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={value}
                        onChange={handleCustomerChange}
                        fullWidth
                        margin="normal"
                    />
                ))}
                {products.map((product, index) => (
                    <Grid container spacing={2} alignItems="center" key={index} flexWrap={'nowrap'} marginTop={'5px'}>
                        <Grid item xs={6}>
                            <Autocomplete
                                value={product.itemName}
                                onChange={(event, newValue) => handleItemChange(newValue, index)}
                                options={allProducts.map(option => option.label)}
                                renderInput={(params) => <TextField {...params} label="Item" />}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                value={product.quantity}
                                onChange={(event) => handleQuantityChange(index, event)}
                                type="number"
                                InputProps={{ inputProps: { min: 1 } }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                value={`$ ${product.unitPrice.toFixed(2)}`}
                                InputProps={{ readOnly: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                value={`$ ${product.total.toFixed(2)}`}
                                InputProps={{ readOnly: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <IconButton onClick={() => handleRemoveProduct(index)} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddProduct}
                    sx={{ mt: 2 }}
                >
                    Add another item
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)}>Cancel</Button>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Typography variant="h6" sx={{ mr: 2 }}>
                    Total: ${total.toFixed(2)}
                </Typography>
            </Box>
        </Dialog>
    );
};

EditInvoiceModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    invoice: PropTypes.object
};

export default EditInvoiceModal;

import React, { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Autocomplete, TextField, Button, Box, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const InvoiceForm = () => {
    const [customer, setCustomer] = useState({ name: '', address: '', phone: '', gender: '' });
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const querySnapshot = await getDocs(collection(db, 'products'));
            const productsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setAllProducts(productsData);
        };
        fetchProducts();
    }, []);

    const handleAddProduct = (event, value) => {
        if (!value) return; // Prevent adding an undefined product
        setSelectedProduct(value);
        setQuantityDialogOpen(true);
    };

    const confirmAddProduct = (quantity) => {
        if (selectedProduct && quantity > 0) {
            const productTotal = selectedProduct.UnitPrice * quantity;
            const newProduct = { ...selectedProduct, quantity, total: productTotal };
            setProducts([...products, newProduct]);
            setTotal(prevTotal => prevTotal + productTotal);
        }
        closeQuantityDialog();
    };

    const closeQuantityDialog = () => {
        setQuantityDialogOpen(false);
        setSelectedProduct(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!products.length) {
            alert("Please add at least one product.");
            return;
        }
        await addDoc(collection(db, 'invoices'), {
            customer,
            products,
            total,
            createdAt: new Date()
        });
        alert("Invoice submitted successfully!");
        resetForm();
    };

    const resetForm = () => {
        setCustomer({ name: '', address: '', phone: '', gender: '' });
        setProducts([]);
        setTotal(0);
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Invoice Form</Typography>
            {Object.entries(customer).map(([key, value]) => (
                <TextField
                    key={key}
                    name={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    fullWidth
                    margin="normal"
                    value={value}
                    onChange={handleChange}
                />
            ))}
            <Autocomplete
                options={allProducts}
                getOptionLabel={(option) => `${option.ItemName || 'No Name'} (${option.Barcode || 'No Barcode'})`}
                renderInput={(params) => <TextField {...params} label="Select Product" />}
                onChange={handleAddProduct}
                fullWidth
                margin="normal"
            />
            {products.map((product, index) => (
                <Box key={index} sx={{ mt: 1, mb: 1 }}>
                    <Typography>{`${product.ItemName} - Quantity: ${product.quantity} - Total: $${product.total}`}</Typography>
                </Box>
            ))}
            <Typography variant="h6">Total: ${total}</Typography>
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>Submit Invoice</Button>
            <Dialog open={quantityDialogOpen} onClose={closeQuantityDialog}>
                <DialogTitle>Add Quantity</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the quantity for {selectedProduct?.ItemName}.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="quantity"
                        type="number"
                        fullWidth
                        variant="standard"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                confirmAddProduct(parseInt(e.target.value, 10));
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => confirmAddProduct(parseInt(document.getElementById('quantity').value, 10))}>Add</Button>
                    <Button onClick={closeQuantityDialog}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InvoiceForm;

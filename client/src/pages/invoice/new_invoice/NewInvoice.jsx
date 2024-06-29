import React, { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Grid, TextField, IconButton, Button, Typography, Box, Autocomplete, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const InvoiceForm = () => {
  const [customer, setCustomer] = useState({ name: '', address: '', phone: '', gender: '' });
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all products
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setAllProducts(productsData.map(product => ({
        label: product.ItemName,
        unitPrice: product.UnitPrice
      })));
    };

    // Fetch all customers
    const fetchCustomers = async () => {
      const querySnapshot = await getDocs(collection(db, 'customers'));
      const customersData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setAllCustomers(customersData);
      setFilteredCustomers(customersData);
    };

    fetchProducts();
    fetchCustomers();
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
    // Reset the form after submission
    setCustomer({ name: '', address: '', phone: '', gender: '' });
    setProducts([]);
    setTotal(0);
    navigate('/app/invoices');
  };

  const handleOpenCustomerDialog = () => {
    setIsCustomerDialogOpen(true);
  };

  const handleCloseCustomerDialog = () => {
    setIsCustomerDialogOpen(false);
  };

  const handleSelectCustomer = (selectedCustomer) => {
    setCustomer({
      name: selectedCustomer.name,
      address: selectedCustomer.address,
      phone: selectedCustomer.phoneNumber,
      gender: selectedCustomer.gender
    });
    handleCloseCustomerDialog();
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredCustomers(
      allCustomers.filter(customer =>
        customer.name.toLowerCase().includes(term) ||
        customer.phoneNumber.toLowerCase().includes(term) ||
        customer.id.toLowerCase().includes(term)
      )
    );
  };

  return (
    <Box sx={{ maxWidth: 1000, m: 'auto', p: 4 }} >
      <Typography variant="h4" gutterBottom>Invoice Form</Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={9}>
          <TextField
            name="name"
            label="Name"
            value={customer.name}
            onChange={handleCustomerChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={3}>
          <Button variant="outlined" onClick={handleOpenCustomerDialog} sx={{ mt: 2 }}>Choose Existing Customer</Button>
        </Grid>
      </Grid>
      <TextField
        name="address"
        label="Address"
        value={customer.address}
        onChange={handleCustomerChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="phone"
        label="Phone"
        value={customer.phone}
        onChange={handleCustomerChange}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Gender</InputLabel>
        <Select
          name="gender"
          value={customer.gender}
          onChange={handleCustomerChange}
          label="Gender"
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Not Specified">Not Specified</MenuItem>
        </Select>
      </FormControl>
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
        startIcon={<DeleteIcon />} // Changed to a more appropriate icon for demonstration
        onClick={handleAddProduct}
        sx={{ mt: 2 }}
      >
        Add another item
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 2, ml: 2 }}
      >
        Submit Invoice
      </Button>
      {/* Display Total in the Right Bottom Corner */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Typography variant="h6" sx={{ mr: 2 }}>
          Total: ${total.toFixed(2)}
        </Typography>
      </Box>

      <Dialog open={isCustomerDialogOpen} onClose={handleCloseCustomerDialog}>
        <DialogTitle>Select a Customer</DialogTitle>
        <DialogContent>
          <TextField
            label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            margin="normal"
          />
          <List>
            {filteredCustomers.map((customer) => (
              <ListItem button key={customer.id} onClick={() => handleSelectCustomer(customer)}>
                <ListItemText primary={customer.name} secondary={customer.phoneNumber} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default InvoiceForm;

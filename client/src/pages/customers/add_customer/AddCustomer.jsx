import React, { useState } from 'react';
import { db } from '../../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { Box, TextField, Button, Typography, MenuItem, Breadcrumbs, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddCustomer = () => {
    const [customer, setCustomer] = useState({ name: '', age: '', phoneNumber: '', address: '', gender: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await addDoc(collection(db, 'customers'), {
                ...customer,
                age: parseInt(customer.age, 10)
            });
            alert('Customer added successfully');
            setCustomer({ name: '', age: '', phoneNumber: '', address: '', gender: '' });
        } catch (error) {
            console.error('Error adding customer: ', error);
            alert('Error adding customer');
        }
        setIsLoading(false);
    };

    return (
        <Box sx={{ maxWidth: 600, m: 'auto', p: 4 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link underline="hover" color="inherit" href="/" onClick={(e) => { e.preventDefault(); navigate('/app'); }}>
                    Home
                </Link>
                <Link underline="hover" color="inherit" href="/customers" onClick={(e) => { e.preventDefault(); navigate('/app/customers'); }}>
                    Customers
                </Link>
                <Typography color="textPrimary">Add Customer</Typography>
            </Breadcrumbs>
            <Typography variant="h4" gutterBottom>Add Customer</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    name="name"
                    value={customer.name}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Age"
                    name="age"
                    type="number"
                    value={customer.age}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={customer.phoneNumber}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Address"
                    name="address"
                    value={customer.address}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    select
                    label="Gender"
                    name="gender"
                    value={customer.gender}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    required
                >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Not Specified">Not Specified</MenuItem>
                </TextField>
                <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Customer'}
                </Button>
            </form>
        </Box>
    );
};

export default AddCustomer;

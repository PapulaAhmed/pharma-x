import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import PropTypes from 'prop-types';

const EditCustomerModal = ({ isOpen, onClose, customer }) => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        phoneNumber: '',
        address: '',
        gender: ''
    });

    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name,
                age: customer.age,
                phoneNumber: customer.phoneNumber,
                address: customer.address,
                gender: customer.gender
            });
        }
    }, [customer]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!customer) return;
        const customerRef = doc(db, 'customers', customer.id);
        await updateDoc(customerRef, {
            ...formData,
            age: parseInt(formData.age, 10)
        });
        onClose(true); // close modal and signal changes
    };

    return (
        <Dialog open={isOpen} onClose={() => onClose(false)} maxWidth="md" fullWidth>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    label="Age"
                    type="number"
                    fullWidth
                    variant="outlined"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    label="Phone Number"
                    type="text"
                    fullWidth
                    variant="outlined"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    label="Address"
                    type="text"
                    fullWidth
                    variant="outlined"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                />
                <FormControl fullWidth variant="outlined" margin="dense" sx={{ mb: 2 }}>
                    <InputLabel>gender</InputLabel>
                    <Select
                        label="Gender"
                        value={formData.gender}
                        onChange={(e) => handleInputChange({ target: { name: 'gender', value: e.target.value } })}
                    >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Not Specified">Not Specified</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)}>Cancel</Button>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

EditCustomerModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    customer: PropTypes.object
};

export default EditCustomerModal;

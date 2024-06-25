import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({ email: '', role: '', password: '' });

    useEffect(() => {
        if (user) {
            setFormData({ email: user.email, role: user.role, password: '' });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSave = () => {
        if (formData.password === '') {
            const { password, ...rest } = formData;
            onSave({ ...user, ...rest });
        } else {
            onSave({ ...user, ...formData });
        }
    };

    return (
        <Dialog open={isOpen} onClose={() => onClose(false)} fullWidth maxWidth="sm">
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    sx={{ mb: 2 }}
                />
                <FormControl fullWidth variant="outlined" margin="dense" sx={{ mb: 2 }}>
                    <InputLabel>Role</InputLabel>
                    <Select
                        label="Role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        name="role"
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="pharmacist">Pharmacist</MenuItem>
                        <MenuItem value="pharmacist technician">Pharmacist Technician</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    margin="dense"
                    label="Password"
                    type="password"
                    placeholder='Leave blank to keep the same'
                    fullWidth
                    variant="outlined"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)}>Cancel</Button>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

EditUserModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    user: PropTypes.object,
    onSave: PropTypes.func.isRequired,
};

export default EditUserModal;

import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar.jsx';
import { db } from '../../firebaseConfig.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Box, CircularProgress, Button, Typography, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import EditCustomerModal from '../../components/modal/EditCustomerModal.jsx';
import styles from './CustomerManagement.module.scss';

const CustomersManagement = () => {
    document.title = 'Customer Management | PharmaX';
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'customers'));
            const customersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCustomers(customersData);
        } catch (error) {
            console.error('Error fetching customers: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this customer?')) return;
        setIsLoading(true);
        try {
            await deleteDoc(doc(db, 'customers', id));
            setCustomers(currentCustomers => currentCustomers.filter(customer => customer.id !== id));
            alert('Customer deleted successfully');
        } catch (error) {
            console.error('Error deleting customer: ', error);
            alert('Error deleting customer');
        }
        setIsLoading(false);
    };

    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const handleCloseModal = (refresh) => {
        setIsModalOpen(false);
        if (refresh) {
            fetchCustomers();
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <div className="flex-container">
                <Sidebar />
                <div className="content">
                    <Typography variant="h4" gutterBottom>Customer Management</Typography>
                    <p>Welcome to the customer management page where you can see a list of current customers.</p>
                    <Box mb={2}>
                        <TextField
                            variant="outlined"
                            label="Search by name or phone number"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            fullWidth
                            sx={{ mt: 2, mb: 2}}
                        />
                        <Link className={styles.AddCustomerLink} to="/app/customers/addcustomer">Add Customer</Link>
                    </Box>
                    {isLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Phone Number</th>
                                    <th>Address</th>
                                    <th>Gender</th>
                                    <th className={styles.action}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map(customer => (
                                    <tr key={customer.id}>
                                        <td>{customer.name}</td>
                                        <td>{customer.age}</td>
                                        <td>{customer.phoneNumber}</td>
                                        <td>{customer.address}</td>
                                        <td>{customer.gender}</td>
                                        <td className={styles.action}>
                                            <Button onClick={() => handleEdit(customer)}>
                                                <FontAwesomeIcon className={styles.btn_icons} icon={faPenToSquare} title="Edit" />
                                            </Button>
                                            <Button onClick={() => handleDelete(customer.id)}>
                                                <FontAwesomeIcon className={styles.btn_icons} icon={faTrash} title="Delete" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <EditCustomerModal isOpen={isModalOpen} onClose={handleCloseModal} customer={selectedCustomer} />
        </div>
    );
};

export default CustomersManagement;

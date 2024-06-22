import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar.jsx';
import styles from './InvoiceManagement.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { db } from '../../firebaseConfig.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import EditInvoiceModal from '../../components/modal/EditInvoiceModal.jsx';
import ViewInvoiceModal from '../../components/modal/ViewInvoiceModal.jsx'; // Import the view modal
import { TextField, Box } from '@mui/material';

const InvoicesManagement = () => {
    document.title = 'Invoice Management | Pharma X';
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'invoices'));
            const invoicesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a, b) => b.createdAt.seconds - a.createdAt.seconds); // Sort descending

            setInvoices(invoicesData);
            setFilteredInvoices(invoicesData);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleDelete = async (invoiceId) => {
        if (!window.confirm("Are you sure you want to delete this invoice?")) return;

        try {
            await deleteDoc(doc(db, 'invoices', invoiceId));
            setInvoices(currentInvoices => currentInvoices.filter(invoice => invoice.id !== invoiceId));
            setFilteredInvoices(currentInvoices => currentInvoices.filter(invoice => invoice.id !== invoiceId));
            alert('Invoice deleted successfully');
        } catch (error) {
            console.error('Error deleting invoice:', error);
            alert('Error deleting invoice');
        }
    };

    const handleEdit = (invoice) => {
        setSelectedInvoice(invoice);
        setEditModalOpen(true);
    };

    const handleView = (invoice) => {
        setSelectedInvoice(invoice);
        setViewModalOpen(true);
    };

    const handleCloseEditModal = (refresh) => {
        setEditModalOpen(false);
        if (refresh) {
            fetchInvoices();
        }
    };

    const handleCloseViewModal = () => {
        setViewModalOpen(false);
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredInvoices(invoices.filter(invoice => 
            invoice.id.toLowerCase().includes(query) || 
            invoice.customer.name.toLowerCase().includes(query) || 
            invoice.customer.phone.toLowerCase().includes(query)
        ));
    };

    return (
        <div>
            <EditInvoiceModal open={editModalOpen} onClose={handleCloseEditModal} invoice={selectedInvoice} />
            <ViewInvoiceModal open={viewModalOpen} onClose={handleCloseViewModal} invoice={selectedInvoice} />
            <div className="container">
                <div className="flex-container">
                    <Sidebar />
                    <div className="content">
                        <h2>Invoice Management</h2>
                        <p>Welcome to the invoice management page where you can see a list of current invoices.</p>
                        <Box mb={2} marginTop={'30px'}>
                            <TextField 
                                fullWidth 
                                variant="outlined" 
                                label="Search by ID, Customer Name, or Phone Number" 
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </Box>
                        <div className={styles["content-container"]}>
                            <Link to="/app/invoices/newinvoice">Add Invoice</Link>
                            {isLoading ? (
                                <div className={styles.spinner}></div>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Invoice ID</th>
                                            <th>Customer Name</th>
                                            <th>Total Amount</th>
                                            <th>Date</th>
                                            <th className={styles.action}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredInvoices.map(invoice => (
                                            <tr key={invoice.id}>
                                                <td>{invoice.id}</td>
                                                <td>{invoice.customer.name}</td>
                                                <td>${invoice.total.toFixed(2)}</td>
                                                <td>{new Date(invoice.createdAt.seconds * 1000).toLocaleDateString()}</td>
                                                <td className={styles.action}>
                                                    <FontAwesomeIcon className={styles.btn_icons} icon={faEye} title="View" onClick={() => handleView(invoice)} />
                                                    <FontAwesomeIcon className={styles.btn_icons} icon={faPenToSquare} title="Edit" onClick={() => handleEdit(invoice)} />
                                                    <FontAwesomeIcon className={styles.btn_icons} icon={faTrash} title="Delete" onClick={() => handleDelete(invoice.id)} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InvoicesManagement;

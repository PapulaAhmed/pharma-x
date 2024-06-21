import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar.jsx';
import styles from './InvoiceManagement.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPenToSquare, faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { db } from '../../firebaseConfig.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const InvoicesManagement = () => {
    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchInvoices = async () => {
            setIsLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, 'invoices'));
                const invoicesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setInvoices(invoicesData);
            } catch (error) {
                console.error('Error fetching invoices:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const handleDelete = async (invoiceId) => {
        if (!window.confirm("Are you sure you want to delete this invoice?")) return;

        try {
            await deleteDoc(doc(db, 'invoices', invoiceId));
            setInvoices(currentInvoices => currentInvoices.filter(invoice => invoice.id !== invoiceId));
            alert('Invoice deleted successfully');
        } catch (error) {
            console.error('Error deleting invoice:', error);
            alert('Error deleting invoice');
        }
    };

    const handleEdit = (invoiceId) => {
        console.log('Edit invoice with ID:', invoiceId);
    };

    const handleView = (invoiceId) => {
        console.log('View invoice with ID:', invoiceId);
    };

    return (
        <div>
            <div className="container">
                <div className="flex-container">
                    <Sidebar />
                    <div className="content">
                        <h2>Invoice Management</h2>
                        <p>Welcome to the invoice management page where you can see a list of current invoices.</p>
                        <div className={styles["content-container"]}>
                            <Link to="/admin/invoices/addinvoice">Add Invoice</Link>
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
                                        {invoices.map(invoice => (
                                            <tr key={invoice.id}>
                                                <td>{invoice.id}</td>
                                                <td>{invoice.customer.name}</td>
                                                <td>${invoice.total.toFixed(2)}</td>
                                                <td>{new Date(invoice.createdAt.seconds * 1000).toLocaleDateString()}</td>
                                                <td className={styles.action}>
                                                    <a onClick={() => handleView(invoice.id)} className={styles.btn_icon}>
                                                        <FontAwesomeIcon className={styles.btn_icons} icon={faEye} title="View" />
                                                    </a>
                                                    <a onClick={() => handleEdit(invoice.id)} className={styles.btn_icon}>
                                                        <FontAwesomeIcon className={styles.btn_icons} icon={faPenToSquare} title="Edit" />
                                                    </a>
                                                    <a onClick={() => handleDelete(invoice.id)} className={styles.btn_icon}>
                                                        <FontAwesomeIcon className={styles.btn_icons} icon={faTrash} title="Delete" />
                                                    </a>
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
};

export default InvoicesManagement;

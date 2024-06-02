import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/sidebar/Sidebar.jsx';
import styles from './UsersManagement.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


const UsersManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/users`)
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handleDelete = (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete user');
                }
                // Update the state to remove the user from the list
                setUsers(currentUsers => currentUsers.filter(user => user.uid !== userId));
                alert('User deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                alert('Error deleting user');
            });
    };

    const handleEdit = (userId) => {
        // Placeholder for edit functionality
        console.log('Edit user with ID:', userId);
    };

    return (
        <div>
            <div className="container">
                <div className="flex-container">
                    <Sidebar />
                    <div className="content">
                        <h2>User Management</h2>
                        <p>Welcome to the user management page where you will see a list of current users of the system.</p>
                        <div className={styles["content-container"]}>
                            <Link to="/admin/users/adduser">Add User</Link>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Email</th>
                                        <th>UID</th>
                                        <th>Display Name</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.uid}>
                                            <td>{user.email}</td>
                                            <td>{user.uid}</td>
                                            <td>{user.displayName}</td>
                                            <td>
                                                <a onClick={() => handleEdit(user.uid)} className={styles.btn_icon}>
                                                    <FontAwesomeIcon className={styles.btn_icons} icon={faPenToSquare} title="Edit" />
                                                </a>
                                                <a onClick={() => handleDelete(user.uid)} className={styles.btn_icon}>
                                                    <FontAwesomeIcon className={styles.btn_icons} icon={faTrash} title="Delete" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersManagement;

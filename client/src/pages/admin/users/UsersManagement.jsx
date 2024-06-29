import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/sidebar/Sidebar.jsx';
import styles from './UsersManagement.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPenToSquare, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uidVisibility, setUidVisibility] = useState({});  // New state for UID visibility

    useEffect(() => {
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/users`)
            .then(response => response.json())
            .then(data => {
                setUsers(data);
                // Initialize visibility state for each user
                const visibility = data.reduce((acc, user) => {
                    acc[user.uid] = false;  // Initial state as false (hidden)
                    return acc;
                }, {});
                setUidVisibility(visibility);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setIsLoading(false);
            });
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
                setUsers(currentUsers => currentUsers.filter(user => user.uid !== userId));
                alert('User deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                alert('Error deleting user');
            });
    };

    const handleEdit = (userId) => {
        console.log('Edit user with ID:', userId);
    };

    const toggleUidVisibility = (userId) => {
        setUidVisibility(prevState => ({
            ...prevState,
            [userId]: !prevState[userId]
        }));
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
                            {isLoading ? (
                                <div className={styles.spinner}></div>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>UID</th>
                                            <th>Display Name</th>
                                            <th className={styles.action}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.uid}>
                                                <td>{user.email}</td>
                                                <td onClick={() => toggleUidVisibility(user.uid)} style={{cursor: 'pointer'}}>
                                                    {uidVisibility[user.uid] ? user.uid : 'Click to show UID'}
                                                </td>
                                                <td>{user.displayName}</td>
                                                <td className={styles.action}>
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
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersManagement;

import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from '../../../components/sidebar/Sidebar.jsx';
import Modal from '../../../components/modal/ConfirmationModal.jsx'; // Import the modal component
import styles from './UsersManagement.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPenToSquare, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uidVisibility, setUidVisibility] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const fetchUsers = useCallback(() => {
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/users`)
            .then(response => response.json())
            .then(data => {
                setUsers(data.map(user => ({
                    ...user,
                    role: toSentenceCase(user.role)
                })));
                const visibility = data.reduce((acc, user) => {
                    acc[user.uid] = false;
                    return acc;
                }, {});
                setUidVisibility(visibility);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setIsLoading(false);
            });
    }, []); // Add dependencies here if there are any variables or props used inside fetchUsers
    
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);
    


    const toSentenceCase = (text) => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

    const handleDelete = (userId) => {
        setIsModalOpen(true);
        setSelectedUserId(userId);
    };

    const confirmDelete = () => {
        if (!selectedUserId) return;
        fetch(`${import.meta.env.VITE_API_URL}/users/${selectedUserId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to delete user');
            setUsers(currentUsers => currentUsers.filter(user => user.uid !== selectedUserId));
            alert('User deleted successfully');
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            alert(`Error deleting user: ${error.message}`);
        });
        closeModal();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUserId(null);
    };

    const toggleUidVisibility = (userId) => {
        setUidVisibility(prevState => ({
            ...prevState,
            [userId]: !prevState[userId]  // Toggle the visibility state
        }));
    };

    const handleEdit = (userId) => {
        console.log('Edit function not implemented yet for user:', userId);
        // You can add your navigation or state management logic here
    };
    


    

    return (
        <div>
            <Modal isOpen={isModalOpen} onClose={closeModal} onConfirm={confirmDelete}>
                Are you sure you want to delete this user?
            </Modal>
            <div className="container">
                <div className="flex-container">
                    <Sidebar />
                    <div className="content">
                        <h2>User Management</h2>
                        <p>Welcome to the user management page where you will see a list of current users of the system along with their roles.</p>
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
                                            <th>Role</th>
                                            <th className={styles.action}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.uid}>
                                                <td>{user.email}</td>
                                                <td onClick={() => toggleUidVisibility(user.uid)} style={{ cursor: 'pointer' }}>
                                                    {uidVisibility[user.uid] ? user.uid : 'Click to show UID'}
                                                </td>
                                                <td>{user.displayName}</td>
                                                <td>{user.role}</td>
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

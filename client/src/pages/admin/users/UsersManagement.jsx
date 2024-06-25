import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from '../../../components/sidebar/Sidebar.jsx';
import Modal from '../../../components/modal/ConfirmationModal.jsx';
import EditUserModal from '../../../components/modal/EditUserModal.jsx';
import styles from './UsersManagement.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uidVisibility, setUidVisibility] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    document.title = 'User Management - Pharmax';

    const fetchUsers = useCallback(() => {
        setIsLoading(true);
        const apiUrl = 'https://us-central1-pharmax-uniq.cloudfunctions.net/api/users';
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                return response.json();
            })
            .then(data => {
                setUsers(data.map(user => ({
                    ...user,
                    role: toSentenceCase(user.role || 'user') // Assuming the role is provided, defaulting to 'user'
                })));
                const visibility = data.reduce((acc, user) => {
                    acc[user.uid] = false; // Initialize visibility as false
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
        setModalMessage('Are you sure you want to delete this user?'); // Default message
    };

    const confirmDelete = () => {
        if (!selectedUserId) return;
        setIsDeleting(true); // Start loading
        fetch(`https://us-central1-pharmax-uniq.cloudfunctions.net/api/users/${selectedUserId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Failed to delete user');
                    });
                }
                setUsers(currentUsers => currentUsers.filter(user => user.uid !== selectedUserId));
                setModalMessage('User deleted successfully');
                setIsError(false);
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                setModalMessage(error.message || 'Error deleting user');
                setIsError(true);
            })
            .finally(() => {
                setIsModalOpen(false); // Close the modal after operation
                setSelectedUserId(null);
                setIsDeleting(false); // End loading
            });
    };

    const closeModal = () => {
        if (!isDeleting) { // Only allow closing if not currently deleting
            setIsModalOpen(false);
            setSelectedUserId(null);
            setModalMessage('');
            setIsError(false);
        }
    };

    const toggleUidVisibility = (userId) => {
        setUidVisibility(prevState => ({
            ...prevState,
            [userId]: !prevState[userId]  // Toggle the visibility state
        }));
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleSaveUser = (updatedUser) => {
        fetch(`https://us-central1-pharmax-uniq.cloudfunctions.net/api/users/${updatedUser.uid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update user');
                }
                return response.json();
            })
            .then(() => {
                setUsers((prevUsers) => prevUsers.map(user => (user.uid === updatedUser.uid ? updatedUser : user)));
                setIsEditModalOpen(false);
                fetchUsers(); // Fetch users again to reload the table
            })
            .catch(error => {
                console.error('Error updating user:', error);
                alert('Error updating user');
            });
    };

    return (
        <div>
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={confirmDelete}
                isError={isError}
                isLoading={isDeleting}
            >
                {isDeleting ? 'Deleting...' : modalMessage}
            </Modal>
            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={selectedUser}
                onSave={handleSaveUser}
            />
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
                                                    <a onClick={() => handleEdit(user)} className={styles.btn_icon}>
                                                        <FontAwesomeIcon className={styles.btn_icons} icon={faEdit} title="Edit" />
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

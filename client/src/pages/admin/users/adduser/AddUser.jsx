import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import the necessary Firestore functions
import { auth, db } from '../../../../firebaseConfig.js'; // Make sure this import path is correct

import Sidebar from '../../../../components/sidebar/Sidebar.jsx';
import styles from './AddUser.module.scss';

const AddUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [role, setRole] = useState('');

    const isValidEmail = email => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleAddUser = event => {
        event.preventDefault();
        const trimmedEmail = email.trim();
        const trimmedDisplayName = displayName.trim();
        const selectedRole = role; // Capture the role from state

        if (!isValidEmail(trimmedEmail)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (!selectedRole) {
            setError('Please select a role for the user.');
            return;
        }

        createUserWithEmailAndPassword(auth, trimmedEmail, password)
            .then(userCredential => {
                // First, update the profile with display name
                updateProfile(userCredential.user, { displayName: trimmedDisplayName })
                    .then(() => {
                        // Then, save the role to Firestore
                        const userRef = doc(db, "users", userCredential.user.uid); // Reference to a new doc in 'users' collection with UID
                        return setDoc(userRef, {
                            role: selectedRole,
                            email: trimmedEmail,
                            displayName: trimmedDisplayName
                        });
                    })
                    .then(() => {
                        alert('User added successfully with display name and role.');
                        setEmail('');
                        setPassword('');
                        setDisplayName('');
                        setRole('');
                        setError('');
                    })
                    .catch(error => {
                        console.error("Error saving user role:", error);
                        setError(`Failed to save user role: ${error.message}`);
                    });
            })
            .catch(error => {
                console.error("Error creating user:", error);
                let errorMessage = 'Failed to add user. Please try again.';
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'This email address is already in use.';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'The password is too weak.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'The email address is not valid.';
                }
                setError(errorMessage);
            });
    };

    return (
        <div>
            <div className="container">
                <div className="flex-container">
                    <Sidebar />
                    <div className="content">
                        <h2>Add User</h2>
                        <p>Welcome to the Add User page where you will be able to add a new user to the system.</p>
                        {error && <p className={styles.error}>{error}</p>}
                        <form className={styles.form} onSubmit={handleAddUser}>
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                            <label htmlFor="displayName">Display Name:</label>
                            <input type="text" id="displayName" name="displayName" value={displayName} onChange={e => setDisplayName(e.target.value)} />
                            <label htmlFor="role">Role:</label>
                            <select id="role" name="role" value={role} onChange={e => setRole(e.target.value)}>
                                <option value="">Select a role</option>
                                <option value="admin">Admin</option>
                                <option value="pharmacist">Pharmacist</option>
                                <option value="pharmacist technician">Pharmacist Technician</option>
                            </select>
                            <button type="submit">Add User</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUser;

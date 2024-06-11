import React from 'react'
import Sidebar from '../../../../components/sidebar/Sidebar.jsx'
import styles from './AddUser.module.scss'
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../../../../firebaseConfig.js';


const AddUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');

    const isValidEmail = email => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleAddUser = event => {
        event.preventDefault();
        const trimmedEmail = email.trim();
        const trimmedDisplayName = displayName.trim();

        if (!isValidEmail(trimmedEmail)) {
            setError('Please enter a valid email address.');
            return;
        }

        createUserWithEmailAndPassword(auth, trimmedEmail, password)
            .then(userCredential => {
                updateProfile(userCredential.user, { displayName: trimmedDisplayName })
                    .then(() => {
                        alert('User added successfully with display name.');
                        setEmail('');
                        setPassword('');
                        setDisplayName('');
                        setError('');
                    })
                    .catch(error => {
                        console.error("Error updating user information:", error);
                        setError(`Failed to update user profile: ${error.message}`);
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
            {/* < !--Flex Container --> */}
            <div className="container">
                <div className="flex-container">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Content */}
                    <div className="content">
                        <h2>Add User</h2>
                        <p>Welcome to the Add User page where you will be able to add a new user to the system.</p>
                        {error && <p className={styles.error}>{error}</p>}
                        <div className={styles.form_container}></div>
                        <form className={styles.form} onSubmit={handleAddUser}>
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" value={email}
                                onChange={e => setEmail(e.target.value)} />
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" name="password" value={password}
                                onChange={e => setPassword(e.target.value)} />
                            <label htmlFor="displayName">Display Name:</label>
                            <input type="text" id="displayName" name="displayName" value={displayName}
                                onChange={e => setDisplayName(e.target.value)} />
                            <button type="submit">Add User</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddUser
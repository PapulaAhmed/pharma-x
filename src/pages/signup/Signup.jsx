import React, { useState, useEffect } from 'react';
import styles from './Signup.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import app from '../../firebaseConfig.js';
import { Navigate, useNavigate } from 'react-router-dom';

export const Signup = () => {
    useEffect(() => {
        document.title = 'Signup | Pharma X';
    }, []);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const auth = getAuth(app);

    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        if (!email || !password || !fullName) {
            setError("Email, password, and full name cannot be empty");
            return;
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Update user profile with their full name
                updateProfile(userCredential.user, {
                    displayName: fullName
                }).then(() => {
                    console.log("Profile updated");
                    localStorage.setItem('token', userCredential.user.accessToken);
                    localStorage.setItem('user', JSON.stringify(userCredential.user));
                    setSuccess("Account created successfully");
                    navigate('/admin'); // Redirect after successful signup
                }).catch((error) => {
                    console.error("Profile update error:", error);
                });
            })
            .catch((error) => {
                console.log(error.code, error.message);
                setError(error.message); // Display Firebase errors to the user
            });
    };

    return (
        <div className={styles.container} style={{ backgroundImage: 'url(mesh-login.png)' }}>
            <div className={styles.card}>
                <div className={styles['card-container']}>
                    <div className={styles['hero-text']}>
                        <h1 className={styles['brand-hero']}>Pharma X</h1>
                        <p className={styles['welcome-msg']}>Please fill in the form</p>
                        <p className={styles['error-msg']}>{error}</p>
                        <p className={styles['success-msg']}>{success}</p>
                    </div>
                    <form className={styles['login-form']} onSubmit={handleSignup}>
                        <div className={styles['input-group']}>
                            <FontAwesomeIcon icon={faIdCard} className={styles['input-icon']} />
                            <input
                                type="text"
                                id="fullname"
                                value={fullName}
                                name="fullname"
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Full Name"
                            />
                        </div>
                        <div className={styles['input-group']}>
                            <FontAwesomeIcon icon={faUser} className={styles['input-icon']} />
                            <input
                                type="text"
                                id="email"
                                value={email}
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                            />
                        </div>
                        <div className={styles['input-group']}>
                            <FontAwesomeIcon icon={faLock} className={styles['input-icon']} />
                            <input
                                type="password"
                                id="password"
                                value={password}
                                name="password"
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                        </div>
                        <button type="submit">Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;

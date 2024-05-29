import React, { useState, useEffect } from 'react';
import './Signup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '../../src/firebaseConfig.js'; // Ensure this path matches where you export your initialized app

export const Signup = () => {
    useEffect(() => {
        document.title = 'Signup | Pharma X';
    }, []);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const auth = getAuth(app); // Use the initialized app instance

    const userSignedUp = null;

    const handleSignup = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Email and password cannot be empty");
            return;
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                const userSignedUp = true;
                setSuccess("Account created successfully");
                // Additional steps on successful signup (e.g., redirect or update UI)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(errorMessage); // Display Firebase errors to the user
            });
    };

    return (
        <div className="container">
            <div className="card">
                <div className="card-container">
                    <div className="hero-text">
                        <h1 className="brand-hero">Pharma X</h1>
                        <p className="welcome-msg">Please fill in the form</p>
                        <p className="error-msg">{error}</p>
                        <p className="success-msg">{success}</p>
                    </div>
                    <form className="login-form" onSubmit={handleSignup}>
                        <div className="input-group">
                            <FontAwesomeIcon icon={faIdCard} className="input-icon" />
                            <input
                                type="text"
                                id="fullname"
                                value={fullName}
                                name="fullname"
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Full Name"
                            />
                        </div>
                        <div className="input-group">
                            <FontAwesomeIcon icon={faUser} className="input-icon" />
                            <input
                                type="text"
                                id="email"
                                value={email}
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                            />
                        </div>
                        <div className="input-group">
                            <FontAwesomeIcon icon={faLock} className="input-icon" />
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                name="password"
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

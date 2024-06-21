import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore'; // Import Firestore functions
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
    document.title = 'Login | Pharma X';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const auth = getAuth();
    const db = getFirestore(); // Initialize Firestore
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Email and password cannot be empty");
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                console.log(user);
                // Fetch user role from Firestore
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userProfile = userDoc.data();
                    localStorage.setItem('role', userProfile.role); // Store the role in local storage
                    localStorage.setItem('token', user.accessToken); // Assuming user.accessToken exists
                    localStorage.setItem('user', JSON.stringify(user));
                    setSuccess("Account logged in successfully");

                    // Redirect based on role
                    switch (userProfile.role) {
                        case 'admin':
                            navigate('/admin');
                            break;
                        case 'pharmacist':
                            navigate('/app');
                            break;
                        case 'pharmacist technician':
                            navigate('/app');
                            break;
                        default:
                            navigate('/'); // Default redirect if role not recognized
                    }
                } else {
                    setError("No user profile found.");
                }
            })
            .catch((error) => {
                console.error(error.code, error.message);
                setError(error.message);
            });
    };

    return (
        <div style={{ backgroundImage: 'url(mesh-login.png)' }}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles['card-container']}>
                        <div className={styles['hero-text']}>
                            <h1 className={styles['brand-hero']}>Pharma X</h1>
                            <p className={styles['welcome-msg']}>Welcome Back! Please Login</p>
                            <p className={styles['error-msg']}>{error}</p>
                            <p className={styles['success-msg']}>{success}</p>
                        </div>
                        <form className={styles['login-form']} onSubmit={handleLogin}>
                            <div className={styles['input-group']}>
                                <FontAwesomeIcon icon={faUser} className={styles['input-icon']} />
                                <input type="text" id="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Username or Email" />
                            </div>
                            <div className={styles['input-group']}>
                                <FontAwesomeIcon icon={faLock} className={styles['input-icon']} />
                                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                            </div>
                            <button type="submit">Login</button>
                            <a href="/signup" className={styles.signup}>Sign Up</a>
                        </form>
                    </div>
                    <a href="#" className={styles['forgot-password']}>Forgot Password?</a>
                </div>
            </div>
        </div>
    );
};

export default Login;

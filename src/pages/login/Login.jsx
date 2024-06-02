import React from 'react'
import styles from './Login.module.css'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'; // Import the useState hook from the react package
import { Navigate, useNavigate } from 'react-router-dom';


const Login = () => {
    document.title = 'Login | Pharma X'
    const [email, setEmail] = useState(''); // State variable to hold the email value
    const [password, setPassword] = useState(''); // State variable to hold the password value
    const [error, setError] = useState(''); // State variable to hold the error message
    const [success, setSuccess] = useState(''); // State variable to hold the success message
    const auth = getAuth(); // Initialize the auth service
    const navigate = useNavigate(); // Initialize the navigate hook



    // Grabbing form data
    const handleLogin = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Email and password cannot be empty");
            return;
        }

        // check if token is already exist


        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                const userSignedUp = true;
                localStorage.setItem('token', user.accessToken);
                localStorage.setItem('user', JSON.stringify(user));
                setSuccess("Account logged in successfully");
                navigate('/admin');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                setError(errorMessage); // Display Firebase errors to the user
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
                                <input type='text' id='username' value={email} name='username' onChange={(e) => setEmail(e.target.value)} placeholder="Username or Email" />
                            </div>
                            <div className={styles['input-group']}>
                                <FontAwesomeIcon icon={faLock} className={styles['input-icon']} />
                                <input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} name='password' placeholder="Password" />
                            </div>
                            <button type='submit'>Login</button>
                            <a href='/signup' className={styles.signup}>Sign Up</a>
                        </form>
                    </div>
                    <a href='#' className={styles['forgot-password']}>Forgot Password?</a>
                </div>
            </div>
        </div>
    )
}

export default Login
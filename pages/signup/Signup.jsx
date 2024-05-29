import React from 'react'
import './Signup.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock, faIdCard } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'; // Import the useState hook from the react package
import { Navigate } from 'react-router-dom';


export const Signup = () => {

    document.title = 'Login | Pharma X'
    const [email, setEmail] = useState(''); // State variable to hold the email value
    const [password, setPassword] = useState(''); // State variable to hold the password value
    const [fullName, setFullName] = useState(''); // State variable to hold the username value
    const [error, setError] = useState(''); // State variable to hold the error message



    // Grabbing form data
    const handleLogin = (e) => {
        e.preventDefault(); // Prevents the page from reloading
        const userName = e.target.username.value; // Grabs the value of the username input field
        const password = e.target.password.value; // Grabs the value of the password input field

        console.log(email, password);

        // create a condition to check if the username and password are empty
        if (userName === '' || password === '') {
            setError('Username and Password are required');
            return;
        } else {
            setError(''); // Clear the error message
        }
    }

    const navigate = () => { Navigate("") }




    return (
        <div>
            <div className="container">
                <div className='card'>
                    <div className='card-container'>
                        <div className='hero-text'>
                            <h1 className='brand-hero'>Pharma X</h1>
                            <p className='welcome-msg'>Please fill the form</p>
                            <p className='error-msg'>{error}</p>
                        </div>
                        <form className='login-form' onSubmit={handleLogin}>
                            <div className="input-group">
                                <FontAwesomeIcon icon={faIdCard} className="input-icon" />
                                <input type='text' id='fullname' value={fullName} name='fullname' onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" />
                            </div>
                            <div className="input-group">
                                <FontAwesomeIcon icon={faUser} className="input-icon" />
                                <input type='text' id='email' value={email} name='email' onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                            </div>
                            <div className="input-group">
                                <FontAwesomeIcon icon={faLock} className="input-icon" />
                                <input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} name='password' placeholder="Password" />
                            </div>
                            <button type='submit'>Sign Up</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;
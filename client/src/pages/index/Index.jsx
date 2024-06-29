import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Sidebar from '../../components/sidebar/Sidebar.jsx';

const Index = () => {
    const [user, setUser] = useState(null); // State to hold the user object

    useEffect(() => {
        document.title = 'Pharma X'; // Set the title of the page
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                setUser(currentUser);
            } else {
                // User is signed out
                setUser(null);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <div>
            <div className="container">
                <div className="flex-container">
                    <Sidebar />
                    <div className="content">
                        <h2>Pharma X</h2>
                        {user ? (
                            <p>Welcome to Pharma X, {user.displayName || 'User'}</p> // Display name or 'User' if not available
                        ) : (
                            <p>Welcome to Pharma X</p> // Default message when no user is logged in
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;

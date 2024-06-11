const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const firebaseConfig = require('../config/serviceAccount'); // Assuming this exports the configuration

// Initialize express app
const app = express();

// Enable CORS with default settings
app.use(cors());

// Initialize Firebase Admin with service account
admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig)
});

// Root route that confirms the server is running
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Route to list users
app.get('/users', async (req, res) => {
    try {
        const listUsersResult = await admin.auth().listUsers();
        const users = listUsersResult.users.map(user => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
        }));
        res.json(users);
    } catch (error) {
        console.error('Error listing users:', error);
        res.status(500).send('Error listing users');
    }
});

// Route to delete a user
app.delete('/users/:uid', async (req, res) => {
    const uid = req.params.uid;
    try {
        await admin.auth().deleteUser(uid);
        res.send('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user');
    }
});

// Export the Express API
module.exports = app;

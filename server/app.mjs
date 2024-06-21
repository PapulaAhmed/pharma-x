import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';

const app = express();
const port = 3001;

// Import Firebase Admin SDK configuration
import serviceAccount from './pharmax-uniq-firebase-adminsdk-ai396-a89298cc66.json' assert { type: 'json' };

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Enable CORS
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.get('/users', async (req, res) => {
    console.log("Attempting to list users.");
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

console.log("Attempting to list users with roles.");
app.delete('/users/:uid', async (req, res) => {
    console.log(`Attempting to delete user with UID: ${req.params.uid}`);
    const uid = req.params.uid;
    try {
        await admin.auth().deleteUser(uid);
        console.log('User deletion successful.');
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
});

// Error-handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).send('An unexpected error occurred');
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

import express from "express";
import cors from "cors";
import admin from "firebase-admin";

// eslint-disable-next-line
import serviceAccount from "./pharmax-uniq-firebase-adminsdk.json" assert { type: "json" };

// const firebaseConfig = require('../config/serviceAccount'); // Assuming this exports the configuration

// Initialize express app
const app = express();

// Enable CORS with default settings
app.use(cors());

// Initialize Firebase Admin with service account
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Root route that confirms the server is running
app.get('/', (req, res) => {
    res.send('Server is running!');
});

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
        res.status(500).send({ message: 'Failed to retrieve users', error: error.message });
    }
});

app.delete('/users/:uid', async (req, res) => {
    const uid = req.params.uid;
    try {
        await admin.auth().deleteUser(uid);
        res.send({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Failed to delete user', error: error.message });
    }
});


// Export the Express API
export default app;

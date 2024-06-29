import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import functions from "firebase-functions";

// eslint-disable-next-line
// import serviceAccount from "./pharmax-uniq-firebase-adminsdk.json" assert { type: "json" };
// const firebaseConfig = require('../config/serviceAccount'); // Assuming this exports the configuration


// Initialize express app
const app = express();

// Enable CORS with default settings
app.use(cors());

const serviceAccount = JSON.parse(Buffer.from(functions.config().adminsdk.config, 'base64').toString('ascii'));


// Initialize Firebase Admin with service account
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});


const db = admin.firestore();


// Root route that confirms the server is running
app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.get('/users', async (req, res) => {
    try {
        const listUsersResult = await admin.auth().listUsers();
        const usersWithRoles = await Promise.all(listUsersResult.users.map(async user => {
            const docRef = db.collection('users').doc(user.uid);  // Changed from 'roles' to 'users'
            const doc = await docRef.get();
            if (!doc.exists) {
                console.log('No matching document for UID:', user.uid);
                return {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    role: 'User' // Default role if not set or document does not exist
                };
            }
            const userData = doc.data();
            return {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                role: userData.role || 'User' // Use the role from Firestore or default to 'User'
            };
        }));

        res.json(usersWithRoles);
    } catch (error) {
        console.error('Error fetching users with roles:', error);
        res.status(500).send('Error fetching users');
    }
});

console.log("Attempting to list users with roles...");
app.delete('/users/:uid', async (req, res) => {
    const uid = req.params.uid;
    try {
        // First, delete the user from Firebase Authentication
        await admin.auth().deleteUser(uid);
        console.log('User deletion in Auth successful.');

        // Then, delete the corresponding document in Firestore
        const docRef = admin.firestore().collection('users').doc(uid);
        await docRef.delete();
        console.log('Firestore document deletion successful.');

        res.status(200).json({ message: 'User and corresponding data deleted successfully' });
    } catch (error) {
        console.error('Error deleting user and data:', error);
        // Provide a detailed error message depending on which part failed
        if (error.code === 'auth/user-not-found') {
            res.status(404).json({ message: 'No user found with the provided UID', error: error.message });
        } else {
            res.status(500).json({ message: 'Failed to delete user and data', error: error.message });
        }
    }
});

app.put('/users/:uid', async (req, res) => {
    const uid = req.params.uid;
    const { role, password } = req.body;

    try {
        // Update the user's role in Firestore
        const userRef = db.collection('users').doc(uid);
        await userRef.update({ role });

        // Update the user's password in Firebase Authentication if provided
        if (password) {
            await admin.auth().updateUser(uid, { password });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
});


app.listen(3000, () => {
    console.log(`Server listening at http://localhost:3000`);
});



// Export the Express API
export default app;

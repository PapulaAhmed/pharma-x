
import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';

const app = express();
const port = 3001;

import serviceAccount from './pharmax-uniq-firebase-adminsdk-ai396-a89298cc66.json' assert { type: 'json' };


app.use(cors());


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

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
        res.status(500).send('Error listing users');

    }
});

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

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});



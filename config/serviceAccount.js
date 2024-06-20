// Check and safely use environment variables
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

// Validate environment variables and format the private key safely
if (!projectId || !clientEmail || !rawPrivateKey) {
    console.error("Firebase environment variables are missing or incorrect");
    process.exit(1);  // Exit the process with an error code
}

const privateKey = rawPrivateKey.replace(/\\n/g, '\n'); // Safely replace escaped newlines

const serviceAccount = {
    projectId: projectId,
    clientEmail: clientEmail,
    privateKey: privateKey
};

module.exports = serviceAccount;

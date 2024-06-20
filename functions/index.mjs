import * as functions from "firebase-functions";
import app from "./app.mjs"; // Adjust the path as necessary

export const api = functions.https.onRequest(app);

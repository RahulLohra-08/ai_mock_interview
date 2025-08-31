import dotenv from "dotenv";
dotenv.config(); // Load .env immediately

import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const initFirebaseAdmin = () => {
    const apps = getApps();
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    console.log("ENV PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
    console.log("ENV CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
    console.log("ENV PRIVATE_KEY exists:", privateKey);

    if(!apps.length){
        if (!privateKey) {
           throw new Error("FIREBASE_PRIVATE_KEY is missing");
        }

        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey?.replace(/\\n/g, "\n"),
            })
        })
    }

    return {
        auth: getAuth(), //authentication
        db: getFirestore() //database
        
    }
}

export const {auth, db } = initFirebaseAdmin();
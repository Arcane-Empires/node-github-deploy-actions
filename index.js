import express from 'express';
// import FirestoreHandler from './firestore/firestore_handler.js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import admin from 'firebase-admin';
import serviceAccount from './node-server-from-github-350729a70c3a.json' assert { type: 'json' };


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


async function getDocument(collectionName, documentId) {
    
    try {
        const docs = [];
        const docRef = db.collection(collectionName).doc(documentId);
        const doc = await docRef.get();

        if (doc.exists) {
            console.log("Document data:", doc.data());
            docs.push(doc.data().username);
        } else {
            console.log("No such document!");
        }
        return docs;

    } catch (error) {
        console.error("Error getting document:", error);
        return null;
    }
}
  

const app = express();
const port = 8080;

app.get('/', async (req, res) => {
    const collectionData = await getDocument('users', 'jonnysmith696910');
    if (collectionData) {
        res.send(collectionData[0]);
    }
    else{
        res.send('Hello World!');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
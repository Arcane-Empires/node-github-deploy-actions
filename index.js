import express from 'express';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import admin from 'firebase-admin';


const app = express();
const port = 8080;

const secretmanagerClient = new SecretManagerServiceClient()

// Construct request
const request = {
    name: 'projects/379840034411/secrets/node-server-admin/versions/latest',
};

await secretmanagerClient.accessSecretVersion(request).then((data) => {
    const secretData = JSON.parse(Buffer.from(data[0].payload.data, 'utf8').toString());
    admin.initializeApp({
        credential: admin.credential.cert(secretData)
    });
}).catch((err) => {
    console.error(err);
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

app.get('/', async (req, res) => {
    res.send('Hello World!');
});

app.get('/api/user', async (req, res) => {
    const collectionData = await getDocument('users', 'jonnysmith696910');
    if (collectionData) {
        return res.status(200).json(collectionData);
    }
    else{
        return res.status(404).json({ error: 'User not found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
const express = require('express');
const admin = require('firebase-admin');
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
const port = process.env.PORT || 8080;

// -- START FIREBASE INITIALIZATION --
// IMPORTANT:
// 1. Download your service account key from the Google Cloud Console.
// 2. Save it as 'serviceAccountKey.json' in this 'backend' directory.
// 3. Make sure to add 'serviceAccountKey.json' to your .gitignore file to keep it private!
try {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin SDK initialized successfully.');
} catch (error) {
  console.error('Firebase Admin SDK initialization failed.', error);
  console.error('Please ensure serviceAccountKey.json is present in the backend directory.');
}

const db = admin.firestore();
// -- END FIREBASE INITIALIZATION --


app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

// Endpoint to get all vehicle locations
app.get('/api/vehicles', async (req, res) => {
    try {
        const vehiclesRef = db.collection('vehicles');
        const snapshot = await vehiclesRef.get();
        if (snapshot.empty) {
            return res.status(200).json({});
        }
        const vehicles = {};
        snapshot.forEach(doc => {
            vehicles[doc.id] = doc.data();
        });
        res.status(200).json(vehicles);
    } catch (error) {
        console.error('Error getting vehicles:', error);
        res.status(500).send({ message: 'Error getting vehicle data' });
    }
});

// Endpoint to receive GPS data
app.post('/api/gps', async (req, res) => {
    const { id, lat, lng } = req.body;
    if (!id || lat === undefined || lng === undefined) {
        return res.status(400).send({ message: 'Invalid GPS data. "id", "lat", and "lng" are required.' });
    }
    console.log('Received GPS data:', req.body);

    try {
        const vehicleRef = db.collection('vehicles').doc(id);
        // Using set with merge: true will create the document if it doesn't exist,
        // or update it if it does.
        await vehicleRef.set({ lat, lng }, { merge: true });
        res.status(200).send({ message: 'GPS data received and saved' });
    } catch (error) {
        console.error('Error saving GPS data:', error);
        res.status(500).send({ message: 'Error saving GPS data' });
    }
});

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
});

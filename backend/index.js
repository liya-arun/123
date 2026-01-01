const express = require('express');
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
const port = process.env.PORT || 8080;

// In-memory data store for vehicles
const vehicles = {
    'bus1': { lat: -3.745, lng: -38.523 },
    'bus2': { lat: -3.750, lng: -38.530 },
};

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

// Endpoint to get all vehicle locations
app.get('/api/vehicles', (req, res) => {
    res.status(200).json(vehicles);
});

// Endpoint to receive GPS data
app.post('/api/gps', (req, res) => {
    const { id, lat, lng } = req.body;
    if (!id || !lat || !lng) {
        return res.status(400).send({ message: 'Invalid GPS data' });
    }
    console.log('Received GPS data:', req.body);
    
    vehicles[id] = { lat, lng };

    res.status(200).send({ message: 'GPS data received' });
});

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
});

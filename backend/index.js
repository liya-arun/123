const express = require('express');
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

// Endpoint to receive GPS data
app.post('/api/gps', (req, res) => {
    console.log('Received GPS data:', req.body);
    // In a real application, you would publish this data to a Pub/Sub topic
    res.status(200).send({ message: 'GPS data received' });
});

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
});
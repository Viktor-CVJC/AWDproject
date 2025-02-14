const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Venue = require('./models/venue');

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//MongoDB connection
mongoose.connect('mongodb://localhost:27017/jkpgcity', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to mongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

//REST API endpoints and GET all venues
app.get('/api/venues', async (req, res) => {
    try {
        const venues = await Venue.find();
        res.json(venues);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching venues' });
    }
});

//POST new venue (testing)
app.post('/api/venues', async (req, res) => {
    try {
        const venue = new Venue(req.body);
        await venue.save();
        res.status(201).json(venue);
    } catch (error) {
        res.status(400).json({ message: 'Error creating venue' });
    }
});

module.exports = app;
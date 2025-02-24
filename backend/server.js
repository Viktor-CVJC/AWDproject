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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const district = req.query.district;
        const skip = (page - 1) * limit;

        const query = district ? { district: district } : {};
        
        console.log('Query:', query);
        
        const venues = await Venue.find(query)
            .skip(skip)
            .limit(limit);
            
        const total = await Venue.countDocuments(query);
        
        console.log('Found venues:', venues.length);
        console.log('Total:', total);

        res.json({
            venues,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error fetching venues' });
    }
});

//GET single venue
app.get('/api/venues/:id', async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        res.json(venue);
    } catch (error) {
        res.status(404).json({ message: 'Venue not found' });
    }
});

//POST new venue
app.post('/api/venues', async (req, res) => {
    try {
        const newVenue = new Venue({
            name: req.body.name,
            url: req.body.url,
            district: req.body.district
        });
        
        const savedVenue = await newVenue.save();
        res.status(201).json(savedVenue);
    } catch (error) {
        res.status(500).json({ message: 'Error creating venue' });
    }
});

//PUT (update) venue
app.put('/api/venues/:id', async (req, res) => {
    try {
        const updatedVenue = await Venue.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                url: req.body.url,
                district: req.body.district
            },
            { new: true }
        );
        res.json(updatedVenue);
    } catch (error) {
        res.status(500).json({ message: 'Error updating venue' });
    }
});

//DELETE venue
app.delete('/api/venues/:id', async (req, res) => {
    try {
        await Venue.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting venue' });
    }
});

module.exports = app;

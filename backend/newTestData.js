const mongoose = require('mongoose');
const Venue = require('./models/venue');
const venues = require('./data/venueData.js');

mongoose.connect('mongodb://localhost:27017/jkpgcity', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const seedData = async () => {
    try {
        await Venue.deleteMany({});
        await Venue.insertMany(venues);
        console.log('New venue data successfully loaded');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedData();

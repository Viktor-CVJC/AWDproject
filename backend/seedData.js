const mongoose = require('mongoose');
const Venue = require('./models/venue');
const venueData = require('./data/venueData.js');

mongoose.connect('mongodb://localhost:27017/jkpgcity', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to MongoDB');
    
    await Venue.deleteMany({});
    
    await Venue.insertMany(venueData);
    
    console.log(`Database seeded with ${venueData.length} venues!`);
    mongoose.connection.close();
}).catch(err => {
    console.error('Error seeding database:', err);
    process.exit(1);
});

const mongoose = require('mongoose');
const Venue = require('./models/venue'); 

const testVenues = [
    {
        name: "Restaurang Hemma",
        type: "restaurant",
        address: "Klostergatan 22, 553 35 Jönköping",
        description: "Modern Swedish cuisine in the heart of Jönköping"
    },
    {
        name: "The Bishop's Arms",
        type: "bar",
        address: "Västra Storgatan 12, 553 15 Jönköping",
        description: "British pub with extensive beer selection"
    },
    {
        name: "Asecs Shopping Center",
        type: "shopping",
        address: "Kompanigatan 1, 553 05 Jönköping",
        description: "Large shopping mall with various stores"
    }
];

// Connection to mongoDB
mongoose.connect('mongodb://localhost:27017/jkpgcity', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Function to seed data
const seedData = async () => {
    try {
        await Venue.deleteMany({});
        await Venue.insertMany(testVenues);
        console.log('Test data successfully loaded');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedData();
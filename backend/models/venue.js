const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
    name: String,
    type: String,
    address: String,
    description: String
});

module.exports = mongoose.model('Venue', venueSchema);
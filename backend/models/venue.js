const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
    name: String,
    url: String,
    district: String
});

module.exports = mongoose.model('Venue', venueSchema);
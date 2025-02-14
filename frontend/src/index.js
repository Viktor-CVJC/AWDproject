document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting fetch');
    fetchVenues();
});

async function fetchVenues() {
    console.log('Inside fetchVenues');
    try {
        let response = await fetch('http://localhost:5000/api/venues');
        let venues = await response.json();
        console.log('Venues received:', venues);
        displayVenues(venues);
    } catch (error) {
        console.log('Error details:', error);
    }
}

function displayVenues(venues) {
    const venuesList = document.getElementById('venues-list');
    venuesList.innerHTML = venues.map(venue => `
        <div class="venue-card">
            <h2>${venue.name}</h2>
            <div class="venue-details">
                <p class="venue-type">${venue.type}</p>
                <p class="venue-address">${venue.address}</p>
                <p class="venue-description">${venue.description}</p>
            </div>
        </div>
    `).join('');
}

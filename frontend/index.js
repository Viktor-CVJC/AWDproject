let currentPage = 1;
const venuesPerPage = 9;
let selectedDistrict = '';

const modal = document.getElementById('venue-form-modal');
const addVenueBtn = document.getElementById('add-venue-btn');
const closeModalBtn = document.getElementById('close-modal');
const venueForm = document.getElementById('venue-form');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting fetch');
    fetchVenues();
    
    // Add district filter event listener
    document.getElementById('district-filter').addEventListener('change', (e) => {
        selectedDistrict = e.target.value;
        currentPage = 1; 
        fetchVenues();
    });
    
    // Existing pagination listeners
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchVenues();
        }
    });
    
    document.getElementById('next-page').addEventListener('click', () => {
        currentPage++;
        fetchVenues();
    });

    // Modal event listeners
    addVenueBtn.addEventListener('click', () => {
        // Reset form when adding new venue
        venueForm.reset();
        delete venueForm.dataset.editId;
        document.querySelector('.modal-content h2').textContent = 'Add New Venue';
        modal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal if clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Form submission
    venueForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const venueData = {
            name: document.getElementById('venue-name').value,
            url: document.getElementById('venue-url').value,
            district: document.getElementById('venue-district').value
        };

        const editId = venueForm.dataset.editId;
        const method = editId ? 'PUT' : 'POST';
        const url = editId 
            ? `http://localhost:3000/api/venues/${editId}`
            : 'http://localhost:3000/api/venues';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(venueData)
            });

            if (response.ok) {
                modal.style.display = 'none';
                venueForm.reset();
                delete venueForm.dataset.editId;
                document.querySelector('.modal-content h2').textContent = 'Add New Venue';
                fetchVenues();
            }
        } catch (error) {
            console.error('Error saving venue:', error);
        }
    });
});

async function fetchVenues() {
    console.log('Fetching page:', currentPage, 'District:', selectedDistrict);
    try {
        let url = `http://localhost:3000/api/venues?page=${currentPage}&limit=${venuesPerPage}`;
        if (selectedDistrict) {
            url += `&district=${selectedDistrict}`;
        }
        
        console.log('Fetching URL:', url);
        let response = await fetch(url);
        let data = await response.json();
        console.log('VENUE DATA HERE:', data.venues[0]);
        console.log('ALL VENUES:', data.venues);
        
        if (data.venues && data.venues.length > 0) {
            displayVenues(data.venues);
            updatePaginationControls(data.total);
        } else {
            console.log('No venues found');
            document.getElementById('venues-list').innerHTML = '<p>No venues found</p>';
        }
    } catch (error) {
        console.log('Error details:', error);
    }
}

function updatePaginationControls(totalVenues) {
    const totalPages = Math.ceil(totalVenues / venuesPerPage);
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages;
    
    if (currentPage > totalPages) {
        currentPage = 1;
        fetchVenues();
    }
}

function displayVenues(venues) {
    const venuesList = document.getElementById('venues-list');
    venuesList.innerHTML = venues.map(venue => `
        <div class="venue-card">
            <div class="venue-actions">
                <button onclick="editVenue('${venue._id}')" class="edit-btn">Edit</button>
                <button onclick="deleteVenue('${venue._id}')" class="delete-btn">Delete</button>
            </div>
            <h2>${venue.name}</h2>
            <div class="venue-details">
                <p class="venue-district">${venue.district || 'No district'}</p>
                ${venue.url ? `<a href="https://${venue.url}" target="_blank" class="venue-url">Visit Website</a>` : ''}
            </div>
        </div>
    `).join('');
}












async function editVenue(venueId) {
    const response = await fetch(`http://localhost:3000/api/venues/${venueId}`);
    const venue = await response.json();
    
    // Populate form with venue data
    document.getElementById('venue-name').value = venue.name;
    document.getElementById('venue-url').value = venue.url || '';
    document.getElementById('venue-district').value = venue.district || '';
    
    // Update form for edit mode
    document.querySelector('.modal-content h2').textContent = 'Edit Venue';
    venueForm.dataset.editId = venueId;
    modal.style.display = 'block';
}

async function deleteVenue(venueId) {
    if (confirm('Are you sure you want to delete this venue?')) {
        try {
            await fetch(`http://localhost:3000/api/venues/${venueId}`, {
                method: 'DELETE'
            });
            fetchVenues();
        } catch (error) {
            console.error('Error deleting venue:', error);
        }
    }
}

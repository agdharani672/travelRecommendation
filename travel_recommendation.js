let travelData = null;   // store JSON data globally

// Load travel JSON
document.addEventListener('DOMContentLoaded', () => {
    fetch('./travel_recommendation.json')
        .then(response => response.json())
        .then(data => {
            travelData = data; // save data for searching
        })
        .catch(error => console.error("Error loading JSON:", error));

    // Attach button events
    document.querySelector('.search-button').addEventListener('click', handleSearch);
    document.querySelectorAll('.search-button')[1].addEventListener('click', clearResults);
});


// Search button handler
function handleSearch() {
    const keywordInput = document.querySelector('.search-input').value.trim().toLowerCase();
    if (!keywordInput) return;

    const results = getSearchResults(keywordInput);
    renderResults(results);
}


// Logic to match beaches, temples, or countries/cities
function getSearchResults(keyword) {
    const results = [];

    // keyword variations
    const isBeach = keyword === "beach" || keyword === "beaches";
    const isTemple = keyword === "temple" || keyword === "temples";

    if (isBeach) {
        results.push(...travelData.beaches);
    } else if (isTemple) {
        results.push(...travelData.temples);
    } else {
        // Match country names or city names
        const countryMatch = travelData.countries.find(c => c.name.toLowerCase().includes(keyword));

        if (countryMatch) {
            results.push(...countryMatch.cities);
        } else {
            // match city directly if user types "tokyo" etc.
            travelData.countries.forEach(country => {
                country.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(keyword)) {
                        results.push(city);
                    }
                });
            });
        }
    }

    return results;
}


// Render search results on UI
function renderResults(items) {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = ""; // clear previous

    if (!items || items.length === 0) {
        container.innerHTML = `<p>No results found. Try: beach, temple, japan, sydney...</p>`;
        return;
    }

    items.slice(0, 4).forEach(place => {     // show min 2 results, max 4
        container.appendChild(createCard(place.name, place.imageUrl, place.description));
    });
}


// Clear button logic
function clearResults() {
    const container = document.getElementById('cardsContainer');
    const inputField = document.querySelector('.search-input');

    container.innerHTML = "";
    inputField.value = "";
}


// Card UI
function createCard(name, imageUrl, description) {
    const card = document.createElement('div');
    card.classList.add('destination-card');

    card.innerHTML = `
        <div class="destination-image">
            <img src="${imageUrl}" alt="${name}" />
        </div>
        <h2>${name}</h2>
        <p>${description}</p>
    `;
    
    return card;
}

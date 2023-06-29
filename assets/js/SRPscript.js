//initial Marvel API fetch code
var id = ""

entry = "Sp"
if (entry!=="") {
    entry = "nameStartsWith=" + entry + "&"
}

let idscrapper = "https://gateway.marvel.com/v1/public/characters?" + entry + "ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518"
fetch (idscrapper)
.then(function (response) {
    response.json().then(function(data) {
        id = data.data.results[0].id 
        console.log(id)
        let comicscrapper = "https://gateway.marvel.com/v1/public/characters/" + id +"/comics?ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518"
        fetch (comicscrapper)
        .then(function (response2) {
            response2.json().then(function(data) {
            console.log(data)
    })
    })
})})

/*
let comicscrapper = "https://gateway.marvel.com/v1/public/characters/" + id +"/comics?ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518"
fetch (comicscrapper)
.then(function (response) {
    response.json().then(function(data) {
        console.log(data)
    })
})*/

// initial Wiki API code
const urlParams = new URLSearchParams(window.location.search);
const queryFromURL = urlParams.get('query');

// Get the form element
const form = document.getElementById('form');

// Get the input field
const userInput = document.getElementById('userInput');

// Set the value of the input field to the query from the URL
userInput.value = queryFromURL;

// Function to fetch and display search results
function fetchSearchResults(query) {
  // Send the API request to your proxy server
  fetch('http://localhost:3000/wiki-proxy?q=' + encodeURIComponent(query))
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // Parse the response and extract the first paragraph
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      const extract = pages[pageId].extract;
      
      // Extract the first paragraph
      const firstParagraph = extract.split('\n')[0];
      
      // Display the first paragraph
      document.getElementById('wikipedia-display').textContent = firstParagraph;
    })
    .catch(function(error) {
      console.log('Error:', error);
    });
}

// Call fetchSearchResults function immediately with the query
fetchSearchResults(queryFromURL);

// Add an event listener to the form submit event
form.addEventListener('submit', function(event) {
  event.preventDefault(); 
  console.log('Form submitted!');
  
  // Get the search query from the form input field
  const queryFromInput = userInput.value;

  // Determine the final search query to use
  const query = queryFromInput || queryFromURL;

  // Call fetchSearchResults function
  fetchSearchResults(query);
});

//initial Marvel API fetch code
var id = ""
var characterIndex = 0
var characterName = ""
var comics_list = document.getElementById("search-results-container")

entry = "Spi"
if (entry!=="") {
    entry = "nameStartsWith=" + entry + "&"
}

let idscrapper = "https://gateway.marvel.com/v1/public/characters?" + entry + "ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518"
fetch (idscrapper)
.then(function (response) {
    response.json().then(function(data) {
        console.log(data.data.results[characterIndex].comics.available)
        while (true) {
            if (data.data.results[characterIndex].comics.available>0) {
                id = data.data.results[characterIndex].id
                console.log(data.data.results[characterIndex].name)
                characterName = data.data.results[characterIndex].name
                break;
            }
            characterIndex++;
        }
        let comicscrapper = "https://gateway.marvel.com/v1/public/characters/" + id +"/comics?ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518"
        fetch (comicscrapper)
        .then(function (response2) {
            response2.json().then(function(data) {
            for (i=0;i<data.data.results.length;i++) {
                currentComic = document.createElement("li")
                currentComic.textContent = data.data.results[i].title
                comics_list.appendChild(currentComic)
            }
    })
    })
})})

// Initial Wiki API code
const urlParams = new URLSearchParams(window.location.search);
const queryFromURL = urlParams.get('query');
const form = document.getElementById('form');
const userInput = document.getElementById('userInput');

// Set the value of the input field to the query from the URL
userInput.value = queryFromURL;

// Function to fetch and display search results
function fetchSearchResults(query) {
  // Send the API request to proxy server
  fetch('http://localhost:3000/wiki-proxy?q=' + encodeURIComponent(query))
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // Parse the response and extract the first paragraph
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      const extract = pages[pageId].extract;
      
      // Extract only the first paragraph
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

// Clear the input field and reset search results when the page is refreshed
window.addEventListener('beforeunload', function() {
  userInput.value = '';
  document.getElementById('wikipedia-display').textContent = '';
});

// Error Message Modal
const modal = document.getElementById('myModal');
const closeBtn = document.getElementsByClassName('close')[0];

form.addEventListener('submit', function(event) {
  event.preventDefault(); 
  console.log('Form submitted!');
  
  // Get the search query from the form input field
  const queryFromInput = userInput.value;

  if (userInput.value.trim() === '') {
    modal.style.display = 'block';
  } else {
    // Get the search query from the form input field
    const query = userInput.value;
  
    // Redirect to the search results page with the query as a URL parameter
    window.location.href = 'searchResultsPage.html?query=' + encodeURIComponent(query);
  }
});


closeBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});

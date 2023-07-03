// Initial Wiki API code
var id = "";
var characterIndex = 0;
var characterName = "";
var comics_list = document.getElementById("search-results-container");
var urlParams = new URLSearchParams(window.location.search);
var queryFromURL = urlParams.get('query');
var form = document.getElementById('form'); // Get the form element
var userInput = document.getElementById('userInput');
var Search_btn = document.getElementById('searchBtn');
var entry = "";
var recent_searches_container = document.getElementById('recent-container');
var recent_searches = localStorage.getItem('recent-searches');
var is_recent_searches = false;

//I'm still working on this recent Searches function - Jimmy
function append_recent_search_li_element(event) {
  event.preventDefault();
  if (recent_searches !== null && recent_searches.trim() !== "") {
    var recent_searches_ls = recent_searches.split("|");
    is_recent_searches = true;
  }
  if (is_recent_searches == true) {
    var recent_search_div = document.createElement("div");
    recent_search_div.textContent = recent_searches_ls[recent_searches_ls.length - 1];
    recent_searches_container.appendChild(recent_search_div);
  }
}

function append_recent_search() {
  if (recent_searches !== null) {
    recent_searches = recent_searches + "|" + characterName.trim();
  } else {
    recent_searches = characterName;
  }
  localStorage.setItem('recent-searches', recent_searches);
}

function Search_Comics(event) {
  event.preventDefault();
  while (comics_list.childElementCount > 0) {
    comics_list.children[0].remove();
  }
  entry = userInput.value.trim();
  if (entry !== "") {
    entry = "nameStartsWith=" + entry + "&";
  }
  let idscrapper = "https://gateway.marvel.com/v1/public/characters?" + entry + "limit=50&ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518";
  fetch(idscrapper)
    .then(function (response) {
      response.json().then(function (data) {
        if (data.data.results.length > 0) {
          while (true) {
            console.log(data.data.results[characterIndex].comics.available);
            if (data.data.results[characterIndex].comics.available > 0) {
              id = data.data.results[characterIndex].id;
              characterName = data.data.results[characterIndex].name;
              console.log(characterName);
              append_recent_search();
              break;
            }
            characterIndex++;
            if (characterIndex === 50) {
              console.log("No results returned");
              ///This is where you display the alert that no results were returned
              break;
            }
          }
          let comicscrapper = "https://gateway.marvel.com/v1/public/characters/" + id + "/comics?limit=10&ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518";
          fetch(comicscrapper)
            .then(function (response2) {
              response2.json().then(function (data) {
                for (i = 0; i < data.data.results.length; i++) {
                  currentComic = document.createElement("li");
                  currentComic.textContent = data.data.results[i].title;
                  comics_list.appendChild(currentComic);
                }
              });
            });
        } else {
          console.log("No results returned");
          ///This is where you display the alert that no results were returned
        }
      });
    });
}

Search_btn.addEventListener("click", Search_Comics);
Search_btn.addEventListener("click", append_recent_search_li_element);

// Function to fetch and display search results
function fetchSearchResults(query) {
  // Send the API request to your proxy server
  fetch('http://localhost:3000/wiki-proxy?q=' + encodeURIComponent(query))
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Parse the response and extract the first paragraph
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      const extract = pages[pageId].extract;

      // Extract the first paragraph
      const firstParagraph = extract.split('\n')[0];

      // Display the first paragraph
      document.getElementById('wikipedia-display').textContent = firstParagraph;
    })
    .catch(function (error) {
      console.log('Error:', error);
    });
}

// Call fetchSearchResults function immediately with the query
fetchSearchResults(queryFromURL);

// Add an event listener to the form submit event
form.addEventListener('submit', function (event) {
  event.preventDefault();
  console.log('Form submitted!');

  // Get the search query from the form input field
  const queryFromInput = userInput.value;

  // Determine the final search query to use
  const query = queryFromInput || queryFromURL;

  // Call fetchSearchResults function
  fetchSearchResults(query);
});

// Clear the input field and reset search results when the page is refreshed
window.addEventListener('beforeunload', function () {
  userInput.value = '';
  document.getElementById('wikipedia-display').textContent = '';
});

// Error Message Modal
const modal = document.getElementById('myModal');
const closeBtn = document.getElementsByClassName('close')[0];

form.addEventListener('submit', function (event) {
  event.preventDefault();
  console.log('Form submitted!');

  // Get the search query from the form input field
  const queryFromInput = userInput.value;

  if (userInput.value.trim() === '') {
    modal.style.display = 'block';fe
  } else {
    // Get the search query from the form input field
    const query = userInput.value;

    // Redirect to the search results page with the query as a URL parameter
    window.location.href = 'searchResultsPage.html?query=' + encodeURIComponent(query);
  }
});

closeBtn.addEventListener('click', function () {
  modal.style.display = 'none';
});

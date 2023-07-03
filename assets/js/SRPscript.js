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

  event.preventDefault()
  if (recent_searches!==null && recent_searches.trim()!=="") {
    var recent_searches_ls = recent_searches.split("|")
    is_recent_searches = true
  }  
  if (is_recent_searches==true) {
  var recent_search_div = document.createElement("button")
  recent_search_div.setAttribute('class', 'last-search')
  recent_search_div.textContent = recent_searches_ls[recent_searches_ls.length-1]
  recent_searches_container.appendChild(recent_search_div)
  recent_search_div.addEventListener("click", function (event) {
    event.preventDefault()
    userInput.value = recent_searches_ls[recent_searches_ls.length-1]
    Search_btn.click()
  })

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

// Function to fetch and display search results from Wikipedia API
function fetchSearchResults(query) {
  // Construct the API URL for fetching search results from Wikipedia
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(query)}`;

  // Fetch search results from Wikipedia API
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.hasOwnProperty('query') && data.query.hasOwnProperty('pages')) {
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        const extract = pages[pageId].extract;

        // Extract the first paragraph
        const firstParagraph = extract.split('\n')[0];

        // Display the first paragraph
        document.getElementById('wikipedia-display').textContent = firstParagraph;

        // Construct the full Wikipedia URL using the page ID
        const fullUrl = `https://en.wikipedia.org/?curid=${pageId}`;

        // Display the extract
        // document.getElementById('wiki-extract').textContent = extract;

        // Display a link to the full article
        const fullWikiLink = document.getElementById('full-wiki-link');
        fullWikiLink.href = fullUrl;
        fullWikiLink.style.display = 'inline';
      } else {
        // If 'pages' property is missing, display an error message or handle it gracefully
        console.log("Pages not found in the response.");
      }
    })
    .catch(function (error) {
      console.log('Error:', error);
    });
}

// Call fetchSearchResults function immediately with the query from the URL
fetchSearchResults(queryFromURL);

// // Add an event listener to the form submit event
// form.addEventListener('submit', function (event) {
//   event.preventDefault();
//   console.log('Form submitted!');

//   // Get the search query from the form input field
//   const queryFromInput = userInput.value;

//   // Determine the final search query to use - either from landing page or form input
//   const query = queryFromInput || queryFromURL;

//   // Call fetchSearchResults function
//   fetchSearchResults(query);
// });

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
    modal.style.display = 'block';
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


// var publicKey;
// var timestamp;
// var apiUrl;


// //Search function that dynamically creates a list for searched characters (id) + image thumbnail from comic object
// document.getElementById("form").addEventListener("submit", function(event) {
//   event.preventDefault();
//   console.log("search submitted!");

//   // Get the search query
//   var query = document.getElementById("userInput").value;

//   // Send the API request to fetch character data by name
//   fetchCharacter(query)
//     .then(function(characterData) {
//       var characterId = characterData.id;

//       // Fetch comics data for the character by ID
//       return fetchCharacterComics(characterId);
//     })
//     .then(function(comicsData) {
//       // Display the character and comics data
//       displayCharacterAndComics(comicsData);
//     })
//     .catch(function(error) {
//       console.log("Error:", error);
//     });
// });

// // Function to fetch character data by name
// function fetchCharacter(name) {
//   var publicKey = "7eb8329799fa8406819851c63f0c36b3";
//   var timestamp = Date.now().toString();
//   var apiUrl = "https://gateway.marvel.com/v1/public/characters?name=" + encodeURIComponent(name) + "&ts=" + timestamp + "&apikey=" + publicKey;

//   return fetch(apiUrl)
//     .then(function(response) {
//       return response.json();
//     })
//     .then(function(data) {
//       return data.data.results[0]; // Return the first character object
//     });
// }


// // Function to fetch comics data for a character by ID
// function fetchCharacterComics(characterId) {
//   var publicKey = "7eb8329799fa8406819851c63f0c36b3";
//   var timestamp = Date.now().toString();
//   var apiUrl = "https://gateway.marvel.com/v1/public/characters/" + characterId + "/comics?ts=" + timestamp + "&apikey=" + publicKey;

//   return fetch(apiUrl)
//     .then(function(response) {
//       return response.json();
//     })
//     .then(function(data) {
//       var comicsData = data.data.results;

//       // Extract relevant information from the comic objects
//       var comics = comicsData.map(function(comic) {
//         return {
//           id: comic.id,
//           thumbnail: comic.thumbnail.path + "." + comic.thumbnail.extension
//         };
//       });

//       return comics; // Return the array of comics with ID and thumbnail
//     });
// }

// // Function to display the character and comics data
// function displayCharacterAndComics(comicsData) {
//   var resultsContainer = document.getElementById("search-results-container");

//   // Clear the existing content in the results container
//   resultsContainer.innerHTML = "";

//   // Create a list element
//   var list = document.createElement("ul");

//   // Iterate over the comics data and create list items
//   comicsData.forEach(function(comic) {
//     // Extract relevant information from the comic object
//     var comicId = comic.id;
//     var thumbnail = comic.thumbnail;

//     // Create list item elements and set their content
//     var listItem = document.createElement("li");
//     var comicIdElement = document.createElement("p");
//     var imageElement = document.createElement("img");

//     comicIdElement.textContent = "Comic ID: " + comicId;
//     imageElement.src = thumbnail;

//     // Append the elements to the list item
//     listItem.appendChild(comicIdElement);
//     listItem.appendChild(imageElement);

//     // Append the list item to the list
//     list.appendChild(listItem);
//   });

//   // Append the list to the results container
//   resultsContainer.appendChild(list);
// }

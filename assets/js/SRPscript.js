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


function sort_chars(array) { 
  for (var i=0;i<(array.length-1);i++){
      var swp = false
      for (var j=0;j<(array.length-i-1);j++){
          if (array[j].comics.available >array[j+1].comics.available) {
              var temp = array [j]
              array[j]=array[j+1]
              array[j+1] = temp
              swp = true
          }
      }
  if (!swp) {
      break;
  }
  }
  return(array)
}

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
let idscrapper = "https://gateway.marvel.com/v1/public/characters?" + entry + "limit=50&ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518"
fetch (idscrapper)
.then(function (response) {
  response.json().then(function(data) {
    if (data.data.results.length>0) {
      var results_given = data.data.results
      results_given = sort_chars(results_given)
      results_given = results_given.reverse()
      while (true) {
        console.log(results_given[characterIndex].comics.available)
          if (results_given[characterIndex].comics.available>0) {
              id = results_given[characterIndex].id
              characterName = results_given[characterIndex].name
              console.log(characterName)
              append_recent_search()
              break;
            }
          characterIndex++;
          if (characterIndex===50) {
            characterIndex = 0
            console.log("No results returned")
            ///This is where you display the alert that no results were returned
            break;
          }
      }
      let comicscrapper = "https://gateway.marvel.com/v1/public/characters/" + id +"/comics?limit=10&ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518"
      fetch (comicscrapper)
      .then(function (response2) {
        console.log(data.data.results)
          response2.json().then(function(data) {
            console.log(data.data.results)
            for (i=0;i<data.data.results.length;i++) {
                currentComic = document.createElement("li")
                currentComic.textContent = data.data.results[i].title
                comics_list.appendChild(currentComic)
            }
  })
  })
    } else {
      console.log("No results returned")
      ///This is where you display the alert that no results were returned
    }
})})
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



// function fetchComicThumbnails(entry) {
//   // Construct the API URL to fetch comics for the character
//   var comicsUrl =
//     "https://gateway.marvel.com/v1/public/characters?" +
//     entry +
//     "&limit=10&ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518";
// console.log(entry);
//   fetch(comicsUrl)
//     .then(function (response) {
//       if (!response.ok) {
//         throw new Error("Failed to fetch comics for the character. Status: " + response.status);
//       }
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       if (!data.data || !data.data.results || data.data.results.length === 0) {
//         throw new Error("No comics found for the character" + entry);
//       }


//       // Extract the comic data from the response
//       var comicsData = data.data.results;

//       // Clear the existing list items
//       while (comics_list.firstChild) {
//         comics_list.removeChild(comics_list.firstChild);
//       }

//       // Loop through the comic data and create list items with thumbnail images
//       comicsData.forEach(function (comic) {
//         var comicListItem = document.createElement("li");
//         var comicTitle = document.createElement("span");
//         var comicThumbnail = document.createElement("img");

//         comicTitle.textContent = comic.title;

//         if (comic.thumbnail && comic.thumbnail.path && comic.thumbnail.extension) {
//           var thumbnailUrl = comic.thumbnail.path + "." + comic.thumbnail.extension;
//           comicThumbnail.src = thumbnailUrl;
//           comicThumbnail.alt = comic.title;
//         } else {
//           console.log("Missing thumbnail data for comic:", comic.title);
//         }

//         comicListItem.appendChild(comicThumbnail);
//         comicListItem.appendChild(comicTitle);
//         comics_list.appendChild(comicListItem);
//       });
//     })
//     .catch(function (error) {
//       console.log("Error fetching comic thumbnails:", error);
//     });
// }

// // Assuming you have the entry value
// var entry = "nameStartsWith=Spider-Man";

// // Call fetchComicThumbnails with the entry
// fetchComicThumbnails(entry);
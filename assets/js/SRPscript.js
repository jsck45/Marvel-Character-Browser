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
var modal = document.getElementById('myModal');
var modalMessage = document.getElementById('modal-message')
const closeBtn = document.getElementsByClassName('close')[0];

function append_recent_search_li_element(event) {
  event.preventDefault();
  if (recent_searches !== null && recent_searches.trim() !== "") {
    var recent_searches_ls = recent_searches.split("|");
    is_recent_searches = true;
  }
  if (is_recent_searches == true) {
    var recent_search_div = document.createElement("button");
    recent_search_div.setAttribute('class', 'last-search');
    recent_search_div.textContent = recent_searches_ls[recent_searches_ls.length - 1];
    recent_searches_container.appendChild(recent_search_div);
    recent_search_div.addEventListener("click", function(event) {
      event.preventDefault();
      userInput.value = recent_searches_ls[recent_searches_ls.length - 1];
      Search_btn.click();
    });
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
  if (entry === "") {
    console.log("No results returned");
    modal.style.display = 'block';
    modalMessage.textContent = "Please enter a search query."
    return;
  }
  if (entry !== "") {
    entry = "nameStartsWith=" + entry + "&";
  }
  let idscrapper = "https://gateway.marvel.com/v1/public/characters?" + entry + "limit=50&ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518";
  fetch(idscrapper)
    .then(function(response) {
      response.json().then(function(data) {
        if (data.data.results.length > 0) {
          while (true) {
            console.log(data.data.results[characterIndex].comics.available);
            if (data.data.results[characterIndex].comics.available > 0) {
              id = data.data.results[characterIndex].id;
              characterName = data.data.results[characterIndex].name;
              console.log(characterName);
              append_recent_search();
              fetchWikipediaContent(characterName);
              break;
            }
            characterIndex++;
            if (characterIndex === 50) {
              console.log("No results returned");
              modal.style.display = 'block';
              modalMessage.textContent = "No results found!"
              return;
            }
          }
          let comicscrapper = "https://gateway.marvel.com/v1/public/characters/" + id + "/comics?limit=10&ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518";
          fetch(comicscrapper)
            .then(function(response2) {
              response2.json().then(function(data) {
                for (i = 0; i < data.data.results.length; i++) {
                  currentComic = document.createElement("li");
                  currentComic.textContent = data.data.results[i].title;
                  comics_list.appendChild(currentComic);
                }
              });
            });
        } 
      });
    });
}

Search_btn.addEventListener("click", Search_Comics);
Search_btn.addEventListener("click", append_recent_search_li_element);

function fetchWikipediaContent(characterName) {
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&redirects=1&titles=${encodeURIComponent(characterName)}`;

  fetch(apiUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      const pages = data.query.pages;
      const firstPageId = Object.keys(pages)[0];
      const extract = pages[firstPageId].extract;
      displayWikipediaContent(extract);
    })
    .catch(function(error) {
      console.log("Error fetching Wikipedia content:", error);
      displayWikipediaContent('');
      modal.style.display = 'block'; // Show the error modal
    });
}

function displayWikipediaContent(content) {
  const wikipediaDisplay = document.getElementById('wikipedia-display');
  const paragraphs = content.split('\n');
  const firstParagraph = paragraphs[0];

  wikipediaDisplay.innerHTML = `<p>${firstParagraph}</p>`;
}

// Links the landing page to search results page - prepopulates the input field and triggers the submit
userInput.value = decodeURIComponent(queryFromURL);
window.addEventListener('DOMContentLoaded', function() {
  Search_btn.click();
});

// Close modal
closeBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});

// Clear input field when back button is pressed
window.addEventListener('pageshow', function(event) {
  userInput.value = '';
});

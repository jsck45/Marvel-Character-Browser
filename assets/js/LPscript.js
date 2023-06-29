document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault(); 
  
    // Get the search query from the input field
    const query = document.getElementById("query").value;
  
    // Redirect to the search results page with the query as a URL parameter
    window.location.href = 'searchResultsPage.html?query=' + encodeURIComponent(query);
  });
  
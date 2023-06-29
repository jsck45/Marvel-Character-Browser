document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault(); 
    console.log("Form submitted!");
  
    // Get the search query
    var query = document.getElementById("userInput").value;
  
    // Send the API request to your proxy server
    fetch("http://localhost:3000/wiki-proxy?q=" + encodeURIComponent(query))
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        // Parse the response and extract the first paragraph
        var pages = data.query.pages;
        var pageId = Object.keys(pages)[0];
        var extract = pages[pageId].extract;
        
        // Extract the first paragraph
        var firstParagraph = extract.split('\n')[0];
        
        // Display the first paragraph on your webpage
        document.getElementById("wikipedia-display").textContent = firstParagraph;
      })
      .catch(function(error) {
        console.log("Error:", error);
      });
  });
  
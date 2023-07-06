const form = document.getElementById('form');
const queryInput = document.getElementById('query');
const modal = document.getElementById('myModal');
const closeBtn = document.getElementsByClassName('close')[0];

form.addEventListener('submit', function(event) {
  event.preventDefault();

  if (queryInput.value.trim() === '') {
    modal.style.display = 'block';
  } else {
    window.location.href = 'searchResultsPage.html?query=' + encodeURIComponent(queryInput.value);
  }
});

closeBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});

window.addEventListener('pageshow', function(event) {
  queryInput.value = '';
});
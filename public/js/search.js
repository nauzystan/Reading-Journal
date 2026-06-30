// ======================
// BOOK SEARCH ELEMENTS
// ======================

const searchInput = document.getElementById("bookSearch");
const resultsDiv = document.getElementById("searchResults");

// ======================
// LIVE OPEN LIBRARY SEARCH
// Runs whenever the user types
// ======================

searchInput.addEventListener("input", async () => {
  const title = searchInput.value.trim();

  // Don't search until at least 3 characters
  if (title.length < 3) {
    resultsDiv.innerHTML = "";
    return;
  }

  try {
    // Call backend API endpoint
    const response = await fetch(
      `/api/search-book?title=${encodeURIComponent(title)}`,
    );

    // Convert JSON response into JavaScript objects
    const books = await response.json();

    // Clear previous search results
    resultsDiv.innerHTML = "";

    // Create a clickable result for each book returned
    books.forEach((book) => {
      const item = document.createElement("div");

      item.innerText = `${book.title} - ${book.author}`;

      // Populate form fields when a result is selected
      item.addEventListener("click", () => {
        document.querySelector('input[name="title"]').value = book.title;

        document.querySelector('input[name="author"]').value = book.author;

        document.querySelector('input[name="coverId"]').value =
          book.cover_id || "";

        // Show selected book cover preview
        document.getElementById("coverPreview").innerHTML = `
  <img
    src="https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg"
    class="preview-cover">
`;

        // Hide search results after selection
        resultsDiv.innerHTML = "";
      });

      // Add result to the results container
      resultsDiv.appendChild(item);
    });
  } catch (err) {
    console.error(err);
  }
});

// ======================
// NOTES CHARACTER COUNTER
// ======================

const notes = document.querySelector('textarea[name="notes"]');
const count = document.getElementById("charCount");

if (notes && count) {
  const updateCount = () => {
    count.textContent = `${notes.value.length} characters`;
  };

  // Update count while typing
  notes.addEventListener("input", updateCount);

  // Set initial count when page loads
  updateCount();
}

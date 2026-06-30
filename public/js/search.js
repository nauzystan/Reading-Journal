const searchInput = document.getElementById("bookSearch");
const resultsDiv = document.getElementById("searchResults");

searchInput.addEventListener("input", async () => {
  const title = searchInput.value.trim();
  if (title.length < 3) {
    resultsDiv.innerHTML = "";
    return;
  }

  try {
    const response = await fetch(
      `/api/search-book?title=${encodeURIComponent(title)}`,
    );
    const books = await response.json();

    resultsDiv.innerHTML = "";

    books.forEach((book) => {
      const item = document.createElement("div");
      item.innerText = `${book.title} - ${book.author}`;
      item.addEventListener("click", () => {
        document.querySelector('input[name="title"]').value = book.title;
        document.querySelector('input[name="author"]').value = book.author;
        document.querySelector('input[name="coverId"]').value =
          book.cover_id || "";
        document.getElementById("coverPreview").innerHTML = `
  <img
    src="https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg"
    class="preview-cover">
`;
        resultsDiv.innerHTML = "";
      });
      resultsDiv.appendChild(item);
    });
  } catch (err) {
    console.error(err);
  }
});

const notes = document.querySelector('textarea[name="notes"]');
const count = document.getElementById("charCount");

if (notes && count) {
  const updateCount = () => {
    count.textContent = `${notes.value.length} characters`;
  };

  notes.addEventListener("input", updateCount);
  updateCount();
}

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import https from "https";

const app = express();
const port = 3000;

dotenv.config();

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: process.env.DB_PASSWORD,
  port: 5433,
});
db.connect();

const API_URL = "https://openlibrary.org";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

async function fetchData(url) {
  return new Promise((resolved, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolved(JSON.parse(data));
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

function getRelativeDate(date) {
  const now = new Date();
  const added = new Date(date);

  const diff = Math.floor((now - added) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "Today";
  if (diff === 1) return "1 day ago";

  return `${diff} days ago`;
}

app.get("/", async (req, res) => {
  const sortChoice = req.query.sort || "recency";
  let sqlQuery = "SELECT * FROM books ORDER BY date_added DESC";
  if (sortChoice === "rating") {
    sqlQuery = "SELECT * FROM books ORDER BY rating DESC";
  } else if (sortChoice === "title") {
    sqlQuery = "SELECT * FROM books ORDER BY title ASC";
  } else if (sortChoice === "recency") {
    sqlQuery = "SELECT * FROM books ORDER BY date_read DESC";
  }
  try {
    const result = await db.query(sqlQuery);
    const dbBooks = result.rows;

    dbBooks.forEach((book) => {
      book.relativeAdded = getRelativeDate(book.date_added);
    });

    const totalBooks = dbBooks.length;

    const averageRating =
      totalBooks > 0
        ? (
            dbBooks.reduce((sum, book) => sum + (book.rating || 0), 0) /
            totalBooks
          ).toFixed(1)
        : 0;

    const latestBookResult = await db.query(
      "SELECT title FROM books ORDER BY date_added DESC LIMIT 1",
    );

    const latestBook =
      latestBookResult.rows.length > 0
        ? latestBookResult.rows[0].title.substring(0, 10) +
          (latestBookResult.rows[0].title.length > 10 ? "..." : "")
        : "No books yet";

    res.render("index.ejs", {
      books: dbBooks,
      totalBooks,
      averageRating,
      latestBook,
      sortChoice,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error loading your book dashboard");
  }
});

app.get("/api/search-book", async (req, res) => {
  const bookName = req.query.title;
  if (!bookName) return res.json([]);
  try {
    const searchUrl =
      API_URL + `/search.json?title=${encodeURIComponent(bookName)}&limit=5`;
    const apiData = await fetchData(searchUrl);
    const simplifiedResults = apiData.docs.map((doc) => {
      return {
        title: doc.title,
        author: doc.author_name ? doc.author_name[0] : "Unknown Author",
        cover_id: doc.cover_i || null,
      };
    });
    res.json(simplifiedResults);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to search Open Library" });
  }
});

app.get("/book/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [
      bookId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).send("Book not found");
    }

    res.render("book.ejs", {
      book: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load book");
  }
});

app.get("/new", (req, res) => {
  res.render("modify.ejs", { bookData: null });
});

app.post("/add", async (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const rating = req.body.rating;
  const notes = req.body.notes;
  const coverId = req.body.coverId;
  const dateRead = req.body.dateRead || null;
  if (!title) {
    return res.status(400).send("Please enter a book title");
  } else if (!notes) {
    return res.status(400).send("Please enter a note");
  }
  try {
    await db.query(
      "INSERT INTO books (title, author, cover_id, notes, rating, date_read) VALUES($1, $2, $3, $4, $5, $6)",
      [title, author, coverId, notes, rating, dateRead],
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Failed to save book");
  }
});

app.get("/edit/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1;", [
      bookId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send("This book review does not exist.");
    }
    res.render("modify.ejs", { bookData: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).send("failed to fetch book");
  }
});

app.post("/edit/:id", async (req, res) => {
  const bookId = req.params.id;
  const { title, author, coverId, notes, rating, dateRead } = req.body;
  const safeDateRead = dateRead || null;
  if (!title || !notes) {
    return res.status(400).send("Please fill out the blank fields");
  }
  try {
    await db.query(
      "UPDATE books SET title = $1, author = $2, cover_id = $3, notes = $4, rating = $5, date_read = $6 WHERE id = $7;",
      [title, author, coverId, notes, rating, safeDateRead, bookId],
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Could not update the book review");
  }
});

app.post("/delete/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    await db.query("DELETE FROM books WHERE id = $1;", [bookId]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Cannot Delete Book Review");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

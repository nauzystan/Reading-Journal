# 📚 My Reading Journal

A modern full-stack web application for tracking books you've read, rating them, and storing detailed personal reviews.

Built with Node.js, Express, PostgreSQL, EJS, and the Open Library API, this project allows users to maintain a personal reading journal with book covers, ratings, reading dates, and long-form notes.

---

## ✨ Features

### 📖 Book Management
- Add new books to your library
- Edit existing reviews
- Delete reviews
- View full review pages for each book

### 🔎 Smart Book Search
- Search books using the Open Library API
- Auto-complete search suggestions while typing
- Automatically fills:
  - Title
  - Author
  - Cover ID

### ⭐ Ratings & Reviews
- Rate books from 1–10
- Store detailed reading notes
- Preview notes on the home page
- View complete notes on a dedicated page

### 📊 Reading Statistics
- Total books read
- Average rating
- Latest book added

### 🎨 User Experience
- Responsive design
- Dark/Light mode toggle
- Automatic book cover display
- Clean card-based layout
- Sort books by:
  - Most Recently Read
  - Highest Rated
  - Title (A–Z)

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- pg

### Frontend
- EJS
- HTML5
- CSS3
- Vanilla JavaScript

### External APIs
- Open Library API
- Open Library Covers API

### Other Tools
- dotenv
- body-parser

---

## 📂 Database Schema

```sql
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    cover_id VARCHAR(50),
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    date_added TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    date_read DATE
);
```

---

## 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/Reading-Journal.git
```

Navigate into the project:

```bash
cd Reading-Journal
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
DB_PASSWORD=your_postgres_password
```

Start the server:

```bash
nodemon index.js
```

or

```bash
node index.js
```

Open:

```text
http://localhost:3000
```

---

## 📸 Screenshots

Add screenshots of:

- Dashboard
- Add Book Page
- Full Review Page
- Dark Mode

---

## 🎯 Future Improvements

- User authentication
- Public profile pages
- Shareable reading journals
- Reading goals and yearly challenges
- Author information section
- Reading analytics dashboard
- Book categories and tags
- Search within personal library

---

## 📚 What I Learned

This project helped me strengthen my understanding of:

- RESTful routing
- CRUD operations
- PostgreSQL integration
- Express middleware
- API consumption
- EJS templating
- Async JavaScript
- Frontend and backend integration
- Responsive UI development

---

## 👨‍💻 Author

Gabriel Chinonso Stanley

Tech Support • Community Operations • Aspiring Full-Stack Developer

LinkedIn: https://www.linkedin.com/in/chinonso-gabriel-535b42176/

GitHub: https://github.com/nauzystan

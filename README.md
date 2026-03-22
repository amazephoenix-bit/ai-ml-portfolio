# George C A — AI/ML Portfolio

A full-stack personal portfolio website for an AI & Machine Learning Engineer.

## Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript (Canvas image sequence animation)
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas (Mongoose)

## Features

- 🎬 HTML5 Canvas hero animation with 96-frame image sequence
- 📄 About, Skills, Projects, Learning Roadmap, and Contact sections
- 📬 Contact form connected to MongoDB Atlas via REST API
- 🌗 Premium dark theme with custom cursor and scroll-reveal animations
- 📱 Fully responsive (mobile + desktop)

## Project Structure

```
portfolio/
├── public/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/frames/   ← 96 animation frames
├── server/
│   ├── server.js
│   └── models/Contact.js
├── .env                 ← NOT committed (see .gitignore)
├── .gitignore
└── package.json
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create a .env file in the project root
echo "PORT=3000" > .env
echo "MONGODB_URI=your_mongodb_atlas_uri" >> .env

# 3. Start the server
node server/server.js
```

Then open **http://localhost:3000** in your browser.

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/contact` | Save a contact form message |
| GET | `/api/messages` | Retrieve all messages (admin) |

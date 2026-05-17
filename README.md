# CodeCrack AI

A full-stack coding interview practice platform built with the MERN stack. Solve LeetCode-style problems in a Monaco editor, run code, submit against test cases, and track your progress on a dashboard.

## Features

- JWT authentication with protected routes, remember me, and role-based access (user / admin)
- Question library with filters and detailed problem pages
- VS Code-style editor (Monaco) with multiple languages
- Run code and submit solutions (Judge0 integration optional)
- Bookmarks, hints, solutions, XP, streaks, and dashboard analytics
- Responsive UI with Tailwind CSS and Framer Motion

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React, Vite, Tailwind CSS, Framer Motion, Monaco Editor, React Router |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT |
| Tooling | Axios, react-hot-toast, Chart.js |

## Project structure

```
├── backend/          # Express API + MongoDB
├── client/           # React + Vite frontend
├── .gitignore
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB](https://www.mongodb.com/) (Atlas or local)

## Quick start

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/codecrack-ai.git
cd codecrack-ai
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run seed    # optional: sample users & questions
npm run dev
```

API runs at **http://localhost:5000**

### 3. Frontend setup

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

App runs at **http://localhost:5173**

## Environment variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `COOKIE_SECRET` | Cookie signing secret |
| `FRONTEND_URL` | Frontend URL for CORS & emails |
| `EMAIL_*` | SMTP settings for password reset |
| `JUDGE0_API_URL` | Optional: Judge0 API base URL |
| `JUDGE0_API_KEY` | Optional: RapidAPI key for Judge0 |

### Frontend (`client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (e.g. `http://localhost:5000/api`) |

## Seed accounts

After running `npm run seed` in `backend/`:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@codecrack.ai` | `Admin123!` |
| User | `user@codecrack.ai` | `User123!` |

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| `backend/` | `npm run dev` | Start API with nodemon |
| `backend/` | `npm start` | Start API (production) |
| `backend/` | `npm run seed` | Seed database |
| `client/` | `npm run dev` | Start Vite dev server |
| `client/` | `npm run build` | Production build |

## Deployment

- **Frontend:** Vercel, Netlify, or any static host — set `VITE_API_URL` to your production API.
- **Backend:** Render, Railway, Fly.io, etc. — set all `backend/.env` variables in the host dashboard.
- **Database:** MongoDB Atlas recommended for production.

## Security notes

- Never commit `.env` files (they are gitignored).
- Use strong, unique `JWT_SECRET` and `COOKIE_SECRET` in production.
- Rotate secrets if they were ever exposed.

## License

MIT — see [LICENSE](LICENSE).

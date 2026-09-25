# TaskFlow Lite — Login & Session Module

Week 1 onboarding mini-project for the Full Stack Development & QA Internship at Leaplooms Technologies.

This module implements a basic authentication flow: existing users can log in with their email and password, receive a session token, access a protected welcome page, and log out.

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL(includes an in-memory dev fallback if Postgres isn't running locally)
- **Auth:** JWT (`jsonwebtoken`) & password hashing with `bcryptjs`

---

## Project Structure

```
.
├── backend/          # Express API & Prisma database
│   ├── prisma/       # schema.prisma & seed.js
│   └── src/          # controllers, routes, middleware, db client
├── frontend/         # React + Vite application with Tailwind CSS
└── package.json      # Root runner for running both concurrently
```

---

## Quick Setup

### 1. Install dependencies
From the project root:
```bash
npm install
npm run install:all
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the `backend/` folder:
```bash
cp backend/.env.example backend/.env
```

Default settings in `backend/.env`:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/taskflow_lite?schema=public"
JWT_SECRET="taskflow_dev_secret_key"
JWT_EXPIRES_IN="24h"
CLIENT_URL="http://localhost:5173"
```

### 3. Run the App
To start both backend (port 5000) and frontend (port 5173) together:
```bash
npm run dev
```

Then open your browser at **`http://localhost:5173`**.

*(Alternatively, you can run them in separate terminals with `npm run dev` inside `backend/` and `frontend/`)*.

---

## Test Credentials

The database comes pre-seeded with these test accounts:

| Name | Email | Password |
|---|---|---|
| Alex Morgan | `alex.dev@taskflow.com` | `password123` |
| Test User | `test@example.com` | `password123` |

---

## API Endpoints

All routes are under `/api/auth`:

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticates user, returns JWT and user profile | No |
| `GET` | `/api/auth/me` | Returns current user profile | Yes (`Bearer <token>`) |
| `POST` | `/api/auth/logout` | Clears/invalidates session | No |
| `GET` | `/api/health` | Health check endpoint | No |

---

## Database (PostgreSQL & Prisma)

To run migrations and seed a real PostgreSQL database:

```bash
cd backend
npx prisma migrate dev --name init
npm run prisma:seed
```

> **Note:** If you don't have PostgreSQL installed on your machine, the backend will automatically use the built-in development fallback with the seeded users above, so you can still test the entire UI and flow without any database errors.

---

## Features Implemented

- Centered, responsive login card on desktop and mobile.
- Form validation: valid email format check and minimum 6-character password check.
- Clear error handling: returns generic `401 Unauthorized` for wrong credentials to avoid revealing whether an email exists.
- Submit button shows loading spinner and disables during API requests.
- Protected welcome page displaying user's name, email, and logout button.
- Unauthenticated access to the protected page automatically redirects to login.

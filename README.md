# Event Management System (Beginner Friendly)

This repository contains a simple event management application: a React (Vite) frontend and an Express + MongoDB backend. The app includes user registration/login, organizer/admin sections, and event management pages.

## Quick Overview

- Client (frontend): `client/` — built with React + Vite.
- Server (backend): `server/` — built with Express and uses MongoDB (mongoose).

## Prerequisites

- Node.js (v18+ recommended)
- npm (comes with Node) or yarn
- A MongoDB database: either a local MongoDB server or MongoDB Atlas (cloud). You will need a connection string.

## Setup (step-by-step)

1. Clone the repo and open a terminal in the project root.

2. Install backend dependencies:

```bash
cd server
npm install
```

3. Create the backend environment file `server/.env` (copy this example) and fill values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
```

Use a MongoDB Atlas connection string or `mongodb://localhost:27017/ems` if running MongoDB locally.

4. Install frontend dependencies (in a new terminal):

```bash
cd client
npm install
```

5. Start the backend (in the `server` folder):

```bash
cd server
npm run server
```

6. Start the frontend (in the `client` folder):

```bash
cd client
npm run dev
```

7. Open the app in your browser. Vite typically serves at `http://localhost:5173` and the backend at `http://localhost:5000` (unless you changed ports).

## How to use (beginner tips)

- Register a new account with the Register page. Choose `organizer` or `participant` for role-specific features.
- Admin accounts are typically created directly in the database (or through a separate admin UI if provided). If you need an admin account for testing, create a user in MongoDB and set `role: 'admin'`.
- Use the Organizer pages to create and manage events. Participant users can view and register for events.

## Common issues & troubleshooting

- "Cannot connect to MongoDB": check `MONGO_URI` in `server/.env`, ensure your DB is reachable and your IP is allowed if using Atlas.
- Ports in use: if `5173` or `5000` are already used, change the port or stop the process using that port.
- CORS errors: backend sets CORS — ensure frontend origin matches or use proxy when needed.

## Helpful commands

- Start backend: `cd server && npm run server`
- Start frontend: `cd client && npm run dev`
- Build production frontend: `cd client && npm run build`

## Where to look in the code

- Frontend entry: `client/src/main.jsx`
- App routes: `client/src/routes/AppRoutes.jsx`
- Navbar and components: `client/src/components/*`
- Backend entry: `server/server.js`
- Routes/controllers: `server/routes/` and `server/controllers/`

If you'd like, I can also add a script to run frontend+backend together, or add a short demo data seeding script — tell me which you prefer and I'll add it.

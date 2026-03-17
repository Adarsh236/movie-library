# Movie Library

Movie Library is a full-stack application with a React + Vite frontend and a NestJS backend, managed with npm workspaces.

## Live links

- Frontend: `https://movie-library-client.vercel.app`
- Backend API: `https://movie-library-cr7q.onrender.com/api`

---

## Tech stack

### Frontend

- React
- TypeScript
- Vite
- Redux Toolkit
- RTK Query
- React Router
- CSS Modules
- Vitest
- Testing Library

### Backend

- NestJS
- TypeScript
- cache-manager
- Zod
- Jest

---

## Project structure

```text
movie-library/
├── client/
│   ├── src/
│   │   ├── components/        # Shared UI components
│   │   ├── config/            # Frontend runtime config
│   │   ├── features/movies/   # Movie domain: API, pages, components, validation, route helpers
│   │   ├── hooks/             # Reusable hooks
│   │   ├── router/            # App routing
│   │   ├── store/             # Redux store and middleware
│   │   ├── styles/            # Global styles and variables
│   │   └── utils/             # Shared utilities
│   └── tests/                 # Frontend tests
├── server/
│   ├── src/
│   │   ├── common/            # Filters, interceptors, cross-cutting concerns
│   │   ├── config/            # Environment config
│   │   ├── genres/            # Genre endpoint
│   │   ├── movies/            # Movie endpoints, DTOs, service, mappers
│   │   └── tmdb/              # TMDB integration and schemas
│   └── test/                  # Backend tests
└── package.json               # Workspace root
```

---

## Features

### Frontend

- Movie listing
- Search by title
- Genre filtering
- Pagination
- About page
- Shareable URL-based search
- Search validation
- Recent searches with localStorage persistence
- Responsive layout
- Reusable UI components
- Route handling for deployment

### Backend

- REST API for movies, search, and genres
- Request validation
- TMDB integration through a backend service
- Response transformation into an internal schema
- Caching for repeated requests
- Test coverage around service and API behavior

---

## Prerequisites

Before running the project, make sure you have:

- Node.js 20+ recommended
- npm 10+ recommended

---

## Installation

Install dependencies for the entire workspace from the project root:

```bash
npm install
```

---

## Environment variables

Both services use their own `.env` file.

### Frontend

Create `client/.env`:

```bash
VITE_API_BASE_URL=http://localhost:4000
```

This value should point to the backend base URL used by the client in development.

### Backend

Create `server/.env`:

```bash
PORT=4000
CLIENT_ORIGINS=http://localhost:5173
TMDB_ACCESS_TOKEN=your_tmdb_access_token
TMDB_BASE_URL=https://api.themoviedb.org/3
```

### Notes

- `PORT` is the port used by the NestJS server.
- `CLIENT_ORIGINS` is used for CORS so the frontend can call the backend locally.
- `TMDB_ACCESS_TOKEN` is required for authenticated requests to TMDB.
- `TMDB_BASE_URL` points to the TMDB API base URL.

A sample `.env.example` file is included in both the client and server folders.

---

## Running the application

This repository contains two services that need to run together during development:

- `client` — frontend application
- `server` — backend API

### Start the backend

From the project root, run:

```bash
npm run start:dev --workspace server
```

This starts the NestJS API in watch mode.

### Start the frontend

Open a second terminal in the project root and run:

```bash
npm run dev --workspace client
```

This starts the Vite development server.

---

## Development workflow

Keep both services running at the same time.

### Terminal 1

```bash
npm run start:dev --workspace server
```

### Terminal 2

```bash
npm run dev --workspace client
```

---

## Local URLs

Once both services are running:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

---

## Routes and API

### Frontend routes

The frontend uses `createBrowserRouter` with the following routes:

- `/` — Home page, default movie listing
- `/search` — Search page
- `/genre/:genreId` — Movies filtered by genre
- `/about` — About page
- `*` — Not found page

### Search route example

```text
/search?title=batman&page=1
```

### Genre route example

```text
/genre/28?page=1
```

### Backend base URLs

Local:

```text
http://localhost:4000
```

Production:

```text
https://movie-library-cr7q.onrender.com
```

### Backend endpoints

#### Get movies

```http
GET /api/movies?page=1
```

#### Search movies by title

```http
GET /api/movies/search?title=batman&page=1
```

#### Get movies by genre

```http
GET /api/movies/genre/28?page=1
```

#### Get genres

```http
GET /api/genres
```

### Frontend to backend mapping

- `/` → `GET /api/movies?page=1`
- `/search?title=batman&page=1` → `GET /api/movies/search?title=batman&page=1`
- `/genre/28?page=1` → `GET /api/movies/genre/28?page=1`
- Shared genre data → `GET /api/genres`

---

## Workspace scripts

### Frontend scripts

Run these from the project root:

```bash
npm run dev --workspace client
npm run build --workspace client
npm run lint --workspace client
npm run typecheck --workspace client
npm run test --workspace client
npm run test:watch --workspace client
npm run test:coverage --workspace client
```

### Backend scripts

Run these from the project root:

```bash
npm run start --workspace server
npm run start:dev --workspace server
npm run start:debug --workspace server
npm run build --workspace server
npm run lint --workspace server
npm run test --workspace server
npm run test:watch --workspace server
npm run test:cov --workspace server
npm run test:e2e --workspace server
```

---

## Testing

### Frontend

```bash
npm run test --workspace client
```

### Frontend coverage

```bash
npm run test:coverage --workspace client
```

### Backend unit tests

```bash
npm run test --workspace server
```

### Backend coverage

```bash
npm run test:cov --workspace server
```

### Backend end-to-end tests

```bash
npm run test:e2e --workspace server
```

---

## Deployment

- Frontend deployed to Vercel
- Backend deployed to Render

The frontend is configured to call the deployed backend service through environment-based configuration.

---

## Notes

- Search state is intentionally stored in the URL so it can be refreshed, bookmarked, and shared.
- The backend acts as a middle layer between the frontend and TMDB.
- TMDB responses are transformed into an internal schema before being returned to the client.
- RTK Query is used for fetching and caching on the frontend.
- Recent searches are implemented as a LIFO stack limited to 5 unique items and persisted via localStorage.

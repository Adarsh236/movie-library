# Movie Library

Movie Library is a full-stack application with a React + Vite frontend and a NestJS backend, managed with npm workspaces.

## Tech stack

### Client

- React
- TypeScript
- Vite
- Redux Toolkit
- React Router

### Server

- NestJS
- TypeScript
- Jest
- Class Validator / Class Transformer
- Zod

## Project structure

```text
movie-library/
├── client/
├── server/
├── package.json
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 20+ recommended
- npm 10+ recommended

## Installation

Install dependencies for the entire workspace from the project root:

```bash
npm install
```

## Environment variables

Both apps can use local environment files during development.

### Client environment file

Create a file at:

```text
client/.env
```

Add the API base URL used by the frontend:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

This tells the Vite client where the backend API is running.

### Server environment file

Create a file at:

```text
server/.env
```

Add the TMDB token and local server settings:

```env
TMDB_ACCESS_TOKEN=your_tmdb_read_access_token
CLIENT_ORIGIN=http://localhost:5173
PORT=4000
```

### Environment notes

- `TMDB_ACCESS_TOKEN` should be your **TMDB Read Access Token**.
- `CLIENT_ORIGIN` is used to allow requests from the frontend during local development.
- `PORT` is the backend port. The client examples in this README assume the API runs on `4000`.
- Do not commit real secrets to source control.
- A good practice is to keep `.env.example` files in the repo and keep real `.env` files local only.

## Running the application

This repository contains two services that need to run together during development:

- `client` — frontend application
- `server` — backend API

### Start the server

From the project root, run:

```bash
npm run start:dev --workspace server
```

This starts the NestJS server in watch mode.

### Start the client

Open a second terminal in the project root and run:

```bash
npm run dev --workspace client
```

This starts the Vite development server.

## Development workflow

Keep both services running at the same time:

### Terminal 1

```bash
npm run start:dev --workspace server
```

### Terminal 2

```bash
npm run dev --workspace client
```

## Local URLs

Once both services are running, the frontend is usually available at:

```text
http://localhost:5173
```

The backend API runs on the port configured in the NestJS server. In this project, it is expected to be available at:

```text
http://localhost:4000
```

## Workspace scripts

### Client scripts

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

### Server scripts

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

## Building the project

### Build the client

```bash
npm run build --workspace client
```

### Build the server

```bash
npm run build --workspace server
```

## Testing

### Client tests

```bash
npm run test --workspace client
```

### Client coverage

```bash
npm run test:coverage --workspace client
```

### Server unit tests

```bash
npm run test --workspace server
```

### Server coverage

```bash
npm run test:cov --workspace server
```

### Server end-to-end tests

```bash
npm run test:e2e --workspace server
```

## Notes

- This project uses **npm workspaces**, so commands can be executed from the root with the `--workspace` flag.
- The client depends on the server API being available during local development.
- If the frontend cannot load data, make sure the backend is running first.

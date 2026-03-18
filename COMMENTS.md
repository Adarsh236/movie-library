# COMMENTS.md

## General approach

The goal was to build a solid movie library application without over engineering it. I focused on getting the core flows working end to end, then spent most of the effort on the areas that usually matter most in a real codebase: state consistency, API boundaries, validation, reuse, and test coverage.

The assignment also explicitly asked for a proper backend middle layer, attention to state management, and documentation around decisions, so those areas took priority over adding extra polish.

---

## Frontend

### What was implemented

- Movie listing
- Search by title
- Genre filtering
- Pagination
- About page
- Shareable URL-based search
- Search validation
- Recent searches
- Responsive layout
- Reusable UI components
- Lazy loading Pages
- Route handling for deployment

### Main decisions

- **Search is stored in the URL**  
  Search was treated as application state, not just input state. This keeps the results page refresh, bookmarklet, and shareable.

- **Recent searches were isolated into a custom hook**  
  The sidebar uses a Last-In-First-Out stack with a hard limit of 5 unique items, persisted in localStorage. Keeping that logic separate made it easier to test and easier to maintain.

- **Feature-based structure over a flat component tree**  
  The frontend was organized around features and reusable building blocks instead of page-level sprawl. That keeps route logic, search state, and API-related code easier to manage.

- **CSS Modules instead of a UI library**  
  This matched the assignment and kept layout, responsiveness, and styling decisions under direct control. For the visual direction and content hierarchy, I used products like Plex, IMDb, and Prime Video as references, mainly for how they present discovery, metadata, and browsing flows without over complicating the interface.

- **RTK Query / Redux Toolkit for data flow**  
  RTK Query handled fetching and caching, while the frontend state stayed predictable around loading, error, and refetch behavior. I also added timing middleware to cover the bonus requirement around async action duration.

- **Mobile-first and state-aware UI**  
  I paid attention to loading, empty, validation, and error states instead of only building the happy path.

### Frontend tools

- React
- TypeScript
- Redux Toolkit
- RTK Query
- React Router
- CSS Modules
- Vitest
- Testing Library
- Vite

---

## Backend

### What was implemented

- API endpoints for movie list, search, genres, and pagination flows
- Validation around incoming parameters
- TMDB integration through a backend service
- Response transformation into an internal schema
- Caching for repeated requests
- Test coverage around service and API behavior

### Main decisions

- **TMDB is hidden behind the backend**  
  The backend does not behave like a simple proxy. It owns the TMDB access token, calls the upstream API, validates the response, transforms it, and returns a cleaner internal shape to the frontend.

- **Response transformation was deliberate**  
  One of the task requirements was to avoid exposing raw TMDB responses. I kept that boundary on the server side so the frontend only depends on the application own contract.

- **Validation happens at the edges**  
  Request params are validated before entering the service layer, and TMDB responses are validated before being mapped into internal models.

- **Caching was added where it gives the most value**  
  Since the app is read-heavy and depends on an external API, caching common paths like movie lists, search results, and genres improves response time and reduces avoidable upstream calls.

### Backend tools

- NestJS
- TypeScript
- cache-manager
- Zod
- Jest

---

## What I focused on

The main focus was predictability and maintainability.

- making search route-driven instead of local-only
- keeping recent search behavior isolated and testable
- shaping the backend as a real middle layer
- validating both request input and third-party API output
- keeping the frontend/backend contract clean
- covering the most stateful flows with tests

I chose to spend more time on those areas because they say more about how the project would hold up under change than simply adding more UI features.

---

## Test coverage

### Frontend

Frontend tests were focused on the parts with the most state and the highest chance of breaking during refactors:

- header search wiring
- route-driven search behavior
- form submission and clear interactions
- recent search ordering and uniqueness
- case-insensitive deduplication
- max item limit
- localStorage persistence
- empty and invalid input scenarios

One part of the test pass was correcting weak generated coverage. Some AI-generated tests repeated similar scenarios while missing more important ones. I rewrote those tests to match the real implementation, especially around form submission, exact mock paths, URL-driven search state, and recent-search behavior.

### Backend

Backend tests were aimed at the system boundary:

- request validation
- invalid query handling
- endpoint behavior
- transformation logic
- contract stability around TMDB integration
- API-level behavior for expected and invalid requests

I treated backend tests more as protection around the service boundary than as a line-coverage exercise.

---

## AI disclosure

AI was used during parts of the styling UI components, test-writing process and writing documents.

### Example prompt

> Generate unit tests for the header search flow, recent search hook, and route-based search behavior in a React + TypeScript app using Vitest and Testing Library.

### Where the AI output was weak

The output was useful as a starting point, but not accurate enough to use directly.

Problems included:

- repeated scenarios instead of broader coverage
- tests that assumed UI behavior that did not exist in the actual component
- incorrect mocked import paths
- missing coverage for URL-driven search behavior
- fragile async and timer handling in hook tests

### How it was corrected

I reviewed and rewrote the affected parts manually. That mainly meant fixing test assumptions, correcting mock paths, adding missing route-driven cases, and simplifying timer-related assertions so the tests matched the real implementation more reliably.

AI helped with speed, but it still needed manual review and correction.

---

## Scalability

If this service reached around **10k requests per second**, the first bottleneck would likely be the backend’s dependency on live TMDB calls combined with in-memory caching.

The likely pressure points would be:

- TMDB latency and rate limits
- cache misses on read-heavy paths
- in-process cache limitations
- lack of distributed cache coordination across instances

For the current scope, the implementation is appropriate. At higher traffic, the next step would be a stronger caching strategy, better observability, and clearer resilience around third-party API failures.

---

## Some areas for improvement

- **Swagger / OpenAPI documentation**  
  This would make the backend contract easier to inspect and test, especially for external review or future integration work.

- **More shared hooks and small UI abstractions on the frontend**  
  The structure is already moving in the right direction, but a few patterns could be extracted further as the app grows.

- **Deeper code splitting and lazy loading**  
  The frontend already moves in that direction, but route-level and feature-level splitting could go further.

- **List virtualization**  
  Worth adding once result sets are large enough for rendering cost to matter.

- **Styling scalability & UI**  
  CSS Modules were a good fit here. In a larger team or more design-heavy product, SCSS or Tailwind could be considered depending on how the styling workflow evolves. Also to add functionality to select from recent searches.

- **Backend operational maturity**  
  Better monitoring, stronger cache strategy, and more explicit fallback behavior would be the next step toward production readiness.

---

## Deployment

- Frontend: `https://movie-library-client.vercel.app`
- Backend: `https://movie-library-cr7q.onrender.com/api/movies?page=1`

This split fits the stack well. Vercel works naturally for the React frontend and route handling, while Render is a practical option for the NestJS backend and environment-based configuration.

[Note]: The initial delay on first load is mainly caused by the backend being hosted on Render free tier, which spins down after inactivity and needs to cold start before serving the first request.

---

## README

The README was written to provide clear run instructions and supporting documentation without needing extra explanation. It includes:

- workspace installation steps
- how to run both client and server locally
- key workspace commands
- local development URLs
- frontend routes and backend API endpoints
- environment file setup for both services
- required variables such as the API base URL and TMDB token
- deployed frontend and backend links
- a short project structure overview for both client and server

---

## Final note

The point of this project was not just to complete a movie app. The stronger part of the work was making the core features behave properly: route-based search, reusable structure, clean frontend/backend boundaries, validation, caching, and focused test coverage around the areas most likely to break.

That is the part of the submission I would want reviewed most closely, because it reflects how the code was shaped and why the decisions were made, not just the final feature list.

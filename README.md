# UpTime Tracker

UpTime Tracker is a frontend application for monitoring service uptime. This repository contains the frontend application, built with **React**, **TypeScript**, and **Vite**.

## Tech stack

- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [ESLint](https://eslint.org/) (flat config) with TypeScript and React rules

## Prerequisites

- Node.js >= 20
- npm >= 10

## Installation

1. Clone the repository:

   ```sh
   git clone git@github.com:Lessly0/UpTimeTracker.git
   cd UpTimeTracker
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Configure environment variables:

   ```sh
   cp .env.example .env
   ```

   The default `VITE_API_URL=/api` uses the Vite development/preview proxy to reach the hosted
   PulseMonitor API without browser CORS errors. For production, configure your hosting platform
   to reverse-proxy `/api/*` to `https://uptime-tracker-api.onrender.com/*`, or configure the API
   to allow your deployed frontend origin. The dashboard and authentication use this API; some
   other feature areas still use local mock data.

## Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite development server with hot reload |
| `npm run build` | Type-check and build the app for production (`dist/`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint against the project |

## Development instructions

1. Create a branch off `main` using the naming convention described in [docs/BRANCHING_STRATEGY.md](./docs/BRANCHING_STRATEGY.md).
2. Run `npm run dev` and open the local URL shown by Vite.
3. Make your changes, run `npm run lint` and `npm run build` to verify.
4. Commit using conventional commit messages and open a pull request against `main`.

## Project structure

See [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) for a detailed explanation of the folder organization.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute to this project.

## API Integration Status

The frontend consumes the hosted PulseMonitor API at `https://uptime-tracker-api.onrender.com`,
proxied through Vite at `/api/*` during development. Below is the current integration status
for each feature area.

| Feature | Endpoint(s) | Status | Notes |
|---------|------------|--------|-------|
| Platforms (Monitors) | `GET/POST/PATCH/DELETE /v1/monitors/*` | ✅ Implemented | `src/features/platform/services/platformService.ts` |
| Incidents | `GET/POST/PATCH/DELETE /v1/incidents/*`, `POST /v1/incidents/{id}/resolve` | ✅ Implemented | `src/features/logs-incidents/services/logsIncidentsService.ts` |
| Clients | `GET/POST/PATCH/DELETE /v1/clients/*` | ⚠️ Not documented | Endpoints not in public API spec — add to backend or map to `/v1/organizations/*` |
| Logs | `GET /v1/logs/*` | ⚠️ Not documented | Endpoints not in public API spec — add to backend when available |
| Notification Channels | `GET/POST/PATCH/DELETE /v1/notification-channels/*` | ✅ Implemented | `src/features/notifications/services/notificationsService.ts` |
| Notification Preferences | `GET/PATCH /v1/notification-preferences/*` | ❌ Not implemented | Throws "not yet implemented" error |
| Mark as Read | `POST /v1/notifications/{id}/read` | ❌ Not implemented | Throws "not yet implemented" error |

### Adding missing backend endpoints

If an endpoint is missing, either:

1. **Add it to the backend** (PulseMonitor API at `uptime-tracker-api.onrender.com`), then update the corresponding service file to call it.
2. **Map to an existing endpoint** (e.g., clients → organizations), then update the service file accordingly.
3. **Flag as "not yet implemented"** — keep the throwing stub in the service and update this table.

## License

MIT
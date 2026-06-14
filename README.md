# ShopDemo — Full-Stack Demo Website

[![CI](https://github.com/meitar11/website_demo/actions/workflows/ci.yml/badge.svg)](https://github.com/meitar11/website_demo/actions/workflows/ci.yml)

A realistic, intentionally "boring" full-stack demo storefront. It uses a
typical spread of popular, legitimate npm packages so it can serve as a test
target for a **CI pipeline** and for **dependency / malware scanning**.

- **`server/`** — Express REST API (auth, products, health) with Helmet, CORS,
  rate limiting, JWT auth, validation, and structured logging.
- **`client/`** — React + Vite single-page storefront with React Router,
  TanStack Query, Zustand, and Axios.
- **`.github/workflows/ci.yml`** — GitHub Actions pipeline: lint, test, build,
  and a dedicated dependency/malware-scan job.

> Everything here is a self-contained demo. The in-memory data store keeps the
> project dependency-free at runtime so CI can run anywhere.

## Tech stack

| Layer   | Packages                                                                                                                                                            |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Server  | express, helmet, cors, compression, morgan, express-rate-limit, express-validator, jsonwebtoken, bcryptjs, joi, winston, dayjs, lodash, uuid, dotenv, cookie-parser |
| Client  | react, react-dom, react-router-dom, @tanstack/react-query, zustand, axios, classnames, react-icons, dayjs                                                           |
| Tooling | eslint, prettier, jest, supertest, vitest, @testing-library/react, vite, nodemon                                                                                    |

## Requirements

- Node.js >= 20 (`.nvmrc` pins 20)
- npm >= 9 (uses npm workspaces)

## Getting started

```bash
# Install all workspace dependencies from the repo root
npm install

# Copy environment defaults
cp .env.example .env

# Run the API and the frontend together (http://localhost:5173)
npm run dev
```

The Vite dev server proxies `/api` to the Express server on port `4000`.

### Run them separately

```bash
npm run dev:server   # Express API on http://localhost:4000
npm run dev:client   # Vite dev server on http://localhost:5173
```

## API overview

| Method | Endpoint                   | Description                                  |
| ------ | -------------------------- | -------------------------------------------- |
| GET    | `/api/health`              | Health check                                 |
| GET    | `/api/products`            | List products (`category`, `search` filters) |
| GET    | `/api/products/categories` | List product categories                      |
| GET    | `/api/products/:id`        | Get a single product                         |
| POST   | `/api/auth/register`       | Register a new user                          |
| POST   | `/api/auth/login`          | Log in, returns a JWT                        |
| GET    | `/api/auth/me`             | Current user (requires Bearer token)         |

A seeded demo user is available: `demo@example.com` / `Password123!`.

## Scripts

| Command                | What it does                   |
| ---------------------- | ------------------------------ |
| `npm run dev`          | Run server + client together   |
| `npm run build`        | Production build of the client |
| `npm test`             | Run all workspace test suites  |
| `npm run lint`         | ESLint across the repo         |
| `npm run format`       | Format with Prettier           |
| `npm run format:check` | Check formatting (used in CI)  |

## Continuous integration

`.github/workflows/ci.yml` runs on every push and pull request to `main`:

1. **Lint & format** — ESLint + Prettier check.
2. **Test** — Jest (server) and Vitest (client), in a matrix.
3. **Build** — Production client build, uploaded as an artifact.
4. **Dependency & malware scan** — runs `npm audit` and includes a clearly
   marked placeholder step where a malware scanner plugs in. Because the step
   runs after `npm ci`, the full dependency tree under `node_modules/` is
   available to scan.

To wire in a scanner, replace the placeholder step in the `security-scan` job:

```yaml
- name: Run malware scan
  run: npx your-malware-scanner scan ./node_modules
```

## Security fixtures

`security-fixtures/` holds standalone code samples used to exercise the
dependency/malware scanner. They are excluded from ESLint, Prettier, and the
test globs so the normal lint/test/build CI stays green.

## License

MIT

# Contributing to Payload CMS Dynamic RBAC Plugin

First off, thank you for considering contributing to the Payload CMS Dynamic RBAC Plugin! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

To help you get started, here is a guide on how to set up the development environment, make changes, and run the test suites.

---

## Development Setup

### 1. Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.20.2+ or v20.9.0+)
- [pnpm](https://pnpm.io/) (v9+)

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/Mhmod-Hsn/Payload-RBAC-Plugin.git
cd Payload-RBAC-Plugin
pnpm install
```

### 3. Environment Variables

To run the local development server, create a `.env` file inside the `dev` folder (or copy `dev/.env.example` if available). Typically, you will need a MongoDB or Postgres connection string:

```env
DATABASE_URI=mongodb://127.0.0.1/payload-rbac-plugin-dev
PAYLOAD_SECRET=YOUR_PAYLOAD_SECRET
```

### 4. Running the Dev Server

You can run the interactive Payload development environment (located under `dev/`) to test your changes live:

```bash
pnpm dev
```

---

## Coding Standards

### Linting and Formatting

We use ESLint and Prettier to maintain a clean codebase. Before submitting a pull request, please make sure your code passes the linter:

```bash
# Run ESLint
pnpm lint

# Automatically fix linting issues
pnpm lint:fix
```

---

## Testing

This project has both unit/integration tests and end-to-end tests.

### Integration Tests (Vitest)

We run integration tests using Vitest (which uses a database memory server for zero configuration):

```bash
# Run integration tests once
pnpm test:int

# Run integration tests in watch mode
pnpm test:int --watch
```

### End-to-End Tests (Playwright)

We run end-to-end user interface tests using Playwright:

```bash
# First install the browsers (if running for the first time)
npx playwright install

# Run E2E tests
pnpm test:e2e
```

---

## Submitting Pull Requests

1. **Fork** the repository and create your branch from `main`.
2. If you've added code that should be tested, **add tests**.
3. Ensure the test suite passes (`pnpm test`).
4. Ensure the linter passes (`pnpm lint`).
5. Open a Pull Request with a clear title and description of the changes.

Thank you for your contributions!

# Testing Strategy

The project employs a multi-layered testing strategy to ensure code quality and application stability. Nx is used to orchestrate the execution of all tests.

## Testing Pyramid

A standard testing pyramid model is adopted: a large base of fast unit tests, a smaller set of integration tests, and a minimal number of slow end-to-end tests.

```text
       E2E Tests (Playwright)
      /                    \
   API Tests (Supertest)  Component Tests (Jest)
  /                                        \
Backend Unit Tests (Jest)      Frontend Unit Tests (Jest)
```

## Unit Testing

- **Backend (NestJS):** Unit tests are written with **Jest**. Each service and controller will have its own test file. The focus is on testing individual methods and business logic in isolation. Repositories will be mocked to avoid actual database calls.
- **Frontend (Angular):** Component logic and services are tested with **Jest**. The focus is on testing component behavior without rendering them to a DOM, ensuring the business logic within the components is correct.

## End-to-End (E2E) Testing

- **Tool:** **Playwright** is used for E2E testing.
- **Scope:** These tests cover critical user flows from start to finish. They run against a fully deployed version of the application (frontend, backend, and database) in a test or staging environment.
- **Example Flow:** A typical E2E test would be:
    1. Log in as a user.
    2. Navigate to the search page.
    3. Search for a Kanji.
    4. Click on a result.
    5. Verify that the correct Kanji details are displayed on the page.

## Running Tests

Nx provides a unified way to run all tests:

```bash
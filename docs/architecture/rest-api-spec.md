# REST API Spec

The backend will expose a RESTful API for the frontend. The following defines the key resources and endpoints. All endpoints will be prefixed with `/api`.

Since we are using NestJS, we can leverage the `@nestjs/swagger` package to auto-generate an OpenAPI (Swagger) specification from our DTOs and controller decorators. The initial setup will include this package.

## Resources

- **Kanji:** For retrieving information about Kanji characters and their components.
- **Auth:** For user registration and login.

## Endpoints

### Authentication

- `POST /api/auth/login`
  - **Description:** Authenticates a user and returns a JWT.
  - **Request Body:** `{ "username": "string", "password": "string" }`
  - **Response:** `{ "access_token": "string" }`

- `POST /api/auth/register`
  - **Description:** Registers a new user.
  - **Request Body:** `{ "username": "string", "password": "string", "email": "string" }`
  - **Response:** `201 Created`

### Kanji Data

- `GET /api/kanji/:character`
  - **Description:** Retrieves detailed information for a single Kanji character.
  - **Auth:** Required.
  - **Response:** `KanjiWithDetails` DTO.

- `GET /api/kanji/search`
  - **Description:** Searches for Kanji based on meaning or reading.
  - **Auth:** Required.
  - **Query Params:** `?q=...`
  - **Response:** `Kanji[]` (list of basic Kanji info).

This initial specification will be expanded as more features are added. The live, generated OpenAPI spec will serve as the single source of truth for the API contract.

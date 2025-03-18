# Satta Backend API

## Overview
This project provides a backend API for the Satta system. It includes endpoints for managing teams, publishing results, admin authentication, and a simple caching mechanism.

## Prerequisites
- Node.js (v14 or higher)
- MySQL

## Installation

1. Clone the repository:
   ```
   git clone <repository_url>
   cd kingproject/bazar3
   ```
2. Install dependencies:
   ```
   cd server
   npm install
   ```

## Configuration

1. Create a `.env` file in `/server` (or modify the existing one) with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=user
   DB_PASS=password
   DB_NAME=kingdb_prod
   IP_PEPPER=your_ip_pepper
   JWT_SECRET=<your_jwt_secret>
   PORT=3000
   ```

## Database Setup

1. Import the schema by running the SQL file `/server/schema.sql` in your MySQL client:
   ```
   mysql -u user -p < server/schema.sql
   ```
2. Ensure the database `kingdb_prod` is created with the required tables (teams, results, admins).

## Admin Account Setup

To create an admin account, run:
```
npm run create-admin -- <your_password>
```
This command will output an `Access Key` which you'll use for admin login.

## Running the Server

Start the API server with:
```
npm start
```
The server listens on the port specified in the `.env` file (default 3000).

## API Endpoints

### Public Endpoints
- **GET /api/results?team=<TEAM_NAME>&date=<YYYY-MM-DD>**  
  Retrieve the result for a specified team and date.  
- **GET /api/today**  
  Retrieve all results for the current day.
- **GET /api/health**  
  Basic health check endpoint to verify server and database connectivity.

### Admin Endpoints
- **POST /admin/login**  
  Login using `accessKey` and `password` to receive a session token.
- **POST /admin/results**  
  Publish a result. Requires authorization header with the token:  
  `Authorization: Bearer <SESSION_TOKEN>`

### Team Endpoints
- **GET /api/teams**  
  Retrieve all teams.
- **POST /api/teams**  
  Create a new team. Requires `name` and `announcement_time` in the body.
- **PUT /api/teams/:id**  
  Update a team.
- **DELETE /api/teams/:id**  
  Delete a team.

## Testing the API

A Postman collection is provided in `/server/postman_collection.json`. You can import this collection into Postman to test all endpoints easily.

Additionally, a simple test script is available:
```
npm run test-api
```
This script uses `axios` to perform a sequence of API calls, including admin login, creating a team, fetching teams, updating, deleting, and publishing a result.

## Caching
Results are cached in-memory for 5 minutes. Any write operations (POST, PUT, DELETE) clear the cache automatically.

## Rate Limiting and Security

- Rate limiting is implemented to allow 100 requests per minute per anonymized IP.
- IP addresses are anonymized using SHA3-256 with a salt and a secret pepper before being used for rate limiting.

## Additional Notes
- For input validation, the project leverages Joi.
- Changes to the project configuration or dependency versions may require updating the readme accordingly.

## License
Please include your project's license details here.

Happy Coding!

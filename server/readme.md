# Kings Backend API

## Overview
Kings Backend API is a RESTful API for managing teams, publishing match/show results, and handling admin authentication. It also includes a simple in-memory caching mechanism, input sanitization, and rate limiting for security.

## Prerequisites
- Node.js (v14 or higher)
- MySQL

## Installation

1. **Clone the Repository**
   ```bash
   git clone <repository_url>
   cd bazar3/server
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

## Configuration

1. **Environment Variables**

   Create a `.env` file in the `/server` directory with the following variables:
   ```env
   DB_HOST=localhost
   DB_USER=user
   DB_PASS=password
   DB_NAME=kingdb_prod
   IP_PEPPER=your_ip_pepper
   JWT_SECRET=<your_jwt_secret>
   PORT=5500
   ```

## Database Setup

1. **Import Schema**

   Run the following command in your MySQL client to create the database and tables:
   ```bash
   mysql -u user -p < server/schema.sql
   ```
   This creates the `kingdb_prod` database and the required tables: `teams`, `results`, and `admins`.

## Admin Account Setup

To create an admin account, run:
```bash
npm run create-admin -- <your_password>
```
This script will output an `Access Key` for admin login.

## Running the Server

Start the API server by running:
```bash
npm start
```
The server will listen on the port specified in your `.env` file (default is 5500).

## API Endpoints

### Public Endpoints
- **GET /api/results?team=<TEAM_NAME>&date=<YYYY-MM-DD>**  
  Retrieve the result for a specified team and date.
- **GET /api/today**  
  Retrieve all results for the current day.
- **GET /api/health**  
  Health check endpoint to verify server and database connectivity.
- **POST /api/results/monthly**  
  Get monthly results for a team.  
  _Request Body Example:_
  ```json
  {
    "team": "BIKANER SUPER",
    "month": "2025-03"
  }
  ```
- **GET /api/results/daily?date=<YYYY-MM-DD>**  
  Get daily results for all teams.

### Admin Endpoints
- **POST /admin/login**  
  Log in using `accessKey` and `password` to receive a session token.  
  _Request Body Example:_
  ```json
  {
    "accessKey": "<ACCESS_KEY>",
    "password": "<PASSWORD>"
  }
  ```
- **POST /admin/results**  
  Publish a result. Requires an authorization header with the session token.  
  _Request Body Example:_
  ```json
  {
    "team": "NEW TEAM",
    "result": "45",
    "result_time": "2025-03-12 15:00:00"
  }
  ```

### Team Endpoints
- **GET /api/teams**  
  Retrieve all teams (public).

- **POST /admin/teams**  
  Create a new team (admin only).  
  _Request Body Example:_
  ```json
  {
    "name": "NEW TEAM"
  }
  ```

- **PUT /admin/teams/:id**  
  Update a team (admin only, requires Bearer token).  
  _Request Body Example:_
  ```json
  {
    "name": "UPDATED TEAM"
  }
  ```

- **DELETE /admin/teams/:id**  
  Delete a team (admin only, requires Bearer token).

### Testing the API

1. **Using Postman**

   Import the Postman collection from `/server/postman_collection.json` to test all endpoints, including admin authentication, team management, result retrieval, and sanitization.

2. **Using the Test Script**

   A test script is available that performs a sequence of API calls:
   ```bash
   npm run test-api
   ```
   This script uses `axios` to:
   - Log in as an admin.
   - Create, fetch, update, and delete teams.
   - Publish a result.

## Caching

- Results are cached in memory for 5 minutes.
- Any write operations (POST, PUT, DELETE) clear the cache automatically.

## Rate Limiting and Security

- **Rate Limiting:**  
  The API allows 100 requests per minute per anonymized IP, using SHA3-256 based IP anonymization.
- **Input Sanitization:**  
  The middleware sanitizes incoming data (body, query, params) by escaping HTML characters to prevent XSS.
- **SQL Injection Protection:**  
  SQL queries use prepared statements with parameterized queries, ensuring inputs and queries remain separate.

## Additional Notes
- Input validation is implemented using Joi.
- Keep your environment variables secure.
- Modify configurations as necessary when upgrading dependency versions.

## License
Please include your project's license details here.

Happy Coding!

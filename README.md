# School Management System API

This project implements a **School Management System API** designed to manage schools, classrooms, and students. The API follows a RESTful architecture, includes robust role-based access control (RBAC), and uses **MongoDB** for data persistence.

## Features

- **Role-Based Access Control (RBAC):**
  - **Superadmin**: Full system access
  - **School Administrator**: Access restricted to their assigned school's resources
- **Entity Management:**
  - **Schools**:
    - Managed by Superadmins
    - CRUD operations and profile management
  - **Classrooms**:
    - Managed by School Administrators
    - Linked to specific schools
    - Capacity and resource management
  - **Students**:
    - Enrollment, profile management, and transfers
    - Resource tracking
- **Security and Scalability:**
  - JWT-based authentication
  - Input validation with Joi
  - API rate limiting
  - Error handling with proper HTTP status codes
- **Data Persistence:**
  - MongoDB schema design for scalable data storage

## Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14+)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/school-management-api.git


2. Navigate to the project directory::
   ```bash
   cd school-management-api
3. Install dependencies:
    ```bash
    npm install
4. Create a .env file in the root directory and configure:
    ```bash
    NODE_ENV=<Production/Development>
    APP_PORT=<PORT_NUMBER>
    MONGO_URI=<MONGO_URI>
    SUPERADMIN_KEY=<key to identify Superadmin cration authority>
    JWT_SECRET=<Your JWT Access Key>
    JWT_EXPIRES_IN=<Access token epiry time>
    REFRESH_TOKEN_SECRET= <JWT Refresh Key>
    REFRESH_TOKEN_EXPIRES_IN= <Refresh Token expiry time>
5. Start the server:
    ```bash
    npm start

## Project Structure

- **`app.js`**: Application entry point.
- **`index.js`**: Starts the server.
- **`auth/`**: Authentication utilities.
- **`cache/`**: Caching logic.
- **`config/`**: Configuration files.
- **`controllers/`**: Business logic.
- **`data/`**: Role definitions.
- **`middlewares/`**: Authentication/validation logic.
- **`model/`**: Mongoose schemas/models.
- **`routes/`**: API endpoint definitions.
- **`validation/`**: Joi validation schemas.
- **`public/`**: Static files.
- **`utils/`**: Helper functions.

## Error Handling
The API uses consistent error handling with proper HTTP status codes:

- **`400`** **Bad Request**: Invalid input or missing required fields.
- **`401`** **Unauthorized**: Missing or invalid authentication token.
- **`403`** **Forbidden**: User does not have permission to access the resource.
- **`404`** **Not Found**: Resource not found.
- **`409`** **Conflict**: Conflict in the request (e.g., duplicate resource or invalid state).
- **`429`** **Too Many Requests**: Rate limiting or excessive requests from the client.
- **`500`** **Internal Server Error**: An unexpected error occurred on the server.
- **`503`** **Service Unavailable**: The server is temporarily unavailable (e.g., under maintenance).


## Deployment
1. Host the application on a public hosting service like Heroku, AWS, or Vercel.
2. Update the .env file with production configurations.
3. Ensure the MongoDB instance is accessible remotely.


## License
This project is licensed under the MIT License. See the LICENSE file for details.


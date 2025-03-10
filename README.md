
## EasyShopify Server

EasyShopify Server is the backend for the EasyShopify E-commerce web application, built on the MERN stack. This server handles all API endpoints, database interactions, and user authentication, providing a robust and scalable foundation for the application. Performance is optimized with Redis caching, and secure user authentication and authorization are ensured using JWT.

## Technical Stack

**Backend:**
- Node.js
- Express.js
- Redis
- Socket.io

**Database:**
- MongoDB
- Mongoose

**Session Management:**
- JWT (JSON Web Token)

## Features

- Handles API endpoints for product management, user accounts, and orders.
- Implements user authentication and authorization with JWT.
- Optimizes performance with Redis caching.
- Supports real-time product sharing with reactions using Socket.io.
- Provides an instant reorder functionality for users.


## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Azeem-0/EasyShopifyServer.git
   ```

2. **Install dependencies:**

    ```bash
    cd server
    npm install
    ```

3. **Set up environment variables:**

    - Create a .env file in the root directory and add the necessary variables (e.g.,        MongoDB URI, JWT secret).

4. **Run the application:**
    ```bash
    npm run start
    ```

5. **Access the application:**
    - Visit http://localhost:3000 in your browser.

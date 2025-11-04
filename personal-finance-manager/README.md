# Personal Finance Manager

This project is a Personal Finance Manager web application built with Next.js and TypeScript for the frontend and a Node.js API with PostgreSQL as the database for the backend. The application allows users to manage their financial transactions and budgets effectively.

## Project Structure

The project is organized into two main applications:

- **Web Application (`apps/web`)**: A Next.js application that serves as the frontend interface for users to interact with their financial data.
- **API Application (`apps/api`)**: A Node.js application that provides RESTful API endpoints for managing transactions and budgets.

## Features

- **Transaction Management**: Users can create, view, and manage their financial transactions.
- **Budget Management**: Users can set and track budgets for different categories.
- **Responsive Design**: The web application is designed to be responsive and user-friendly.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL (version 12 or higher)
- Docker (optional, for containerized setup)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd personal-finance-manager
   ```

2. Install dependencies for both the web and API applications:

   ```
   cd apps/web
   npm install
   cd ../api
   npm install
   ```

3. Set up the environment variables:

   - Copy the example environment files and update them with your configuration:

     ```
     cp .env.example .env
     cp apps/web/.env.local.example apps/web/.env.local
     ```

4. Set up the PostgreSQL database:

   - Create a PostgreSQL database and update the connection settings in the `.env` files.

5. Run the database migrations using Prisma:

   ```
   npx prisma migrate dev --schema=apps/api/prisma/schema.prisma
   ```

### Running the Application

- To start the API server:

  ```
  cd apps/api
  npm run dev
  ```

- To start the web application:

  ```
  cd apps/web
  npm run dev
  ```

- The web application will be available at `http://localhost:3000`.

## Docker Setup

If you prefer to run the application using Docker, you can use the provided `docker-compose.yml` file:

1. Build and start the services:

   ```
   docker-compose up --build
   ```

2. Access the web application at `http://localhost:3000`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
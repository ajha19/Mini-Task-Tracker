# Mini Task Tracker - Walkthrough & Setup Guide

This guide explains how to run the `Mini Task Tracker` full-stack application on your local machine.

## Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MongoDB** (Running locally on default port `27017` OR use Docker)
- **Redis** (Running locally on default port `6379` OR use Docker)

## Quick Start with Docker (Recommended for DBs)

If you don't have MongoDB or Redis installed, you can use Docker:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
docker run -d -p 6379:6379 --name redis redis:latest
```

## 1. Backend Setup

The backend handles the API, database connection, and authentication.

1.  Navigate to the backend directory:
    ```bash
    cd mini-task-tracker/backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    - We have provided a `.env.example`. Copy it to `.env`:
    ```bash
    cp .env.example .env
    ```
    - The default values work for local development.

4.  Start the Development Server:
    ```bash
    npm run dev
    ```
    - The server will start at `http://localhost:5000`.
    - You should see "MongoDB Connected" and "Redis Client Connected" in the terminal.

5.  Run Tests (Optional):
    ```bash
    npm test
    ```
    - This runs integration tests for Auth and Task APIs using an in-memory database.

## 2. Frontend Setup

The frontend is a Next.js application that provides the user interface.

1.  Open a **new terminal** and navigate to the frontend directory:
    ```bash
    cd mini-task-tracker/frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the Development Server:
    ```bash
    npm run dev
    ```
    - The app will start at `http://localhost:3000`.

## 3. Using the Application

1.  Open your browser and go to `http://localhost:3000`.
2.  **Signup**: Click "create a new account" to register.
3.  **Dashboard**: After signup/login, you will see the Task Dashboard.
4.  **Create Task**: Type a title and click "Add Task".
5.  **Toggle Status**: Click the circle icon to mark a task as completed.
6.  **Delete Task**: Hover over a task and click the trash icon.
7.  **Logout**: Click the Logout button in the top right.

## Project Structure

- **Backend** (`/backend`):
    - `src/models`: Mongoose schemas (User, Task).
    - `src/controllers`: Business logic for Auth and Tasks.
    - `src/routes`: API route definitions.
    - `src/middleware`: Authentication middleware.
    - `src/config`: Database and Redis configuration.

- **Frontend** (`/frontend`):
    - `src/app/(auth)`: Login and Signup pages.
    - `src/app/dashboard`: Main task management page.
    - `src/context`: AuthContext for global user state.
    - `src/lib`: API client (Axios) configuration.
    - `src/components/ui`: Reusable UI components.

## Submission Reference

To submit this project (create a public repo):
1.  Initialize a git repo in the root `mini-task-tracker` folder (already done).
2.  Create a repository on GitHub.
3.  Push your code:
    ```bash
    git remote add origin <your-github-repo-url>
    git branch -M main
    git push -u origin main
    ```
4.  Ensure the repo is **Public**.

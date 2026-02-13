# Mini Task Tracker

A professional, full-stack Task Tracker application built with Node.js, Express, MongoDB, Redis, and Next.js.

> **Tip:** For a detailed, step-by-step guide on how this project was built and verified, please refer to [walkthrough.md](./walkthrough.md.)

## Features

- **Authentication**: Secure Signup and Login with JWT and Bcrypt.
- **Task Management**: Create, Read, Update, and Delete tasks with **Due Dates** and **Status**.
- **Filtering**: Filter tasks by status (All, Pending, Completed).
- **Caching**: Redis caching for high-performance task retrieval.
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS.
- **Optimistic Updates**: Immediate UI feedback for better user experience.
- **Auto-Logout**: Secure session management prevents access to login page while authenticated.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, Mongoose, Redis
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Axios, React Hook Form
- **Database**: MongoDB
- **Cache**: Redis
- **Testing**: Jest, Supertest

## Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or via Docker)
- Redis (Running locally or via Docker)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mini-task-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB and Redis URIs if needed.
# Ensure PORT is set to 5001 in .env
npm run dev
```

The backend server will start on **[http://localhost:5001](http://localhost:5001)**.

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Ensure NEXT_PUBLIC_API_URL is set to http://localhost:5001/api
npm run dev
```

The frontend application will start on **[http://localhost:3000](http://localhost:3000)**.

## Docker Setup (Optional)

You can run MongoDB and Redis using Docker:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
docker run -d -p 6379:6379 --name redis redis:latest
```

## Running Tests

To run the backend integration tests:

```bash
cd backend
npm test
```

## API Endpoints

Base URL: `http://localhost:5001`

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## License

MIT

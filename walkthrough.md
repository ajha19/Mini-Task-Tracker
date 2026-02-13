# Mini Task Tracker - WLDD Assignment Submission

**Submitted by:** Aman Jha
**Date:** February 14, 2026

---

## 1. Project Overview 🚀

The **Mini Task Tracker** is a full-stack web application designed to manage tasks efficiently. It demonstrates "communication superpowers" through a polished UI/UX and a robust backend architecture.

### Key Highlights
- **Professional UI**: Built with a custom design system using Tailwind CSS and Framer Motion for smooth animations.
- **Performance**: Integrated **Redis Caching** to minimize database hits for frequently accessed data.
- **Security**: Secure **JWT Authentication** with auto-logout features to protect user sessions.
- **Quality**: **>70% Backend Test Coverage** using Jest and Supertest.

---

## 2. Technology Stack 🛠️

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS, Axios, React Hook Form, Framer Motion |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB (Mongoose ODM) |
| **Caching** | Redis |
| **Testing** | Jest, Supertest |
| **DevOps** | Docker (Optional), Environment Management |

---

## 3. Setup & Installation ⚙️

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Running locally on port 27017)
- Redis (Running locally on port 6379)

### Step 1: Clone the Repository
```bash
git clone <your-repo-link>
cd mini-task-tracker
```

### Step 2: Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Verify PORT=5001 inside .env
npm run dev
```
> The backend server starts at `http://localhost:5001`.

### Step 3: Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```
> The frontend application starts at `http://localhost:3000`.

---

## 4. Application Walkthrough 📱

### A. Authentication
- **Sign Up / Login**: Users can create an account or log in securely.
- **Validation**: Forms have real-time validation (email format, password length).
- **Security**: Accessing protected routes (like Dashboard) without logging in redirects to Login.
- **Auto-Logout**: Navigating back to the Login page while authenticated automatically clears the session.

### B. Dashboard
- **Task List**: Displays all tasks with their title, description, status, and due date.
- **Filtering**: A dropdown menu allows filtering tasks by status: **All**, **Pending**, or **Completed**.
- **Visuals**: Completed tasks are visually distinguished with a green badge and strikethrough text.

### C. Task Management
- **Create Task**: A responsive modal/form to add new tasks with due dates.
- **Update Status**: Clicking the status badge instantly toggles between "Pending" and "Completed" (Optimistic UI).
- **Delete Task**: Remove tasks with a single click.

---

## 5. System Architecture & Quality Code 🏗️

### Folder Structure
The project follows a clean, modular structure:
```
/backend
  /src
    /controllers  # Request logic
    /models       # Database schemas
    /routes       # API endpoints
    /middleware   # Auth & Error handling
    /config       # DB & Redis connection
/frontend
  /src
    /app          # Next.js App Router pages
    /components   # Reusable UI (Card, Button, Input)
    /context      # Global Auth State
    /lib          # Utilities (API client, class merger)
```

### Key Design Patterns
1.  **Service-Controller Layer**: Separation of concerns in the backend.
2.  **Component Reusability**: Created atomic UI components (`Button.tsx`, `Card.tsx`) used across the app.
3.  **Typosafety**: Full TypeScript implementation on both ends to prevent runtime errors.

---

## 6. Testing & Validation ✅

Robust testing ensures reliability. The backend includes integration tests covering the entire task lifecycle.

**Run Tests:**
```bash
cd backend
npm run test
```

**Results:**
- **8/8 Tests Passed**
- Covered Scenarios:
    - User Registration & Login
    - Task Creation (Authorized)
    - Task Retrieval (Cached & DB)
    - Task Deletion (Owner verification)
    - Error Handling (404, 401)

---

## 7. Future Improvements 🔮

- **Drag & Drop**: Implement Kanban-style task sorting.
- **Dark Mode Toggle**: Add a tailored dark mode (currently supports system preference).
- **Email Notifications**: Notify users 24h before a task is due.

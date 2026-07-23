# EduHub - E-Learning Platform

A full-stack e-learning platform built with the MERN stack, enabling students to enroll in courses, watch lessons, take quizzes, and discuss with peers in real time.

## Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS, React Router v7, Socket.io-client, Axios, Chart.js, React Quill

**Backend:** Node.js, Express 5, MongoDB (Mongoose), Socket.io, JWT, Bcryptjs, Cloudinary, Cashfree PG, Multer

## Features

- User authentication (JWT + HTTP-only cookies) with role-based access: `student`, `instructor`
- Course management — instructors can create, edit, delete courses with thumbnail upload
- Lesson management — video lessons uploaded to Cloudinary, rich-text content via Quill editor
- PDF notes upload per course
- Payment integration via Cashfree (sandbox) for course enrollment
- Quiz system — instructors add quizzes; students take and view results
- Real-time course discussion chat with Socket.io (typing indicators, emoji reactions)
- Student progress tracking per lesson with circular progress bar
- Course reviews and ratings
- Instructor dashboard with monthly revenue bar chart
- Rate limiting (100 req / 15 min per IP)
- Health check endpoint

## Project Structure

```
E-Learning Platform/
├── backend/          # Express API server
│   ├── controllers/  # Route handlers
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   ├── middlewares/  # Auth, Multer
│   ├── utils/        # Cloudinary helper
│   ├── db/           # MongoDB connection
│   └── app.js        # Entry point (port 9000)
└── frontend/         # React + Vite app
    └── src/
        ├── pages/        # Route-level components
        ├── components/   # Reusable UI components
        ├── context/      # App-wide state (AppContextProvider)
        └── helper/       # Toast, WebSocket utilities
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/user/signup` | Register user |
| POST | `/api/user/login` | Login user |
| GET | `/api/auth/check` | Check auth status |
| GET | `/api/course/` | Get all courses |
| POST | `/api/course/add` | Add course (instructor) |
| PUT | `/api/course/edit/:id` | Update course |
| DELETE | `/api/course/:id` | Delete course |
| POST | `/api/lesson/add/:courseId` | Add lesson |
| POST | `/api/payment/checkout` | Initiate payment |
| POST | `/api/payment/verify` | Verify payment & enroll |
| POST | `/api/enrollment/enroll/:courseId` | Free enrollment |
| POST | `/api/enrollment/progress` | Mark lesson complete |
| GET | `/api/enrollment/revenue` | Monthly revenue (instructor) |
| POST | `/api/quiz/add/:courseId` | Add quiz |
| GET | `/api/quiz/:courseId` | Get quiz |
| POST | `/api/quiz/submit/:quizId` | Submit quiz |
| GET | `/api/discussion-messages/:courseId` | Get messages |
| POST | `/api/discussion-messages/:messageId/reactions` | Add reaction |
| GET | `/api/health` | Health check |

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB instance
- Cloudinary account
- Cashfree sandbox credentials

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
MONGODB_URL=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
CLOUDINARY_CLOUD_NAME=<cloudinary_cloud_name>
CLOUDINARY_API_KEY=<cloudinary_api_key>
CLOUDINARY_API_SECRET=<cloudinary_api_secret>
CLIENT_ID=<cashfree_client_id>
CLIENT_SECRET=<cashfree_client_secret>
```

```bash
npm start   # runs on port 9000
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_BASE_URL=http://localhost:9000/api
```

```bash
npm run dev   # runs on http://localhost:5173
```

## Deployment

- Frontend deployed on **Vercel** (`vercel.json` includes SPA rewrite rules)
- Backend deployed on **Render** (WebSocket URL configured in `src/helper/webSocket.js`)

## Data Models

| Model | Description |
|-------|-------------|
| User | Auth, roles, enrolled/created courses |
| Course | Title, description, category, price, thumbnail, lessons, reviews, PDFs |
| Lesson | Title, video URL (Cloudinary), rich-text content |
| Enrollment | User-course link, payment info, lesson progress |
| Payment | Transaction record |
| Quiz | Questions, options, correct answers per course |
| QuizResult | User score history |
| Review | Rating and comment per course |
| DiscussionMessage | Chat messages with emoji reactions |

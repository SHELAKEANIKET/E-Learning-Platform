# EduHub E-Learning Platform — Frontend

React + Vite frontend for the EduHub e-learning platform.

## Tech Stack

- React 19, React Router v7
- Vite 6
- Tailwind CSS 3
- Axios, Socket.io-client
- Chart.js / react-chartjs-2
- React Quill (rich-text editor)
- Cashfree JS SDK (payments)
- React Toastify, SweetAlert2
- Embla Carousel, React Awesome Reveal

## Pages & Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/` | Home | Public |
| `/allcourses` | AllCourses | Public |
| `/course/:id` | CourseDetails | Public |
| `/signup` | Signup | Public only |
| `/login` | Login | Public only |
| `/profile` | Profile | Student |
| `/course/:id/quiz` | CourseQuiz | Authenticated |
| `/quiz/result/:quizId` | QuizResult | Authenticated |
| `/discussion-messages/:courseId` | CourseDiscussion | Authenticated |
| `/payment-success` | PaymentSuccess | Authenticated |
| `/instructor/dashboard` | Dashboard | Instructor |
| `/instructor/courses` | InstructorCourses | Instructor |
| `/instructor/lessons` | CourseLessons | Instructor |
| `/instructor/addcourse` | AddCourse | Instructor |
| `/instructor/addlesson/:id` | AddLesson | Instructor |
| `/instructor/course/edit/:id` | EditCourse | Instructor |
| `/instructor/lesson/edit/:id` | EditLesson | Instructor |
| `/instructor/course/upload-pdf/:id` | UploadPdf | Instructor |
| `/instructor/course/add-quiz/:id` | AddQuiz | Instructor |
| `/instructor/course/edit-quiz/:id` | EditQuiz | Instructor |

## Setup

```bash
npm install
```

Create a `.env` file:

```env
VITE_BASE_URL=http://localhost:9000/api
```

```bash
npm run dev      # development server
npm run build    # production build
npm run preview  # preview production build
```

## Key Features

- Role-based routing (`ProtectedRoute`, `RoleProtectedRoute`, `PublicOnlyRoute`)
- Global state via React Context (`AppContextProvider`) — auth, courses, instructor data
- Real-time discussion chat with Socket.io (typing indicators, emoji reactions)
- Cashfree sandbox payment flow with post-payment verification
- Lesson progress tracking with circular progress bar
- Rich-text course/lesson descriptions via React Quill
- Monthly revenue bar chart for instructors (Chart.js)
- Responsive design with Tailwind CSS custom theme

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_BASE_URL` | Backend API base URL |

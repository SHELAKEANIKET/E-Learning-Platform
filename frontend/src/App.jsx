import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/ui/Layout";
import CourseDetails from "./pages/CourseDetails";
import Signup from "./components/ui/Signup";
import Login from "./components/ui/Login";
import { ToastContainer } from "react-toastify";
import Profile from "./pages/Profile";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorCourses from "./components/ui/admin/InstructorCourses";
import AddCourse from "./components/ui/admin/AddCourse";
import AdminProfile from "./components/ui/admin/AdminProfile";
import AllCourses from "./pages/AllCourses";
import EditCourse from "./components/ui/admin/EditCourse";
import Dashboard from "./components/ui/admin/Dashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import CourseLessons from "./components/ui/admin/CourseLessons";
import AddLesson from "./components/ui/admin/AddLesson";
import EditLesson from "./components/ui/admin/EditLesson";
import PublicOnlyRoute from "./components/ui/PublicOnlyRoute";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import RoleProtectedRoute from "./components/ui/RoleProtectedRoute";
import NotFound from "./components/ui/NotFound";
import UploadPdf from "./components/ui/admin/UploadPdf";
import CourseQuiz from "./pages/CourseQuiz";
import QuizResult from "./pages/QuizResult";
import AddQuiz from "./components/ui/admin/AddQuiz";
import EditQuiz from "./components/ui/admin/EditQuiz";

function App() {
  return (
    <div className="bg-background min-h-screen w-full overflow-hidden font-sans selection:bg-primary selection:text-white">
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            <Route path="/allcourses" element={<AllCourses />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route
              path="/signup"
              element={
                <PublicOnlyRoute>
                  <Signup />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:id/quiz"
              element={
                <ProtectedRoute>
                  <CourseQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/result/:quizId"
              element={
                <ProtectedRoute>
                  <QuizResult />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/"
              element={
                <RoleProtectedRoute role="instructor">
                  <InstructorDashboard />
                </RoleProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="courses" element={<InstructorCourses />} />
              <Route path="lessons" element={<CourseLessons />} />
              <Route path="addcourse" element={<AddCourse />} />
              <Route path="addlesson/:id" element={<AddLesson />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="course/edit/:id" element={<EditCourse />} />
              <Route path="lesson/edit/:id" element={<EditLesson />} />
              <Route path="course/upload-pdf/:id" element={<UploadPdf />} />
              <Route path="course/add-quiz/:id" element={<AddQuiz />} />
              <Route path="course/edit-quiz/:id" element={<EditQuiz />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;

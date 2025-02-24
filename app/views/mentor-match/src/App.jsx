import { Route, Routes, useLocation } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar"
import HeroSection from "./components/HeroSection"
import Register from "./pages/Register"
import Login from "./pages/Login"
import AllMentor from "./pages/AllMentor"
import Profile from "./pages/Profile"
import MentorDetail from "./pages/Mentor-detail"
import AdminDashboard from "./pages/AdminDashboard"
import MyStudents from "./pages/MyStudents"
import MentorProfile from "./pages/MentorProfile"
import ApplyForm from "./pages/ApplyForm"
import MyBookings from "./pages/MyBookings"
import MenteeDetail from "./pages/mentee-detail"
import MeetingPage from "./pages/MeetingPage"
import Footer from "./components/footer"
import Chat from "./pages/Chat"
import MentorViewMenteeProfile from "./pages/MentorViewMenteeProfile"
import PaymentRejectedPage from "./pages/PaymentRejectedPage"
import PaymentSuccess from "./pages/PaymentSuccessPage"
import ReviewForm from "./pages/ReviewForm"
import PrivateRoute from "./components/PrivateRoute"
import Unauthorized from "./pages/Unauthorized"
import NotFound from "./pages/NotFound"

export default function App() {

  const location = useLocation()

  const hideFooterRoutes = [
    "/meeting-page",
    "/profile/mentorViewMenteeProfile",
    "/mentor-profile",
    "/profile",
    "/meeting-page/",
    "/mentor-profile/",
    "/unauthorized",
    "/payment-rejected",
    "/payment-success"
  ];

  // Check if current path includes any of these paths
  const showFooter = !hideFooterRoutes.some(path => location.pathname.startsWith(path));

  return (
    <div>
      <Navbar />
      <ToastContainer autoClose={2000} />

      <Routes>
        {/* All */}
        <Route path="/" element={<HeroSection />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route path="/admin-dashboard" element={<PrivateRoute permittedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />

        {/* Mentor */}
        <Route path="/mentor-detail" element={<PrivateRoute permittedRoles={['mentor']}><MentorDetail /></PrivateRoute>} />
        <Route path="/profile/mentorViewMenteeProfile/:id" element={<PrivateRoute permittedRoles={['mentor']}><MentorViewMenteeProfile /></PrivateRoute>} />
        <Route path="/my-student/:mentorId" element={<PrivateRoute permittedRoles={['mentor']}><MyStudents /></PrivateRoute>} />


        {/* Mentee */}
        <Route path="/allMentor" element={<PrivateRoute permittedRoles={['mentee', 'mentor', 'admin']}><AllMentor /></PrivateRoute>} />
        <Route path="/mentee-detail" element={<PrivateRoute permittedRoles={['mentee']}><MenteeDetail /></PrivateRoute>} />
        <Route path="/my-bookings/:menteeId" element={<PrivateRoute permittedRoles={['mentee']}><MyBookings /></PrivateRoute>} />


        {/* Both */}
        <Route path="/review-form" element={<PrivateRoute permittedRoles={['mentee', 'mentor']}><ReviewForm /></PrivateRoute>} />
        <Route path="/chat/:mentorId/:menteeId" element={<PrivateRoute permittedRoles={['mentee', 'mentor']}><Chat /></PrivateRoute>} />
        <Route path="/profile/:id/:role" element={<PrivateRoute permittedRoles={['mentee', 'mentor']}><Profile /></PrivateRoute>} />
        <Route path="/meeting-page/:mentorId/:menteeId" element={<PrivateRoute permittedRoles={['mentee', 'mentor']}><MeetingPage /></PrivateRoute>} />
        <Route path="/mentor-profile/:id" element={<PrivateRoute permittedRoles={['mentee', 'mentor']}><MentorProfile /></PrivateRoute>} />
        <Route path="/apply-form/:mentorId/:plan/:amount" element={<PrivateRoute permittedRoles={['mentee', 'mentor']}><ApplyForm /></PrivateRoute>} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* payment */}
        <Route path="/payment-rejected" element={<PaymentRejectedPage />} />
        <Route path="/payment-success/mentor/:mentorId/mentee/:menteeId" element={<PaymentSuccess />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {showFooter && <Footer />}
    </div>
  )
}

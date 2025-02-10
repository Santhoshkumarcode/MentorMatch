import { Route, Routes } from "react-router-dom"

import Navbar from "./components/Navbar"
import HeroSection from "./components/HeroSection"
import Register from "./pages/Register"
import Login from "./pages/Login"
import AllMentor from "./pages/AllMentor"
import Profile from "./pages/profile"
import MentorDetail from "./pages/Mentor-detail"
import AdminDashboard from "./pages/AdminDashboard"
import MyStudents from "./pages/MyStudents"
import MentorProfile from "./pages/MentorProfile"
import ApplyForm from "./pages/ApplyForm"
import MyBookings from "./pages/MyBookings"
import MenteeDetail from "./pages/mentee-detail"
import { useSelector } from "react-redux"
import MeetingPage from "./pages/MeetingPage"
import Footer from "./components/footer"
import Chat from "./pages/Chat"

export default function App() {

  return (
    <div className="bg-gray-50">
      <Navbar />

      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        <Route path="/allMentor" element={<AllMentor />} />
        <Route path="/mentor-detail" element={<MentorDetail />} />
        <Route path="/mentee-detail" element={<MenteeDetail />} />

        <Route path="/chat/:mentorId/:menteeId" element={<Chat />} />
        <Route path="/profile/:id/:role" element={<Profile />} />
        <Route path="/my-bookings/:menteeId" element={<MyBookings />} />
        <Route path="/meeting-page/:mentorId/:menteeId" element={<MeetingPage />} />
        <Route path="/my-student/:mentorId" element={<MyStudents />} />
        <Route path="/mentor-profile/:id" element={<MentorProfile />} />
        <Route path="/apply-form/:mentorId/:plan" element={<ApplyForm />} />
      </Routes>


      {/* <Footer /> */}

    </div>
  )
}

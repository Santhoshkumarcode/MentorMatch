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

export default function App() {
  return (
    <div>
      <Navbar />


      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/allMentor" element={<AllMentor />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mentor-detail" element={<MentorDetail />} />
        <Route path="/mentee-detail" element={<MenteeDetail />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        

        <Route path="/my-student/" element={<MyStudents />} />
        <Route path="/mentor-profile/:id" element={<MentorProfile />} />
        <Route path="/apply-form/:mentorId/:plan" element={<ApplyForm />} />
      </Routes>
    </div>
  )
}

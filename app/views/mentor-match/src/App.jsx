import { Route, Routes } from "react-router-dom"

import Navbar from "./components/Navbar"
import HeroSection from "./components/HeroSection"
import Register from "./pages/Register"
import Login from "./pages/Login"
import AllMentor from "./pages/AllMentor"
import Profile from "./pages/profile"
import MentorDetail from "./pages/Mentor-detail"

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
      </Routes>
    </div>
  )
}

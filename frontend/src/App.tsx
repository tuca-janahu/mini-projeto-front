import Home from "./pages/Home/HomePage";
import Login from "./pages/Login/LoginPage";
import Register from "./pages/RegisterPage";
import ExercisePage from "./pages/Exercise/ExercisePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SessionPage from "./pages/Session/SessionPage";
import DayPage from "./pages/Day/DayPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/exercises" element={<ExercisePage />} />
        <Route path="/training-days" element={<DayPage />} />
        <Route path="/training-sessions" element={<SessionPage />} />
      </Routes>
    </Router>
  );
}

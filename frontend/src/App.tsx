import Home from "./pages/Home/HomePage";
import Login from "./pages/Login/LoginPage";
import Register from "./pages/RegisterPage";
import ExercisePage from "./pages/Exercise/ExercisePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SessionPage from "./pages/Session/SessionPage";
import DayPage from "./pages/Day/DayPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RequireAuth from "./routes/RequireAuth";

export default function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="/exercises" element={<ExercisePage />} />
          <Route path="/training-days" element={<DayPage />} />
          <Route path="/training-sessions" element={<SessionPage />} />
        </Route>
      </Routes>
    </Router>

    <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
      </>

  );
}

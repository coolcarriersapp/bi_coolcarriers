import { Routes, Route, Navigate } from "react-router-dom";

// === Containers ===
import Login from "../containers/Login";
import Signup from "../containers/Signup";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

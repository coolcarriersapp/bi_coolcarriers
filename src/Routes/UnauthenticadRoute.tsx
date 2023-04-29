import { Routes, Route, Navigate } from "react-router-dom";

// === Containers ===
import Login from "../containers/Login";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

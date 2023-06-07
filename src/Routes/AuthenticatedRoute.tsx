import { Routes, Route, Navigate } from "react-router-dom";

// === Containers ===
import Home from "../containers/Home";
import Dashboard from "../containers/Dashboard";
import Test from "../containers/Test";

// === Components ===
import NavBar from "../components/NavBar";
import MenuBar from "../components/MenuBar";

export default function AuthenticatedRoute() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={
          <>
            <NavBar />
            <MenuBar />
            <Dashboard />
          </>
        }
      />
      <Route path="/test" element={<Test />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

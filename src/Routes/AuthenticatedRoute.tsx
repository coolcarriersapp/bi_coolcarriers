import { Routes, Route, Navigate } from "react-router-dom";

// === Containers ===
import Home from "../containers/Home";
import Test from "../containers/Test";

export default function AuthenticatedRoute() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/test" element={<Test />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

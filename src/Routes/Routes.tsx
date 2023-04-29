import { Routes, Route } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";

// === Components ===
import UnauthenticatedRoute from "./UnauthenticadRoute";
import AuthenticatedRoute from "./AuthenticatedRoute";

const ManagementRoutes = () => {
  const { isAuthenticated } = useAppContext();
  return (
    <Routes>
      {isAuthenticated ? (
        <Route path="/*" element={<AuthenticatedRoute />} />
      ) : (
        <Route path="/*" element={<UnauthenticatedRoute />} />
      )}
      {/* COMMON ROUTES */}
      {/* <Route path="" element={} /> */}
    </Routes>
  );
};
export default ManagementRoutes;

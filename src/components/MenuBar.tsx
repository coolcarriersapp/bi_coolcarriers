import { useState } from "react";
import { useAppContext } from "../libs/contextLib";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "primereact/sidebar";

// === Components ===
import Profile from "./Profile";

// === Images ===
import isoLogo from "../assets/images/iso_logo.svg";

function MenuBar() {
  const { setIsAuthenticated } = useAppContext();
  let navigate = useNavigate();

  const [visible, setVisible] = useState(false);

  return (
    <div className="MenuBar">
      <Profile></Profile>
    </div>
  );
}

export default MenuBar;

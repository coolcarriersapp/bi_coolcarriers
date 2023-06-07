import { useState } from "react";
import { useAppContext } from "../libs/contextLib";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "primereact/sidebar";

// === Images ===
import isoLogo from "../assets/images/iso_logo.svg";

function NavBar() {
  const { setIsAuthenticated } = useAppContext();
  let navigate = useNavigate();

  const [visible, setVisible] = useState(false);

  return (
    <div className="NavBar">
      <div className="card flex justify-content-center">
        <Sidebar
          className="NavBar__openBar"
          visible={visible}
          onHide={() => setVisible(false)}
          showCloseIcon={false}
          modal={false}
        >
          <div className="NavBar__openBar-header">            
            <img
              src={isoLogo}
              onClick={() => {
                setVisible(true);
              }}
            ></img>
            <label>COOLDAT - © 2023</label>
          </div>
        </Sidebar>
        <Sidebar
          className="NavBar__closeBar"
          visible={!visible}
          onHide={() => {}}
          showCloseIcon={false}
          modal={false}
        >
          <div className="NavBar__closeBar-header">
            <img
              src={isoLogo}
              onClick={() => {
                setVisible(true);
              }}
            ></img>
          </div>
        </Sidebar>
      </div>
    </div>
  );
}

export default NavBar;

import { useRef } from "react";
import { useAppContext } from "../libs/contextLib";

import "primeicons/primeicons.css";

// === Components ===
import { OverlayPanel } from "primereact/overlaypanel";

// === Images ===
import arrow from "../assets/images/arrow.svg";
import isoLogo from "../assets/images/iso_logo_color.svg";

function Profile() {
  const { userName, userLastName, userImage } = useAppContext();
  const op = useRef<OverlayPanel>(null);

  return (
    <div className="Profile">
      <div className="Profile__name">
        <label>
          {(userName || "Cool") + " " + (userLastName || "Carriers")}
        </label>
      </div>
      <div className="Profile__image">
        <img src={userImage || isoLogo}></img>
      </div>
      <div className="Profile__button">
        <button onClick={(e) => op.current?.toggle(e)}>
          <img src={arrow}></img>
        </button>
        <OverlayPanel ref={op}>
          <div className="Profile__overlay">
            <i className="pi pi-sign-out Profile__overlay-icon"></i>
            <span className="Profile__overlay-label">Logout</span>
          </div>
        </OverlayPanel>
      </div>
    </div>
  );
}

export default Profile;

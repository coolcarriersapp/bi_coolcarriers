import { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { useAppContext } from "../libs/contextLib";

// === Images ===
import isoLogo from "../assets/images/iso_logo.svg";

function NavBar() {
  const {
    userConfiguration,
    currentSection,
    setCurrentSection,
    currentPage,
    setCurrentPage,
  } = useAppContext();
  const [visible, setVisible] = useState(false);

  const renderPage = (page: any, section: any) => {
    return (
      <div
        className={
          currentPage !== page.page_name
            ? "NavBar__page-container"
            : "NavBar__page-container NavBar__page-container--active"
        }
      >
        <label
          onClick={() => {
            setCurrentPage(page.page_name);
            setCurrentSection(section.section_name);
            setVisible(false);
          }}
        >
          {page.page_name}
        </label>
      </div>
    );
  };

  const renderSections = (section: any) => {
    return (
      <div
        className={
          currentSection !== section.section_name
            ? "NavBar__sections-container"
            : "NavBar__sections-container NavBar__sections-container--active"
        }
      >
        <label>{section.section_name}</label>
        <div className="NavBar__pages-container">
          {section.pages.map(function (page: any) {
            return renderPage(page, section);
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="NavBar">
      <div>
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
          {userConfiguration && (
            <div>
              {userConfiguration.sections.map(function (section) {
                return renderSections(section);
              })}
            </div>
          )}
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

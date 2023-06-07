import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

// === Styles ===
import "./index.css";    
//core
import "primereact/resources/primereact.min.css";   
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";                                    
        

import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

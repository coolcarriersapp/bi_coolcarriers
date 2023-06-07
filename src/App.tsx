import { useEffect, useState } from "react";
import { AppContext } from "./libs/contextLib";
// === Styles ===
import "../src/assets/sass/app.scss";

// === Routes ===
import ManagementRoutes from "./Routes/Routes";

function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userName, setUserName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userImage, setUserImage] = useState("");

  useEffect(() => {
    setIsAuthenticating(false);
  }, []);

  return !isAuthenticating ? (
    <div className="App">
      <AppContext.Provider
        value={{
          isAuthenticated,
          setIsAuthenticated,
          userName,
          setUserName,
          userLastName,
          setUserLastName,
          userImage,
          setUserImage,
        }}
      >
        <ManagementRoutes />
      </AppContext.Provider>
    </div>
  ) : (
    // TODO: Add loading view
    <></>
  );
}

export default App;

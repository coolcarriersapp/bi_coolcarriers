import { useEffect, useState } from "react";
import { AppContext } from "./libs/contextLib";
// === Styles ===
import "../src/assets/sass/app.scss"
// === Routes ===
import ManagementRoutes from "./Routes/Routes";

function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    setIsAuthenticating(false);
  }, []);

  return !isAuthenticating ? (
    <div className="App">
      <AppContext.Provider
        value={{
          isAuthenticated,
          setIsAuthenticated,
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

import { useEffect, useState } from "react";
import { AppContext } from "./libs/contextLib";
import { ApolloProvider } from "@apollo/client";
import { Auth } from "aws-amplify";
import client from "./apollo";
// === Styles ===
import "../src/assets/sass/app.scss";

// === Routes ===
import ManagementRoutes from "./Routes/Routes";

function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userName, setUserName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [userConfiguration, setUserConfiguration] = useState(null);
  const [currentSection, setCurrentSection] = useState("");
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      // Checking if user is authenticated
      await Auth.currentSession();
      let token = userToken;
      if (userToken === null) {
        let data = await Auth.currentAuthenticatedUser();
        token = data.signInUserSession.idToken.jwtToken;
        setUserToken(token);
      }
      setIsAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }
    setIsAuthenticating(false);
  }

  return !isAuthenticating ? (
    <div className="App">
      <ApolloProvider client={client}>
        <AppContext.Provider
          value={{
            isAuthenticated,
            setIsAuthenticated,
            userToken,
            setUserToken,
            userName,
            setUserName,
            userLastName,
            setUserLastName,
            userImage,
            setUserImage,
            userConfiguration,
            setUserConfiguration,
            currentSection,
            setCurrentSection,
            currentPage,
            setCurrentPage,
          }}
        >
          <ManagementRoutes />
        </AppContext.Provider>
      </ApolloProvider>
    </div>
  ) : (
    // TODO: Add loading view
    <></>
  );
}

export default App;

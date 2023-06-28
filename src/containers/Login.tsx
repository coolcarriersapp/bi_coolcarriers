import { useState } from "react";
import { useAppContext } from "../libs/contextLib";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";

// === Images ===
import isoLogo from "../assets/images/iso_logo_color.svg";

// === Components ===
import { Row, Col, Button } from "react-bootstrap";

function Login() {
  const { setIsAuthenticated } = useAppContext();
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await Auth.signIn(username, password);
      setIsAuthenticated(true);
    } catch (error) {
      console.log("Error logging in:", error);
    }
  };

  return (
    <div className="Login">
      <Row className="justify-content-center">
        <div className="Login__card">
          <Row className="justify-content-center">
            <img src={isoLogo}></img>
          </Row>
          <h1 className="Login__card-title">Login</h1>
          <div className="login-input">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="login-input">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Row className="justify-content-center">
            <Col className="text-align-center">
              <Button className="login-button" onClick={handleLogin} disabled={!username || !password}>
                Login
              </Button>
            </Col>
          </Row>
          <Row className="justify-content-center" style={{ marginTop: "20px" }}>
            <Col className="text-align-center">
              <a href="#" onClick={() => navigate("/signup")}>
                Go to Sign Up
              </a>
            </Col>
          </Row>
        </div>
      </Row>
    </div>
  );
}

export default Login;

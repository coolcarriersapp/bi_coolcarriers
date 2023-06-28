import { useState } from "react";
import { useAppContext } from "../libs/contextLib";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";

// === Images ===
import isoLogo from "../assets/images/iso_logo_color.svg";

// === Components ===
import { Row, Col, Button } from "react-bootstrap";

function Signup() {
  const { setIsAuthenticated } = useAppContext();
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isConfirmationCodeRequired, setIsConfirmationCodeRequired] =
    useState(false);

  const handleSignup = async () => {
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email: username,
        },
      });
      setIsConfirmationCodeRequired(true);
    } catch (error) {
      console.log("Error signing up:", error);
    }
  };

  const handleConfirmation = async () => {
    try {
      await Auth.confirmSignUp(username, verificationCode);
      const user = await Auth.signIn(username, password);
      console.log("Login successful", user);
      setIsAuthenticated(true);
    } catch (error) {
      console.log("Error confirming sign up:", error);
    }
  };

  return (
    <div className="Signup">
      <Row className="justify-content-center">
        <div className="Signup__card">
          <Row className="justify-content-center">
            <img src={isoLogo}></img>
          </Row>
          <h1 className="Signup__card-title">Sign Up</h1>
          {!isConfirmationCodeRequired ? (
            <>
              <div className="signup-input">
                <label>Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="signup-input">
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="signup-input">
                <label>Confirm password:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Row className="justify-content-center">
                <Col className="text-align-center">
                  <Button
                    className="signup-button"
                    onClick={handleSignup}
                    disabled={password !== confirmPassword || password === ""}
                  >
                    Sign Up
                  </Button>
                </Col>
              </Row>
              <Row
                className="justify-content-center"
                style={{ marginTop: "20px" }}
              >
                <Col className="text-align-center">
                  <a href="#" onClick={() => navigate("/login")}>
                    Go to Login
                  </a>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <div className="signup-input">
                <label>Verification Code:</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </div>
              <Row className="justify-content-center">
                <Col xs={5} lg={5} className="text-align-center">
                  <Button
                    className="signup-button"
                    onClick={handleConfirmation}
                  >
                    Confirm
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </div>
      </Row>
    </div>
  );
}

export default Signup;

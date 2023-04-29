import { useNavigate } from "react-router-dom";

function Test() {
  let navigate = useNavigate();

  return (
    <div>
      <h1>Test</h1>
      <button onClick={() => navigate("/")}>Return to home</button>
    </div>
  );
}

export default Test;

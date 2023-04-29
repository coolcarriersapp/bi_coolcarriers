import { useAppContext } from "../libs/contextLib";
import { useNavigate } from "react-router-dom";

function Home() {
  const { setIsAuthenticated } = useAppContext();
  let navigate = useNavigate();

  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => navigate("test")}>go to test</button>
      <button onClick={() => setIsAuthenticated(false)}>logout</button>
    </div>
  );
}

export default Home;

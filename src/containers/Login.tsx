import { useAppContext } from "../libs/contextLib";

function Login() {
  const { setIsAuthenticated } = useAppContext();
  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => setIsAuthenticated(true)}>Signin</button>
    </div>
  );
}

export default Login;

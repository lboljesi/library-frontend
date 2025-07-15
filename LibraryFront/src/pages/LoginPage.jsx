import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../services/api";
import { AuthContext } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, token } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const newToken = await loginRequest(email, password);
      login(newToken);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token]);

  return (
    <div>
      <h1>Login</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/register">Register here!</a>
      </p>
    </div>
  );
}
export default LoginPage;

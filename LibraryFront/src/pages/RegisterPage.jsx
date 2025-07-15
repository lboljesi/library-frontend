import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { registerRequest } from "../services/api";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, token } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const newToken = await registerRequest(email, password, fullName);
      login(newToken);
    } catch (err) {
      if (err.response?.status === 400)
        setError("User with that email already exists.");
      else setError("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (token) navigate("/home");
  }, [token]);

  return (
    <div>
      <h1>Register</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Email: </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Full Name: </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <a href="/">Login here</a>
      </p>
    </div>
  );
}
export default RegisterPage;

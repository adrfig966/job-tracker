import { query as q } from "faunadb";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

//Component to display login form
const LoginForm = ({ onlogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, state } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);
    await login(email, password);
    console.log(state);
    setLoading(false);
  };

  useEffect(() => {
    if (state.user) {
      onlogin();
    } else if (state.error) {
      setError("Failed to log in");
    }
  }, [state]);

  return (
    <>
      {error && <p>{error}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn" type="submit" disabled={loading}>
          Login
        </button>
      </form>
    </>
  );
};

export default LoginForm;

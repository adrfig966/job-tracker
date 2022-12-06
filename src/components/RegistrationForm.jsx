import { query as q } from "faunadb";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

const RegForm = ({ onreg }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, state } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await signup(email, password, confirmpassword);
      onreg();
    } catch {
      setError("Failed to sign up");
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log(state);
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
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button className="btn" type="submit" disabled={loading}>
          Login
        </button>
      </form>
    </>
  );
};

export default RegForm;

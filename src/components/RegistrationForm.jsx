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

    if (password !== confirmpassword) {
      return setError("Passwords do not match");
    }

    setError("");
    setLoading(true);
    await signup(email, password, confirmpassword);
    setLoading(false);
  };

  useEffect(() => {
    if (state.user) {
      onreg();
    } else if (state.error) {
      setError("Failed to sign up");
    }
  }, [state]);

  return (
    <>
      {error && <p>{error}</p>}
      <form className="user-form" onSubmit={handleSubmit}>
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
          Sign Up
        </button>
      </form>
    </>
  );
};

export default RegForm;

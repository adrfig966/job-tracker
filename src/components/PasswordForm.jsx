import { query as q } from "faunadb";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

const PasswordForm = ({ onupdate }) => {
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { updatepassword, state } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      return setMessage("Passwords do not match");
    }

    setMessage("");
    setLoading(true);
    await updatepassword(password, confirmpassword);
    setMessage("Update successful");
    setLoading(false);
  };

  useEffect(() => {
    if (state.error) {
      setMessage("Failed to update password");
    }
  }, [state]);

  return (
    <>
      {message && <p>{message}</p>}
      <form className="user-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>New Password:</label>
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
          Update Password
        </button>
      </form>
    </>
  );
};

export default PasswordForm;

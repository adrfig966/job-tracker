import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAppsContext } from "../contexts/AppsContext";

const EditForm = ({
  appref,
  initialcompany = "",
  initialposition = "",
  initialurl = "",
  initialstatus = "Applied",
  initialnotes = "",
  currentlyediting = "status",
}) => {
  const { state: authstate } = useAuth();
  const { updateApp } = useAppsContext();
  const [company, setCompany] = useState(initialcompany);
  const [position, setPosition] = useState(initialposition);
  const [url, setUrl] = useState(initialurl);
  const [status, setStatus] = useState(initialstatus);
  const [notes, setNotes] = useState(initialnotes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    try {
      if (authstate.userclient && appref) {
        setError("");
        setLoading(true);

        await updateApp(authstate.userclient, appref, {
          position,
          status,
          notes,
        });
      }
    } catch {
      setError("Failed to update job application");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleUpdate();
  };

  return (
    <>
      {error && <p>{error}</p>}
      <form className="edit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Position:
          </label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>
            URL:
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>
            Status:
          </label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="form-group">
          <label>
            Notes:
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="form-footer">
          <button className="btn" type="submit" disabled={loading}>
            Update
          </button>
        </div>
      </form>
    </>
  );
};

export default EditForm;

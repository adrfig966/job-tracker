import { query as q } from "faunadb";
import { useState, useEffect } from "react";
import { Modal } from "@mantine/core";
import { useAuth } from "../contexts/AuthContext";
import { useAppsContext } from "../contexts/AppsContext";

const JobForm = ({
  updating = false,
  appref,
  initialcompany = "",
  initialposition = "",
  initialurl = "",
  initialstatus = "Applied",
  initialnotes = "",
}) => {
  const { state: authstate } = useAuth();
  const { apps, addApp, updateApp } = useAppsContext();
  const [company, setCompany] = useState(initialcompany);
  const [position, setPosition] = useState(initialposition);
  const [status, setStatus] = useState(initialstatus);
  const [notes, setNotes] = useState(initialnotes);
  const [loading, setLoading] = useState(false);
  const [isopen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    try {
      if (authstate.userclient) {
        setError("");
        setLoading(true);

        await addApp(authstate.userclient, [company, position, status, notes]);
      }
    } catch {
      setError("Failed to create job application");
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    try {
      if (authstate.userclient) {
        setError("");
        setLoading(true);

        await updateApp(authstate.userclient, appref, {
          company,
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
    if (updating) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  return (
    <>
      {error && <p>{error}</p>}
      <button
        className="btn"
        type="submit"
        disabled={loading || !authstate.userclient}
        onClick={() => setIsOpen(true)}
      >
        {authstate.userclient ? "Add New Job" : "Log in to add a job"}
      </button>
      <Modal
        title={<h6>Add new job</h6>}
        opened={isopen}
        onClose={() => setIsOpen(false)}
      >
        <form className="application-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company:</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Position:</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="form-group">
            <label>Notes:</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="form-footer">
            <button className="btn" type="submit" disabled={loading}>
              Add
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default JobForm;

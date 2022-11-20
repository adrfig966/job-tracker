import { query as q } from "faunadb";
import { useState, useEffect } from "react";

import { useAuth } from "../contexts/AuthContext";
import { useAppsContext } from "../contexts/AppsContext";

const JobForm = () => {
  const { state: authstate } = useAuth();
  const { apps, addApp } = useAppsContext();
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(authstate.userclient) {
        setError("");
        setLoading(true);

        await addApp(authstate.userclient, [
          company,
          position,
          '2022-11-13',
          status,
          notes,
        ]);
      }
    } catch {
      setError("Failed to create job application");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Create Job Application</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Company:
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
        <label>
          Position:
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </label>
        <label>
          URL:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
        <label>
          Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </label>
        <label>
          Notes:
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        <button type="submit" disabled={loading}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default JobForm;

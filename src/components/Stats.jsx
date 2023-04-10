import { useState, useEffect } from "react";

import { useAuth } from "../contexts/AuthContext";
import { useAppsContext } from "../contexts/AppsContext";

//Displays stats for regarding status of applications
const ApplicationStats = () => {
  const [loading, setLoading] = useState(true);
  const { state: authstate } = useAuth();
  const { state: appstate } = useAppsContext();

  useEffect(() => {
    if (appstate.apps) {
      setLoading(false);
    }
  }, [appstate]);

  const render = () => {
    if (!authstate.userclient) {
      return;
    } else if (loading) {
      return <div>Loading...</div>;
    } else if (appstate.apps.length === 0) {
      return <p>No stats found</p>;
    } else {
      return (
        <div className="stats-container">
          <div className="stats-item">
            <p className="stats-item-title">Total Applications</p>
            <p className="stats-item-value">{appstate.apps.length}</p>
          </div>
          <div className="stats-item">
            <p className="stats-item-title">Ongoing Interviews</p>
            <p className="stats-item-value">
              {
                appstate.apps.filter(
                  (app) => app.data.status === "Interviewing"
                ).length
              }
            </p>
          </div>
          <div className="stats-item">
            <p className="stats-item-title">Applications Rejected</p>
            <p className="stats-item-value">
              {
                appstate.apps.filter((app) => app.data.status === "Rejected")
                  .length
              }
            </p>
          </div>
          <div className="stats-item">
            <p className="stats-item-title">Jobs Offered</p>
            <p className="stats-item-value">
              {
                appstate.apps.filter((app) => app.data.status === "Offer")
                  .length
              }
            </p>
          </div>
        </div>
      );
    }
  };
  return <div className="applications-stats">{render()}</div>;
};

export default ApplicationStats;

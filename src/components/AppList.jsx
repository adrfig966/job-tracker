import { query as q } from "faunadb";
import { useState, useEffect } from "react";

import { useAuth } from "../contexts/AuthContext";
import { useAppsContext } from "../contexts/AppsContext";
import PencilIcon from "jsx:../svg/pencil-solid.svg";
import XIcon from "jsx:../svg/x-solid.svg";
import EditForm from "./EditForm";
import DeleteButton from "./DeleteButton";

const ApplicationList = () => {
  const [loading, setLoading] = useState(true);
  const [isupdating, setIsUpdating] = useState("");
  const { state: authstate } = useAuth();
  const { state: appstate, getApps, deleteApp } = useAppsContext();

  useEffect(() => {
    const getApplications = async () => {
      if (authstate.userclient) {
        await getApps(authstate.userclient);
        setLoading(false);
      }
    };
    getApplications();
  }, [authstate]);

  useEffect(() => {
    console.log("Applcs updated:", appstate.apps);
  }, [appstate]);

  const handleDelete = async (ref) => {
    if (authstate.userclient) {
      await deleteApp(authstate.userclient, ref);
    }
  };

  const render = () => {
    if (!authstate.userclient) {
      return <p>Log in to view your applications</p>;
    } else if (loading) {
      return <div>Loading...</div>;
    } else if (appstate.apps.length === 0) {
      return <p>No applications found</p>;
    } else {
      let applist = appstate.apps.map((app) => (
        <div className="application-list-item" key={app.ref.value.id}>
          <div className="application-list-item-row">
            <div className="application-summary">
              <p className="position-details">
                {app.data.company} | {app.data.position}
              </p>
              <p className="application-status">{app.data.status}</p>
            </div>
            <div className="list-btn-group">
              <DeleteButton ondelete={() => handleDelete(app.ref)} />
              {app.ref.value.id == isupdating ? (
                <button className="" onClick={() => setIsUpdating("")}>
                  <XIcon />
                </button>
              ) : (
                <button
                  className=""
                  onClick={() => setIsUpdating(app.ref.value.id)}
                >
                  <PencilIcon />
                </button>
              )}
            </div>
          </div>
          {app.ref.value.id == isupdating && (
            <div className="application-list-item-details">
              <EditForm
                appref={app.ref}
                onsubmit={() => setIsUpdating("")}
                initialposition={app.data.position}
                initialstatus={app.data.status}
                initialnotes={app.data.notes}
              />
            </div>
          )}
        </div>
      ));

      return <div className="list-container">{applist}</div>;
    }
  };
  return (
    <div className="application-list">
      <h1>Applications</h1>
      {render()}
    </div>
  );
};

export default ApplicationList;

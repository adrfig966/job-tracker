import { query as q } from "faunadb";
import { useState, useEffect } from "react";

import getClient from "../singletons/adminconnection";
import { useAuth } from "../contexts/AuthContext";
import { useAppsContext } from "../contexts/AppsContext";

const ApplicationList = () => {
  const adminClient = getClient();
  //const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state: authstate } = useAuth();
  const { apps, getApps, error } = useAppsContext();

  useEffect(() => {
    const getApplications = async () => {
      if(authstate.userclient) {
        await getApps(authstate.userclient);
        setLoading(false);
      }
    };
    getApplications();
  }, [authstate]);

  useEffect(() => {
    console.log('apps:',  apps);
  }, [apps]);

  return (
    <div>
      <h1>Applications</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        apps.map((application) => <p>{application.data.company}</p>)
      )}
    </div>
  );
};

export default ApplicationList;

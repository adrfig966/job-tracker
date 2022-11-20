import ApplicationList from "./components/AppList";
import LoginForm from "./components/LoginForm";
import JobForm from "./components/JobForm";
import AuthProvider from "./contexts/AuthContext";
import { AppsProvider } from "./contexts/AppsContext";

require('dotenv').config()


export default function App() {
  return (
    <AuthProvider>
      <AppsProvider>
        <div>
          <JobForm />
          <ApplicationList />
          <LoginForm />
        </div>
      </AppsProvider>
    </AuthProvider>
  );
}
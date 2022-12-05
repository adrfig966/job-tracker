import ApplicationList from "../components/AppList";
import LoginForm from "../components/LoginForm";
import JobForm from "../components/JobForm";
import Header from "../components/Header";

export default function Layout() {
  return (
    <>
      <Header />
      <div className="summary-dashboard">
        <ApplicationList />
        <JobForm />
      </div>
    </>
  );
}

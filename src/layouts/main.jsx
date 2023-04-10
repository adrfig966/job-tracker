import ApplicationList from "../components/AppList";
import ApplicationStats from "../components/Stats";
import JobForm from "../components/JobForm";
import Header from "../components/Header";

export default function Layout() {
  return (
    <>
      <Header />
      <div className="summary-dashboard">
        <ApplicationList />
        <ApplicationStats />
        <JobForm />
      </div>
    </>
  );
}

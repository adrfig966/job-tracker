import { useState, useEffect } from "react";

import { useAuth } from "../contexts/AuthContext";
import { Modal } from "@mantine/core";
import LoginForm from "../components/LoginForm";
import RegForm from "./RegistrationForm";

const Header = () => {
  const { state: authstate, logout } = useAuth();
  const [islogged, setIsLogged] = useState(false);
  const [isloginopen, setIsLoginOpen] = useState(false);
  const [isregopen, setIsRegOpen] = useState(false);

  useEffect(() => {
    if (authstate.userclient) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, [authstate]);

  return (
    <header className="header">
      <div className="header__logo">
        <h1>Job Tracker</h1>
      </div>
      <div className="header__nav">
        <div className="header-btn-group">
          {islogged ? (
            <button className="btn btn-primary" onClick={() => logout()}>
              Log Out
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setIsLoginOpen(true)}
            >
              Log In
            </button>
          )}
          {!islogged && (
            <button
              className="btn btn-primary ml-2"
              onClick={() => setIsRegOpen(true)}
            >
              Register
            </button>
          )}
        </div>
      </div>
      <Modal
        title={<h6>Login</h6>}
        opened={isloginopen}
        onClose={() => setIsLoginOpen(false)}
      >
        <LoginForm onlogin={() => setIsLoginOpen(false)} />
      </Modal>
      <Modal
        title={<h6>Register</h6>}
        opened={isregopen}
        onClose={() => setIsRegOpen(false)}
      >
        <RegForm onreg={() => setIsRegOpen(false)} />
      </Modal>
    </header>
  );
};

export default Header;

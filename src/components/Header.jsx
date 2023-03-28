import { useState, useEffect } from "react";

import { useAuth } from "../contexts/AuthContext";
import { Modal } from "@mantine/core";
import UserIcon from "jsx:../svg/user-solid.svg";
import UserPlusIcon from "jsx:../svg/user-plus-solid.svg";
import DoorIcon from "jsx:../svg/door-open-solid.svg";
import LoginForm from "../components/LoginForm";
import RegForm from "./RegistrationForm";
import PasswordForm from "./PasswordForm";

const Header = () => {
  const { state: authstate, logout } = useAuth();
  const [islogged, setIsLogged] = useState(false);
  const [isloginopen, setIsLoginOpen] = useState(false);
  const [isregopen, setIsRegOpen] = useState(false);
  const [isprofileopen, setIsProfileOpen] = useState(false);

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
        <h1>Application Tracker</h1>
      </div>
      <div className="header__nav">
        <div className="header-btn-group">
          {islogged && (
            <button
              className="btn btn-primary ml-2"
              onClick={() => setIsProfileOpen(true)}
            >
              Profile
              <UserIcon />
            </button>
          )}
          {islogged ? (
            <button className="btn btn-primary ml-2" onClick={() => logout()}>
              Log Out
              <DoorIcon />
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setIsLoginOpen(true)}
            >
              Log In
              <UserIcon />
            </button>
          )}
          {!islogged && (
            <button
              className="btn btn-primary ml-2"
              onClick={() => setIsRegOpen(true)}
            >
              Register
              <UserPlusIcon />
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
      <Modal
        title={<h6>Profile</h6>}
        opened={isprofileopen}
        onClose={() => setIsProfileOpen(false)}
      >
        <PasswordForm onupdate={() => setIsProfileOpen(false)} />
      </Modal>
    </header>
  );
};

export default Header;

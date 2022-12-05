import { useState, useEffect } from "react";

import { useAuth } from "../contexts/AuthContext";
import { Modal } from "@mantine/core";
import LoginForm from "../components/LoginForm";

const Header = () => {
    const { state: authstate, logout } = useAuth();
    const [islogged, setIsLogged] = useState(false);
    const [isopen, setIsOpen] = useState(false);

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
                        <button
                            className="btn btn-primary"
                            onClick={() => logout()}
                        >
                            Log Out
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsOpen(true)}
                        >
                            Log In
                        </button>
                    )}
                </div>
            </div>
            <Modal title={<h6>Login</h6>} opened={isopen} onClose={() => setIsOpen(false)}>
                <LoginForm onlogin={() => setIsOpen(false)}/>
            </Modal>
        </header>
    );
}

export default Header;
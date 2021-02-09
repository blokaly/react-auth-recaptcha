import React from "react";
import {Button, Card, Logo} from "../components/AuthForm";
import { useAuth } from "../context/auth";
import logoImg from "../logo.svg";

function Admin(props) {
    const { setAuthTokens } = useAuth();

    function logOut() {
        setAuthTokens({token:null});
    }

    return (
        <Card>
            <div>Admin Page</div>
            <Logo src={logoImg} />
            <Button onClick={logOut}>Log out</Button>
        </Card>
    );
}

export default Admin;

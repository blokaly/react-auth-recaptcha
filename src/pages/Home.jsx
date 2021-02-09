import React from "react";
import {Card, Logo} from "../components/AuthForm";
import logoImg from "../logo.svg";

function Home(props) {
    return (
        <Card>
            <div>Home Page</div>
            <Logo src={logoImg} />
        </Card>
    );
}

export default Home;

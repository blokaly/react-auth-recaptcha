import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import logoImg from "../logo.svg";
import { Card, Logo, Form, Input, Button, Error } from "../components/AuthForm";
import { useAuth } from "../context/auth";

const SITE_KEY=process.env.REACT_APP_SITE_KEY;
const SERVER_PORT=process.env.REACT_APP_SEVER_PORT;

function Login(props) {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const { setAuthTokens } = useAuth();

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    const handleOnClick = e => {
        e.preventDefault();
        setLoading(true);
        window.grecaptcha.ready(() => {
            window.grecaptcha.execute(SITE_KEY, { action: 'login' }).then(token => {
                submitData(token);
            });
        });
    }

    useEffect(() => {
        const loadScriptByURL = (id, url, callback) => {
            const isScriptExist = document.getElementById(id);

            if (!isScriptExist) {
                let script = document.createElement("script");
                script.type = "text/javascript";
                script.src = url;
                script.id = id;
                script.onload = function () {
                    if (callback) callback();
                };
                document.body.appendChild(script);
            }

            if (isScriptExist && callback) callback();
        }

        // load the script by passing the URL
        loadScriptByURL("recaptcha-key", `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`, function () {
            console.log("Script loaded!");
        });
    }, []);


    const submitData = token => {
        console.log("recaptcha token:", token);

        // call a backend API to verify reCAPTCHA response
        fetch(`http://localhost:${SERVER_PORT}/verify`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": userName,
                "password": password,
                "g-recaptcha-response": token
            })
        }).then(res => res.json()).then(res => {
            console.log("recaptcha verification:", res);
            alert("reCaptcha Verification: " + JSON.stringify(res));
            setLoading(false);
            setAuthTokens({token:token});
            setResponse(res);
            setLoggedIn(true);
        });
    }

    const referer = props.location.state? props.location.state.referer : '/';

    if (isLoggedIn) {
        return <Redirect to={referer} />;
    }

    return (
        <Card>
            <Logo src={logoImg} />
            <Form>
                <Input
                    type="username"
                    value={userName}
                    onChange={e => {
                        setUserName(e.target.value);
                    }}
                    placeholder="email"
                />
                <Input
                    type="password"
                    value={password}
                    onChange={e => {
                        setPassword(e.target.value);
                    }}
                    placeholder="password"
                />
                <Button onClick={handleOnClick} disabled={loading}>{loading ? 'Submitting...' : 'Sign In'}</Button>
            </Form>
            <Link to="/signup">Don't have an account?</Link>
            { isError &&<Error>The username or password provided were incorrect!</Error> }
        </Card>
    );
}

export default Login;

import {Box, Button, Tab, Tabs, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {saveToken} from "../helper/tokenFunctions";
import {NavigateFunction, useNavigate, useSearchParams} from "react-router-dom";
import validateEmail from "../helper/validateEmail";
import ErrorText from "../components/ErrorText";
import parseError from "../helper/parseError";
import APP_CONSTANTS from "../helper/ApplicationConstants";
import handleEnterKey from "../helper/handleEnterKey";
import getTextFieldValue from "../helper/getTextFieldValue";

function SignUp(props: {
    handleEnterKey: any
}) {
    const handleEnterKey = props.handleEnterKey
    return (
        <div className="login-signup-div">
            <TextField variant="outlined" label="Email" id="email" />
            <TextField variant="outlined" label="Username" id="username"  />
            <TextField variant="outlined" type="password" label="Password" id="password" />
            <TextField variant="outlined" type="password" label="Confirm Password"
                       id="password_confirm" onKeyDown={handleEnterKey}
            />
        </div>
    );
}

function Login(props: {
    handleEnterKey: any
}) {
    const handleEnterKey = props.handleEnterKey
    return (
      <div className="login-signup-div">
          <TextField variant="outlined" label="Email or Username" id="identifier" />
          <TextField variant="outlined" type="password" label="Password"
                     id="password" onKeyDown={handleEnterKey} />
      </div>
    );
}

function TabPanel(props: {
    index: number,
    value: number,
    children?: React.ReactNode,
}) {
    const { value, index, children } = props
    return (
        <div
            hidden={value !== index}
            id={`tab-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            {value === index && (children)}
        </div>
    )
}

function allyProps(index: number) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tab-${index}`,
    }
}

function loginOnClick(navigate: NavigateFunction, setError: Function) {
    return async () => {
        const identifier = getTextFieldValue("identifier")
        const password = getTextFieldValue("password")
        const identifier_type = validateEmail(identifier) ? "email" : "username"
        const res = await
            fetch(APP_CONSTANTS.BACKEND_URL + `/auth/sign_in`,
                    {method: "POST", headers: {"content-type": "application/json"},
                        body: `{"${identifier_type}": "${identifier}", "password": "${password}"}`})
        if (res.status !== 200) {
            const errorJson = await res.json()
            setError(parseError(errorJson.message))
            return
        }

        setError("Success")
        saveToken(res)
        navigate("/", {replace: true})
    }
}

function signupOnClick(navigate: NavigateFunction, setError: Function) {
    return async () => {
        const email = getTextFieldValue("email")
        const username = getTextFieldValue("username")
        const password = getTextFieldValue("password")
        const confirm = getTextFieldValue("password_confirm")

        const res = await
            fetch(APP_CONSTANTS.BACKEND_URL + `/auth/?email=${email}&username=${username}&password=${password}&password_confirmation=${confirm}`,
            {method: "POST"})
        if (res.status !== 200) {
            const errorJson = await res.json()
            setError(parseError(errorJson.message.full_messages))
            return
        }

        setError("Success")
        saveToken(res)
        navigate("/", {replace: true})
    }
}

export default function AuthRoute() {
    const [searchParams] = useSearchParams();
    const [value, setValue] = useState(0);
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const buttonStyle = { width: "100%", fontSize: "100%" }

    useEffect(() => {
        if (searchParams.get("form") === "1")
            setValue(1)
    }, []);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
        setError("")
    };

    return (
        <div id="auth-section-container">
            <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                <Tabs value={value} onChange={handleChange} variant="fullWidth" >
                    <Tab label="Login" {...allyProps(0)} />
                    <Tab label="Sign Up" {...allyProps(1)} />
                </Tabs>
            </Box>
            <TabPanel index={0} value={value}>
                <Login handleEnterKey={handleEnterKey(loginOnClick(navigate, setError))} />
                <ErrorText error={error} marginTop={2} marginBottom={2} />
                <Button
                    onClick={loginOnClick(navigate, setError)}
                    variant="contained"
                    disableElevation
                    sx={buttonStyle}
                >Login</Button>
            </TabPanel>
            <TabPanel index={1} value={value}>
                <SignUp handleEnterKey={handleEnterKey(signupOnClick(navigate, setError))} />
                <ErrorText error={error} marginTop={2} marginBottom={2} />
                <Button onClick={signupOnClick(navigate, setError)}
                        variant="contained"
                        disableElevation
                        sx={buttonStyle}
                >Sign Up</Button>
            </TabPanel>
        </div>
    );
}
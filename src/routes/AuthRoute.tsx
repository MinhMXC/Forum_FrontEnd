import {Box, Button, Tab, Tabs, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {saveToken} from "../helper/tokenFunctions";
import {NavigateFunction, useNavigate, useSearchParams} from "react-router-dom";
import validateEmail from "../helper/validateEmail";
import ErrorText from "../components/ErrorText";
import parseError from "../helper/parseError";
import APP_CONSTANTS from "../helper/ApplicationConstants";
import handleEnterKey from "../helper/handleEnterKey";

function SignUp(prop: any) {
    const handleEnterKey = prop.handleEnterKey

    return (
        <div className="login-signup-div">
            <TextField variant="outlined" label="Email" id="email" />
            <TextField variant="outlined" label="Username" id="username"  />
            <TextField variant="outlined" type="password" label="Password" id="password" />
            <TextField variant="outlined" type="password" label="Confirm Password" id="password_confirm" onKeyDown={handleEnterKey} />
        </div>
    );
}

function Login(prop: any) {
    const handleEnterKey = prop.handleEnterKey

    return (
      <div className="login-signup-div">
          <TextField variant="outlined" label="Email or Username" id="identifier" />
          <TextField variant="outlined" type="password" label="Password" id="password" onKeyDown={handleEnterKey} />
      </div>
    );
}

interface TabPanelProps {
    children?: React.ReactNode,
    index: number,
    value: number,
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index } = props
    return (
        <div
            hidden={value !== index}
            id={`tab-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            { value === index && (
                children
            )}
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
        const identifier = (document.getElementById("identifier")! as HTMLInputElement).value
        const password = (document.getElementById("password")! as HTMLInputElement).value
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
        const email = (document.getElementById("email")! as HTMLInputElement).value
        const username = (document.getElementById("username")! as HTMLInputElement).value
        const password = (document.getElementById("password")! as HTMLInputElement).value
        const confirm = (document.getElementById("password_confirm")! as HTMLInputElement).value

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

export default function AuthRoute(prop: any) {
    const [searchParams] = useSearchParams();
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate()

    useEffect(() => {
        if (searchParams.get("form") === "1")
            setValue(1)
    }, []);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
        setError("")
    };
    const buttonStyle = { width: "100%", fontSize: "100%" }
    let [error, setError] = useState("")

    return (
        <div className="section-container" style={{width: prop.width / 2}}>
            <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                <Tabs value={value} onChange={handleChange} variant="fullWidth" >
                    <Tab label="Login" {...allyProps(0)} />
                    <Tab label="Sign Up" {...allyProps(1)} />
                </Tabs>
            </Box>
            <TabPanel index={0} value={value}>
                <Login handleEnterKey={handleEnterKey(loginOnClick(navigate, setError))} />
                <ErrorText error={error} marginTop={2} marginBottom={2} />
                <Button onClick={loginOnClick(navigate, setError)} variant="contained" disableElevation
                        sx={buttonStyle}>Login</Button>
            </TabPanel>
            <TabPanel index={1} value={value}>
                <SignUp handleEnterKey={handleEnterKey(signupOnClick(navigate, setError))} />
                <ErrorText error={error} marginTop={2} marginBottom={2} />
                <Button onClick={signupOnClick(navigate, setError)} variant="contained" disableElevation
                        sx={buttonStyle}>Sign Up</Button>
            </TabPanel>
        </div>
    );
}
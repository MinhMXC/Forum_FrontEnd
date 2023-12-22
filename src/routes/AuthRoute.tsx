import {Box, Button, Tab, Tabs, TextField} from "@mui/material";
import React from "react";

function SignUp() {
    return (
        <div className="login-signup-div">
            <TextField variant="outlined" label="Email" />
            <TextField variant="outlined" label="Username" />
            <TextField variant="outlined" label="Password" />
            <TextField variant="outlined" label="Confirm Password" />
        </div>
    );
}

function Login() {
    return (
      <div className="login-signup-div">
          <TextField variant="outlined" label="Email or Username" />
          <TextField variant="outlined" label="Password" />
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

export default function AuthRoute(prop: any) {
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const buttonStyle = { mt: 2, width: "100%", fontSize: "100%" }

    return (
        <div className="main-col-container" style={{width: prop.width / 2}}>
            <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                <Tabs value={value} onChange={handleChange} variant="fullWidth" >
                    <Tab label="Login" {...allyProps(0)} />
                    <Tab label="Sign Up" {...allyProps(1)} />
                </Tabs>
            </Box>
            <TabPanel index={0} value={value}>
                <Login/>
                <Button variant="contained" disableElevation={true} sx={buttonStyle}>Login</Button>
            </TabPanel>
            <TabPanel index={1} value={value}>
                <SignUp/>
                <Button variant="contained" disableElevation={true} sx={buttonStyle}>Sign Up</Button>
            </TabPanel>
        </div>
    );
}
import React from "react"
import ReactDOM from "react-dom/client";
import "./App.css"
import "./index.css"
import App from "./App";
import {createTheme, ThemeProvider} from "@mui/material";

const appWideTheme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 876,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
})

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider theme={appWideTheme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>
)
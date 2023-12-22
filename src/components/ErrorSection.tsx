import React from "react";
import {useRouteError} from "react-router-dom";

export default function ErrorSection() {
    const error: any = useRouteError()
    console.log(error)

    return (
        <div className="error-div">
            <h1 style={{ marginBottom: 0 }}>Oops!</h1>
            <h2>{error.status}   {error.data}</h2>
        </div>
    );
}
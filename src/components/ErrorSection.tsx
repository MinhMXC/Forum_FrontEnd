import React from "react";
import {useRouteError} from "react-router-dom";

export default function ErrorSection(props: {
    errorParams?: string
}) {
    const error: any = useRouteError()
    return (
        <div className="error-div">
            <h1 style={{ marginBottom: 0 }}>Oops!</h1>
            <h2>
                {
                    error === undefined
                    ? props.errorParams
                    : error.status + " " + error.data
                }
            </h2>
        </div>
    );
}
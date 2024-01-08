import React from "react";

export default function ErrorText(props: {
    error: string
    marginTop?: number,
    marginBottom?: number
}) {
    const error = props.error
    const marginTop = props.marginTop === undefined ? 1 : props.marginTop
    const marginBottom = props.marginBottom === undefined ? 1 : props.marginBottom
    return (
        <p
            style={{
                whiteSpace: "pre-line",
                marginTop: `${marginTop}%`,
                marginBottom: `${marginBottom}%`,
                color: error === "Success" ? "green" : "red"
            }}
        >{error}</p>
    );
}
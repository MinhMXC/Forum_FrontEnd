import React from "react";

export default function ErrorText(prop: any) {
    const error = prop.error
    const marginTop = prop.marginTop === undefined ? 1 : prop.marginTop
    const marginBottom = prop.marginBottom === undefined ? 1 : prop.marginBottom
    return (
        <p style={{
            whiteSpace: "pre-line",
            marginTop: `${marginTop}%`,
            marginBottom: `${marginBottom}%`,
            color: error === "Success" ? "green" : "red"
        }}>{error}</p>
    );
}
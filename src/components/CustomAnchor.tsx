import {ReactNode} from "react";
import APP_CONSTANTS from "../helper/ApplicationConstants";

export default function CustomAnchor(props: {
    hasLink: boolean,
    URL: string,
    children?: ReactNode
}) {

    return (
        props.hasLink
        ? (<a
                href={APP_CONSTANTS.FRONTEND_URL + props.URL}
                className="no-decor-anchor"
                style={{ color: "inherit" }}
            >
                {props.children}
            </a>)
        : <>{props.children}</>
    )
}
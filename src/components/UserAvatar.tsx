import parseString from "../helper/parseString";
import {Avatar} from "@mui/material";
import default_avatar from "../resources/default_avatar.jpg";
import SimpleUser from "../interfaces/SimpleUser";
import React from "react";

export default function UserAvatar(props: {
    user: SimpleUser,
    size: number,
    src?: string,
}) {
    const user = props.user as SimpleUser
    return (
        <Avatar
            alt={user.id === -1 ? "" : user.username}
            src={props.src !== undefined ? props.src : parseString(user.image)}
            sx={{ height: props.size, width: props.size }}
        >
            {
                user.id === -1
                ? undefined
                : <Avatar alt="default" src={default_avatar} sx={{height: "100%", width: "100%"}}/>
            }
        </Avatar>
    )
}
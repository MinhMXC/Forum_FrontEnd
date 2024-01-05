import User from "../interfaces/User";
import {Accordion, AccordionDetails, AccordionSummary, Avatar, Grid} from "@mui/material";
import default_avatar from "../resources/default_avatar.jpg";
import parseString from "../helper/parseString";
import convertEpochToTimeAgo from "../helper/convertEpochToTimeAgo";
import PostSection from "./PostSection";
import CommentE from "./Comment";
import APP_CONSTANTS from "../helper/ApplicationConstants";

function ImageUsernameAge(user: User) {
    const avatarSize = APP_CONSTANTS.AVATAR_BIG

    return (
        <Grid container spacing={2} sx={{ alignItems: "center", width: "100%", height: "100%" }}>
            <Grid item xs="auto">
                <Avatar alt={user.username} src={parseString(user.image)} sx={{ height: avatarSize, width: avatarSize }}>
                    <Avatar alt="default" src={default_avatar} sx={{ height: "100%", width: "100%" }} />
                </Avatar>
            </Grid>
            <Grid item xs="auto">
                <p id="user-section-username">{user.username}</p>
            </Grid>
            <Grid item xs>
                <p id="user-section-account-age">Account Age: {convertEpochToTimeAgo(user.created_at)}</p>
            </Grid>
        </Grid>
    );
}

function Bio(user: User) {
    return (
        <div>
            <p className="section-title-text">Bio</p>
            <p>{parseString(user.bio)}</p>
        </div>
    );
}


const accordionSX = {
    borderRadius: "5px",
    width: {xs: "100%", sm: "860px"}
}

export default function UserSection(user: User) {
    return (
        <>
            <div className="section-container">
                <ImageUsernameAge {...user} />
            </div>
            <div className="section-container">
                <Bio {...user} />
            </div>
            <div className="section-container" style={{ padding: 0 }}>
            <Accordion elevation={0} defaultExpanded disableGutters
                       sx={accordionSX}>
                <AccordionSummary>
                    <p className="section-title-text">Posts</p>
                </AccordionSummary>
                <AccordionDetails>
                    {user.posts.map(post => <div><PostSection post={post} /></div>)}
                </AccordionDetails>
            </Accordion>
            </div>
            <div className="section-container" style={{ padding: 0 }}>
            <Accordion elevation={0} defaultExpanded disableGutters
                       sx={accordionSX}>
                <AccordionSummary>
                    <p className="section-title-text">Comments</p>
                </AccordionSummary>
                <AccordionDetails>
                    {user.comments.map(comment => <div><CommentE comment={comment} /></div>)}
                    </AccordionDetails>
            </Accordion>
            </div>
        </>
    );
}
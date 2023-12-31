import User from "../interfaces/User";
import {Accordion, AccordionDetails, AccordionSummary, Avatar, Grid} from "@mui/material";
import default_avatar from "../resources/default_avatar.jpg";
import parseString from "../helper/parseString";
import convertEpochToTimeAgo from "../helper/convertEpochToTimeAgo";
import PostSection from "./PostSection";
import CommentE from "./Comment";

function ImageUsernameAge(user: User) {
    return (
        <Grid container spacing={2} sx={{ alignItems: "center", width: "100%", height: "100%" }}>
            <Grid item xs="auto">
                <Avatar alt={user.username} src={parseString(user.image)} sx={{ height: 55, width: 55 }}>
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
            <p id="bio-body-text">{parseString(user.bio)}</p>
        </div>
    );
}

export default function UserSection(user: User) {
    return (
        <div>
            <div className="section-container">
                <ImageUsernameAge {...user} />
            </div>
            <div className="section-container" style={{ paddingLeft: "16px" }}>
                <Bio {...user} />
            </div>
            <Accordion defaultExpanded={true} disableGutters={true} sx={{ mt: "15px", borderRadius: "5px" }}>
                <AccordionSummary>
                    <p className="section-title-text">Posts</p>
                </AccordionSummary>
                <AccordionDetails>
                    {user.posts.map(post => <div style={{ marginBottom: "4%" }}><PostSection post={post} /></div>)}
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded={true} disableGutters={true} sx={{ mt: "15px", borderRadius: "5px" }}>
                <AccordionSummary>
                    <p className="section-title-text">Comments</p>
                </AccordionSummary>
                <AccordionDetails>
                    {user.comments.map(comment => <div style={{ marginBottom: "2%" }}><CommentE comment={comment} /></div>)}
                    </AccordionDetails>
            </Accordion>
        </div>
    );
}
import {useLoaderData, useNavigate} from "react-router-dom";

import {Accordion, AccordionDetails, AccordionSummary, Grid} from "@mui/material";
import parseString from "../helper/parseString";
import timeAgoTextGenerator from "../helper/timeAgoTextGenerator";
import APP_CONSTANTS from "../helper/ApplicationConstants";
import UserAvatar from "../components/UserAvatar";
import PostSection from "../components/PostSection";
import CommentE from "../components/Comment";
import User from "../interfaces/User";
import Post from "../interfaces/Post";
import Comment from "../interfaces/Comment"
import {ReactNode} from "react";

function ImageUsernameAge(props: {
    user: User
}) {
    const user = props.user
    return (
        <div className="section-container">
            <Grid
                container
                spacing={2}
                sx={{ alignItems: "center", width: "100%", height: "100%" }}
            >
                <Grid item xs="auto">
                    <UserAvatar user={user} size={APP_CONSTANTS.AVATAR_BIG} />
                </Grid>

                <Grid item xs={9} sm={"auto"}>
                    <p id="user-section-username">{user.username}</p>
                </Grid>

                <Grid item xs>
                    <p id="user-section-account-age">
                        Account Age: {timeAgoTextGenerator(user.created_at, user.created_at)}
                    </p>
                </Grid>
            </Grid>
        </div>
    );
}

function Bio(props: {
    user: User
}) {
    const user = props.user
    return (
        <div className="section-container">
            <p className="section-title-text">Bio</p>
            <p>{parseString(user.bio)}</p>
        </div>
    );
}

function UserSectionAccordion(props: {
    title: string,
    children: ReactNode
}) {
    const accordionSX = {
        borderRadius: "5px",
        width: {xs: "100%", md: "900px"}
    }

    return (
        <div className="section-container" style={{padding: 0}}>
            <Accordion elevation={0} defaultExpanded disableGutters sx={accordionSX}>
                <AccordionSummary>
                    <p className="section-title-text">{props.title}</p>
                </AccordionSummary>
                <AccordionDetails sx={{mb: "-20px"}}>
                    {props.children}
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default function UserRoute() {
    const user = (useLoaderData() as any).data as User
    const navigate = useNavigate()
    const comments = user.comments as Comment[]
    const posts = user.posts as Post[]

    return (
        <>
            <ImageUsernameAge user={user}/>
            <Bio user={user}/>
            <UserSectionAccordion title="Posts" children={
                posts.map(post =>
                    <div className="user-section-item-container">
                        <PostSection post={post} navigate={navigate} link={true}/>
                    </div>
                )
            } />
            <UserSectionAccordion title="Comments" children={
                comments.map(comment =>
                    <div className="user-section-item-container">
                        <a
                            className="no-decor-anchor"
                            href={APP_CONSTANTS.FRONTEND_URL + `/posts/${comment.post_id}`}
                        >
                            <CommentE comment={comment} />
                        </a>
                    </div>)
            } />
        </>
    );
}
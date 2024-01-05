import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Button, createTheme,
    Grid,
    IconButton, Menu, MenuItem, TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import {MoreHoriz, ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined} from "@mui/icons-material";
import convertEpochToTimeAgo from "../helper/convertEpochToTimeAgo";
import default_avatar from "../resources/default_avatar.jpg"
import "../App.css"
import Comment from "../interfaces/Comment"
import parseString from "../helper/parseString";
import React, {useEffect, useState} from "react";
import {NavigateFunction} from "react-router-dom";
import ErrorText from "./ErrorText";
import fetchWithHeader from "../helper/fetchWithHeader";
import parseError from "../helper/parseError";
import SimpleUser from "../interfaces/SimpleUser";
import APP_CONSTANTS from "../helper/ApplicationConstants";

const secondaryTextColour= "#8a8a8a"

const themeAccordion = createTheme({
    components: {
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    minHeight: 28,
                    paddingLeft: 7
                },
                content: {
                    margin: 0
                }
            }
        },
        MuiAccordionDetails: {
            styleOverrides: {
                root: {
                    paddingTop: 15,
                    paddingLeft: 2,
                    paddingBottom: 0
                }
            }
        }
    }
})

function UsernameDate(prop: any) {
    const comment = prop.comment as Comment
    const time = comment.updated_at === comment.created_at
                 ? convertEpochToTimeAgo(+comment.created_at)
                 : convertEpochToTimeAgo(+comment.created_at)
                    + " (edited: " + convertEpochToTimeAgo(+comment.updated_at) + ")"
    return (
        <Grid container spacing={1} alignItems="center" sx={{ pt: 0.5 }}>
            <Grid item xs="auto">
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{comment.user.username}</Typography>
            </Grid>
            {
                prop.post_user_id === comment.user.id
                    ?   <Grid item xs="auto">
                            <Typography color="secondary" sx={{ fontWeight: 600, ml: -0.5 }}>OP</Typography>
                        </Grid>
                    : undefined
            }
            <Grid item xs="auto">
                <Typography variant="body2" color={secondaryTextColour}>{time}</Typography>
            </Grid>
        </Grid>
    );
}

function OwnerOptions(prop: any) {
    const comment = prop.comment
    const navigate: NavigateFunction = prop.navigate

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl)
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    async function deleteComment() {
        await fetchWithHeader(`/comments/${comment.id}`, "DELETE")
        navigate(0)
    }

    function updateComment() {
        prop.setPatch(true)
        setAnchorEl(null)
    }

    return (
        <Grid item xs="auto">
            <IconButton onClick={handleClick} sx={{ padding: 0.5 }} color="inherit">
                <MoreHoriz />
            </IconButton>
            <Menu elevation={2} anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={updateComment}>Edit</MenuItem>
                <MenuItem onClick={deleteComment}>Delete</MenuItem>
            </Menu>
        </Grid>
    );
}

function CommentBottomControls(prop: any) {
    const comment = prop.comment as Comment
    const navigate = prop.navigate
    const onClick = prop.replyOnClick

    let [userState, setUserState] = useState<number>(comment.userState)
    let [like, setLike] = useState<boolean>(userState === 1)
    let [dislike, setDislike] = useState<boolean>(userState === -1)

    let [like_count, setLikeCount] = useState(comment.comments_likes_count)
    let [dislike_count, setDislikeCount] = useState(comment.comments_dislikes_count)

    useEffect(() => {
        if (userState === 1) {
            setLike(true)
            setDislike(false)
        } else if (userState === -1) {
            setDislike(true)
            setLike(false)
        } else if (userState === 0) {
            setLike(false)
            setDislike(false)
        }
    }, [userState]);

    function likeOnClick() {
        if (userState === -2)
            return

        // Undo the like
        if (userState === 1) {
            fetchWithHeader(`/comments/${comment.id}/like`, "POST")
            setLike(false)
            setUserState(0)
            setLikeCount(like_count - 1)
            return
        }

        fetchWithHeader(`/comments/${comment.id}/like`, "POST")
        if (userState === -1)
            setDislikeCount(dislike_count - 1)
        setLikeCount(like_count + 1)
        setUserState(1)
    }

    function dislikeOnClick() {
        if (userState === -2)
            return

        if (userState === -1) {
            fetchWithHeader(`/comments/${comment.id}/dislike`, "POST")
            setDislike(false)
            setUserState(0)
            setDislikeCount(dislike_count - 1)
            return
        }

        fetchWithHeader(


            `/comments/${comment.id}/dislike`, "POST")
        if (userState === 1)
            setLikeCount(like_count - 1)
        setDislikeCount(dislike_count + 1)
        setUserState(-1)
    }

    return (
        <Grid container alignItems="center" spacing={0.3} sx={{ mb: 1 }} color={secondaryTextColour} fontWeight="450">
            <Grid item xs="auto">
                <IconButton onClick={likeOnClick} sx={{ padding: 0.5, width: 30 }} color="inherit">
                    {like ? <ThumbUp color="primary" /> : <ThumbUpOutlined />}
                </IconButton>
            </Grid>
            <Grid item xs="auto">
                <Typography variant="body2" color="inherit" fontWeight="inherit">{like_count}</Typography>
            </Grid>
            <Grid item xs="auto">
                <div id="comment-like-dislike-separating-div">&nbsp;</div>
            </Grid>
            <Grid item xs="auto">
                <IconButton onClick={dislikeOnClick} sx={{ padding: 0.5, mt: 0.5, width: 30 }} color="inherit">
                    {dislike ? <ThumbDown color="primary" /> : <ThumbDownOutlined />}
                </IconButton>
            </Grid>
            <Grid item xs="auto">
                <Typography variant="body2" color="inherit" fontWeight="inherit">{dislike_count}</Typography>
            </Grid>
            <Grid item xs="auto">
                <Button onClick={onClick} sx={{ textTransform: "none", ml: 1 }}>
                    <Typography variant="body2">Reply</Typography>
                </Button>
            </Grid>
            {comment.owner ? <OwnerOptions comment={comment} navigate={navigate} setPatch={prop.setPatch} /> : undefined}
        </Grid>
    );
}

function AvatarColumn(prop: any) {
    const user = prop.user as SimpleUser
    const avatarSize = APP_CONSTANTS.AVATAR_SMALL
    return (
        <div className="avatar-column-div">
            <a href={"" +
                "" +
                "://localhost:3000/users/" + user.id}
               style={{textDecoration: "none", color: "inherit"}}>
                <Avatar alt={user.id === -1 ? "" : user.username} src={parseString(user.image)} sx={{height: avatarSize, width: avatarSize}}>
                    {user.id === -1 ? undefined : <Avatar alt="default" src={default_avatar} sx={{height: avatarSize, width: avatarSize}}/>}
                </Avatar>
            </a>
            <div className="comment-nest-div"/>
        </div>
    );
}

function ReplyForm(prop: any) {
    const user = prop.comment.user
    const onClick = prop.onClick
    return (
        <div style={{ marginBottom: "2%" }}>
            <TextField id={`reply_comment_${prop.comment.id}`} placeholder={`Replying to ${user.username}`} sx={{width: "100%"}} multiline={true}/>
            <ErrorText error={prop.error}/>
            <Button variant="contained" onClick={onClick} disableElevation sx={{ textTransform: "none" }}>Reply</Button>
        </div>
    );
}

function sendReplyComment(comment: Comment, navigate: NavigateFunction, setError: Function) {
    return async () => {
        const text = (document.getElementById(`reply_comment_${comment.id}`) as HTMLInputElement).value
        const res = await fetchWithHeader("/comments", "POST",
            ({body: text, comment_id: comment.id, post_id: comment.post_id} as any))
        if (res.status === "error") {
            setError(parseError(res.message))
            return
        }

        setError("Success")
        navigate(0)
    }
}

export default function CommentE(prop: any) {
    const comment = prop.comment as Comment
    const navigate = prop.navigate
    const [body, setBody] = useState<string>(comment.body)
    const [isPatching, setIsPatching] = useState<boolean>(false)
    const [isReplying, setIsReplying] = useState<boolean>(false)
    const [replyError, setReplyError] = useState<string>("")
    const [patchError, setPatchError] = useState<string>("")

    function replyOnClick() {
        setIsReplying(!isReplying)
    }

    async function patchOnClick() {
        const newCommentBody = (document.getElementById(`patch-comment-${comment.id}`) as HTMLInputElement).value
        const res = await fetchWithHeader(`/comments/${comment.id}`, "PATCH", {body: newCommentBody} as any)
        if (res.status === "error") {
            setPatchError(parseError(res.message))
            return
        }

        setIsPatching(false)
        setBody(newCommentBody)
    }

    function PatchForm() {
        return (
            <>
                <TextField id={`patch-comment-${comment.id}`} label="Edit Comment" defaultValue={body} />
                <ErrorText error={patchError} />
                <Button variant="contained" disableElevation onClick={patchOnClick}>Patch</Button>
            </>
        )
    }

    return (
        <Grid container key={comment.id}>
            <Grid item xs="auto" sx={{ display: "flex" }}>
                <AvatarColumn user={comment.user} />
            </Grid>
            <Grid item xs>
                <ThemeProvider theme={themeAccordion}>
                    <Accordion defaultExpanded={true} disableGutters={true} sx={{ boxShadow: "none"}}>
                        <AccordionSummary>
                            <UsernameDate comment={comment} post_user_id={prop.post_user_id} />
                        </AccordionSummary>
                        <AccordionDetails>
                            {isPatching ? <PatchForm /> : <Typography sx={{ whiteSpace: "pre-line" }}>{body}</Typography>}
                            <CommentBottomControls comment={comment} replyOnClick={replyOnClick} navigate={navigate} setPatch={setIsPatching} />
                            {isReplying ? <ReplyForm comment={comment} error={replyError} onClick={sendReplyComment(comment, navigate, setReplyError)} /> : undefined}
                            { comment.comments?.map(comment =>
                                <Grid item xs="auto">
                                    <CommentE comment={comment} post_user_id={prop.post_user_id} navigate={navigate} />
                                </Grid>
                            ) }
                        </AccordionDetails>
                    </Accordion>
                </ThemeProvider>
            </Grid>
        </Grid>
    );
}
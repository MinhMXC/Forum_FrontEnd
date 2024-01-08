import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button, createTheme,
    Grid,
    IconButton, Menu, MenuItem, TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import {MoreHoriz} from "@mui/icons-material";
import timeAgoTextGenerator from "../helper/timeAgoTextGenerator";
import "../App.css"
import Comment from "../interfaces/Comment"
import React, {useState} from "react";
import {NavigateFunction} from "react-router-dom";
import ErrorText from "./ErrorText";
import fetchWithHeader from "../helper/fetchWithHeader";
import parseError from "../helper/parseError";
import SimpleUser from "../interfaces/SimpleUser";
import APP_CONSTANTS from "../helper/ApplicationConstants";
import UserAvatar from "./UserAvatar";
import LikeDislikeSection from "./LikeDislikeSection";
import getTextFieldValue from "../helper/getTextFieldValue";

const secondaryTextColour= "#8a8a8a"

let themeAccordion = createTheme()
themeAccordion = createTheme({
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
                    paddingBottom: 0,
                    paddingRight: 0,
                    paddingLeft: 0,
                    [themeAccordion.breakpoints.down("sm")]: {
                        marginLeft: "-5%",
                    },
                }
            }
        }
    }
})

function UsernameDate(props: {
    comment: Comment
    post_user_id: number
}) {
    const comment = props.comment
    return (
        <Grid container spacing={1} alignItems="center" sx={{ mt: -0.5 }}>
            <Grid item xs="auto">
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{comment.user.username}</Typography>
            </Grid>
            {
                props.post_user_id === comment.user.id
                    ?   <Grid item xs="auto" sx={{ mt: 0.1 }}>
                            <Typography color="secondary" sx={{ fontWeight: 600, ml: -0.25 }}>OP</Typography>
                        </Grid>
                    : undefined
            }
            <Grid item xs="auto">
                <Typography variant="body2" color={secondaryTextColour} sx={{ mt: 0.1 }}>
                    {timeAgoTextGenerator(comment.created_at, comment.updated_at)}
                </Typography>
            </Grid>
        </Grid>
    );
}

function OwnerOptions(props: {
    comment: Comment,
    navigate: NavigateFunction,
    setPatch: Function
}) {
    const comment = props.comment
    const navigate = props.navigate

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
        props.setPatch(true)
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

function CommentBottomControls(props: {
    comment: Comment,
    navigate: NavigateFunction,
    setPatch: Function,
    replyOnClick: any
}) {
    const comment = props.comment as Comment
    const navigate = props.navigate

    return (
        <Grid container alignItems="center" spacing={0.3} sx={{ mb: 1, mt: 1 }} color={secondaryTextColour} fontWeight="450">
            <LikeDislikeSection
                object={comment}
                type="comment"
                likeURL={`/comments/${comment.id}/like`}
                dislikeURL={`/comments/${comment.id}/dislike`}
            />
            <Grid item xs="auto">
                <Button onClick={props.replyOnClick} sx={{ textTransform: "none", ml: 0.5 }}>
                    <Typography variant="body2">Reply</Typography>
                </Button>
            </Grid>
            {comment.owner ? <OwnerOptions comment={comment} navigate={navigate} setPatch={props.setPatch} /> : undefined}
        </Grid>
    );
}

function AvatarColumn(props: {
    user: SimpleUser
}) {
    const user = props.user
    return (
        <div className="avatar-column-div">
            <a href={APP_CONSTANTS.FRONTEND_URL + `/users/${user.id}`}
               style={{textDecoration: "none", color: "inherit"}}>
                <UserAvatar user={user} size={APP_CONSTANTS.AVATAR_SMALL} />
            </a>
            <div className="comment-nest-div"/>
        </div>
    );
}

function ReplyForm(props: {
    comment: Comment,
    onClick: any,
    error: string
}) {
    const user = props.comment.user
    const onClick = props.onClick
    return (
        <div style={{ marginBottom: "2%" }}>
            <TextField id={`reply_comment_${props.comment.id}`} placeholder={`Replying to ${user.username}`} sx={{width: "100%"}} multiline={true}/>
            <ErrorText error={props.error}/>
            <Button variant="contained" onClick={onClick} disableElevation sx={{ textTransform: "none" }}>Reply</Button>
        </div>
    );
}

export default function CommentE(prop: any) {
    const comment = prop.comment as Comment
    const navigate = prop.navigate
    const [body, setBody] = useState<string>(comment.body)
    const [isPatching, setIsPatching] = useState<boolean>(false)
    const [isReplying, setIsReplying] = useState<boolean>(false)
    const [replyError, setReplyError] = useState<string>("")
    const [patchError, setPatchError] = useState<string>("")

    //REPLY

    function replyOnClick() {
        setIsReplying(!isReplying)
    }

    async function sendReplyComment() {
        const text = getTextFieldValue(`reply_comment_${comment.id}`)
        const res = await fetchWithHeader("/comments", "POST",
            ({body: text, comment_id: comment.id, post_id: comment.post_id} as any))
        if (res.status === "error") {
            setReplyError(parseError(res.message))
            return
        }

        setReplyError("Success")
        navigate(0)
    }

    //PATCH

    async function patchOnClick() {
        const newCommentBody = getTextFieldValue(`patch-comment-${comment.id}`)
        const res = await fetchWithHeader(
            `/comments/${comment.id}`,
            "PATCH",
            {body: newCommentBody} as any
        )
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
                <TextField
                    id={`patch-comment-${comment.id}`}
                    label="Edit Comment"
                    defaultValue={body}
                    multiline
                    sx={{ width: "100%" }}
                />
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
                    <Accordion defaultExpanded disableGutters elevation={0}>
                        <AccordionSummary>
                            <UsernameDate comment={comment} post_user_id={prop.post_user_id} />
                        </AccordionSummary>
                        <AccordionDetails>
                            {
                                isPatching
                                ? <PatchForm />
                                : <Typography sx={{ whiteSpace: "pre-line" }}>{body}</Typography>
                            }
                            <CommentBottomControls
                                comment={comment}
                                replyOnClick={replyOnClick}
                                navigate={navigate}
                                setPatch={setIsPatching}
                            />
                            {
                                isReplying &&
                                <ReplyForm
                                    comment={comment}
                                    error={replyError}
                                    onClick={sendReplyComment}
                                />
                            }
                            {
                                comment.comments?.map(comment =>
                                <Grid item xs="auto">
                                    <CommentE
                                        comment={comment}
                                        post_user_id={prop.post_user_id}
                                        navigate={navigate}
                                    />
                                </Grid>
                            )}
                        </AccordionDetails>
                    </Accordion>
                </ThemeProvider>
            </Grid>
        </Grid>
    );
}
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button, createTheme,
    Grid,
    IconButton, Menu, MenuItem,
    ThemeProvider,
    Typography
} from "@mui/material";
import {MoreHoriz} from "@mui/icons-material";
import timeAgoTextGenerator from "../helper/timeAgoTextGenerator";
import "../App.css"
import Comment from "../interfaces/Comment"
import React, {useState} from "react";
import {NavigateFunction} from "react-router-dom";
import fetchWithHeader from "../helper/fetchWithHeader";
import SimpleUser from "../interfaces/SimpleUser";
import APP_CONSTANTS from "../helper/ApplicationConstants";
import UserAvatar from "./UserAvatar";
import LikeDislikeSection from "./LikeDislikeSection";
import TextEditor from "./TextEditor";
import CustomAnchor from "./CustomAnchor";

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
                props.post_user_id === comment.user.id && props.post_user_id !== -1
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
        <Grid container alignItems="center" spacing={0.3} sx={{ mt: 0.5 }} color={secondaryTextColour} fontWeight="450">
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
    user: SimpleUser,
    link: boolean
}) {
    const user = props.user

    return (
        <div className="avatar-column-div">

            <CustomAnchor hasLink={props.link} URL={`/users/${user.id}`}>
                <UserAvatar user={user} size={APP_CONSTANTS.AVATAR_SMALL} />
            </CustomAnchor>
            <div className="comment-nest-div"/>
        </div>
    );
}

export default function CommentE(props: {
    comment: Comment,
    post_user_id: number,
    navigate: NavigateFunction,
    link: boolean
}) {
    const navigate = props.navigate

    const [comment, setComment] = useState<Comment>(props.comment)
    const [replyComments, setReplyComments] = useState<Comment[]>(comment.comments)
    const [isPatching, setIsPatching] = useState<boolean>(false)
    const [isReplying, setIsReplying] = useState<boolean>(false)

    function replyOnClick() {
        setIsReplying(!isReplying)
    }

    return (
        <Grid container key={comment.id} sx={{ mt: "10px" }}>
            <Grid item xs="auto" sx={{ display: "flex" }}>
                <AvatarColumn user={comment.user} link={props.link} />
            </Grid>
            <Grid item xs>
                <ThemeProvider theme={themeAccordion}>
                    <Accordion defaultExpanded disableGutters elevation={0}>
                        <AccordionSummary>
                            <UsernameDate comment={comment} post_user_id={props.post_user_id} />
                        </AccordionSummary>
                        <AccordionDetails>
                            {
                                isPatching
                                ? <TextEditor
                                        postURL={`/comments/${comment.id}`}
                                        method="PATCH"
                                        buttonText="Patch"
                                        fillJSON={(str: string) => {
                                            return {body: str}
                                        }}
                                        onSuccessFunc={(_: string, resData: any) => {
                                            setComment(resData)
                                            setIsPatching(false)
                                        }}
                                        defaultValue={comment.body}
                                  />
                                : <Typography
                                      dangerouslySetInnerHTML={{ __html: comment.body }}
                                      sx={{ whiteSpace: "pre-line", overflowWrap: "anywhere" }}
                                    />
                            }
                            <CommentBottomControls
                                comment={comment}
                                replyOnClick={replyOnClick}
                                navigate={navigate}
                                setPatch={setIsPatching}
                            />
                            {
                                isReplying &&
                                <TextEditor
                                    postURL="/comments"
                                    method="POST"
                                    buttonText="Reply"
                                    fillJSON={(editorValue: string) => {
                                        return {body: editorValue, post_id: comment.post_id, comment_id: comment.id}
                                    }}
                                    onSuccessFunc={(_: string, resData: any) => {
                                        setIsReplying(false)
                                        setReplyComments([resData, ...replyComments])
                                    }}
                                    placeholder={`Replying to ${comment.user.username}`}
                                />
                            }
                            {
                                replyComments?.map(comment =>
                                    <CommentE
                                        key={comment.id}
                                        comment={comment}
                                        post_user_id={props.post_user_id}
                                        navigate={navigate}
                                        link={props.link}
                                    />
                            )}
                        </AccordionDetails>
                    </Accordion>
                </ThemeProvider>
            </Grid>
        </Grid>
    );
}
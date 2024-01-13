import {
    Backdrop,
    Grid,
    IconButton, Menu, MenuItem,
    Typography
} from "@mui/material";
import timeAgoTextGenerator from "../helper/timeAgoTextGenerator";
import {CommentOutlined, MoreHoriz} from "@mui/icons-material";
import Post from "../interfaces/Post";
import parseString from "../helper/parseString";
import {useState} from "react";
import {NavigateFunction, useLocation} from "react-router-dom";
import fetchWithHeader from "../helper/fetchWithHeader";
import APP_CONSTANTS from "../helper/ApplicationConstants";
import UserAvatar from "./UserAvatar";
import TagsSection from "./TagsSection";
import LikeDislikeSection from "./LikeDislikeSection";
import CustomAnchor from "./CustomAnchor";
import Warning from "./Warning";

const secondaryTextColour= "#8a8a8a"

function ImageUsernameDate(props: {
    post: Post,
    link: boolean
}) {
    const post = props.post
    return (
        <Grid container alignItems="center" spacing={1}>
            <Grid item xs="auto">
                <CustomAnchor hasLink={props.link} URL={`/users/${post.user.id}`}>
                    <UserAvatar user={post.user} size={APP_CONSTANTS.AVATAR_MEDIUM} />
                </CustomAnchor>
            </Grid>
            <Grid item xs="auto">
                <Typography variant="h6">{post.user.username}</Typography>
            </Grid>
            <Grid item xs="auto">
                <Typography variant="body1" color={secondaryTextColour} sx={{ mt: 0.25 }}>
                    {timeAgoTextGenerator(post.created_at, post.updated_at)}
                </Typography>
            </Grid>
        </Grid>
    );
}

function PostImage(props: {
    post: Post
}) {
    const post = props.post
    const [isMaxWidth, setIsMaxWidth] = useState<boolean>(false)

    let style: any = {
        maxWidth: "100%",
        maxHeight: window.screen.height * 2 / 3,
    }
    if (isMaxWidth) {
        style = {
            width: "100%",
            height: "100%",
        }
    }

    return (
        <div className="post-image-container" style={{ display: post.image ? "flex" : "none" }}>
            <img
                src={parseString(post.image)}
                alt={`post-${post.id}-img`}
                onClick={() => setIsMaxWidth(!isMaxWidth)}
                style={style}
            />
        </div>
    )
}

function PostBody(props: {
    post: Post,
    link: boolean
}) {
    const post = props.post
    return (
        <>
            <CustomAnchor hasLink={props.link} URL={`/posts/${post.id}`}>
                <Typography variant="h5" fontWeight="450">{post.title}</Typography>
            </CustomAnchor>

            <PostImage post={post} />

            <CustomAnchor hasLink={props.link} URL={`/posts/${post.id}`}>
                <Typography
                    variant="body1"
                    dangerouslySetInnerHTML={{__html: post.body}}
                    sx={{mt: 1, whiteSpace: "pre-line"}}
                />
            </CustomAnchor>
        </>
    );
}

function OwnerOptions(props: {
    post: Post,
    navigate: NavigateFunction
}) {
    const post = props.post
    const navigate: NavigateFunction = props.navigate

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl)

    const location = useLocation()
    const [backdropOpen, setBackdropOpen] = useState<boolean>(false)
    const disclaimer = `This will only delete the post itself, not including the comments to it.`

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    function deleteButtonOnClick() {
        if (!/\/posts\/\d+/.test(location.pathname)) {
            navigate(`/posts/${post.id}`)
            return
        }
        setAnchorEl(null)
        setBackdropOpen(true)
    }

    async function deletePost() {
        await fetchWithHeader(`/posts/${post.id}`, "DELETE")
        navigate(0)
    }

    function updatePost() {
        navigate(`/make_post?post_id=${post.id}`)
    }

    return (
        <>
            <Grid item xs="auto" sx={{ ml: 1 }}>
                <IconButton onClick={handleClick} sx={{ padding: 0.5 }} color="inherit">
                    <MoreHoriz />
                </IconButton>
                <Menu elevation={2} anchorEl={anchorEl} open={open} onClose={handleClose}>
                    <MenuItem onClick={updatePost}>Edit</MenuItem>
                    <MenuItem onClick={deleteButtonOnClick}>Delete</MenuItem>
                </Menu>
            </Grid>
            <Backdrop open={backdropOpen} onClick={() => setBackdropOpen(false)} sx={{ zIndex: 999 }}>
                <Warning disclaimer={disclaimer} onClick={deletePost}/>
            </Backdrop>
        </>
    );
}

function PostBottomControls(props: {
    post: Post,
    navigate: NavigateFunction
}) {
    const post = props.post
    return (
        <Grid
            container
            alignItems="center"
            spacing={0.3}
            sx={{ mt: 1 }}
            color={secondaryTextColour}
            fontWeight="450"
        >
            <LikeDislikeSection
                object={post}
                type="post"
                likeURL={`/posts/${post.id}/like`}
                dislikeURL={`/posts/${post.id}/dislike`}
            />
            <Grid item xs="auto">
                <CommentOutlined color="inherit" sx={{ ml: 2, mt: 0.8 }} />
            </Grid>
            <Grid item xs="auto" sx={{ ml: 0.5 }}>
                <Typography color="inherit" fontWeight="inherit">
                    {post.comments_count} Comments
                </Typography>
            </Grid>
            {post.owner && <OwnerOptions post={post} navigate={props.navigate} />}
        </Grid>
    );
}

export default function PostSection(props: {
    post: Post,
    navigate: NavigateFunction,
    postLink: boolean,
    userLink: boolean
}) {
    let post = props.post as Post
    const div_opacity = {
        opacity: !props.postLink ? 1 : post.visited ? 0.6 : 1
    }

    return (
        <div style={div_opacity} key={post.id}>
            <ImageUsernameDate post={post} link={props.userLink} />
            <TagsSection tags={post.tags} sx={{ mt: 0, mb: 0.4 }} size="small" />
            <PostBody post={post} link={props.postLink} />
            <PostBottomControls post={post} navigate={props.navigate} />
        </div>
    );
}
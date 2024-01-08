import {
    Grid,
    IconButton, Menu, MenuItem,
    Typography
} from "@mui/material";
import timeAgoTextGenerator from "../helper/timeAgoTextGenerator";
import {CommentOutlined, MoreHoriz} from "@mui/icons-material";
import Post from "../interfaces/Post";
import parseString from "../helper/parseString";
import {useState} from "react";
import {NavigateFunction} from "react-router-dom";
import fetchWithHeader from "../helper/fetchWithHeader";
import APP_CONSTANTS from "../helper/ApplicationConstants";
import UserAvatar from "./UserAvatar";
import TagsSection from "./TagsSection";
import LikeDislikeSection from "./LikeDislikeSection";

const secondaryTextColour= "#8a8a8a"

function ImageUsernameDate(props: {
    post: Post
}) {
    const post = props.post
    return (
        <Grid container alignItems="center" spacing={1}>
            <Grid item xs="auto">
                <a
                    href={APP_CONSTANTS.FRONTEND_URL + "/users/" + post.user.id}
                    style={{textDecoration: "none", color: "inherit"}}
                >
                    <UserAvatar user={post.user} size={APP_CONSTANTS.AVATAR_MEDIUM} />
                </a>
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

function PostBody(props: {
    post: Post
}) {
    const post = props.post
    return (
        <>
            <Typography variant="h5" fontWeight="450">
                {post.title}
            </Typography>
            {
                post.image !== null &&
                <img src={parseString(post.image)} className="post-image" alt={`post-${post.id}-img`} />
            }
            <Typography variant="body1" sx={{ mt: 1, whiteSpace: "pre-line" }}>
                {post.body}
            </Typography>
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
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    async function deletePost() {
        await fetchWithHeader(`/posts/${post.id}`, "DELETE")
        navigate(0)
    }

    function updatePost() {
        navigate(`/make_post?post_id=${post.id}`)
    }

    return (
        <Grid item xs="auto" sx={{ ml: 1 }}>
            <IconButton onClick={handleClick} sx={{ padding: 0.5 }} color="inherit">
                <MoreHoriz />
            </IconButton>
            <Menu elevation={2} anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={updatePost}>Edit</MenuItem>
                <MenuItem onClick={deletePost}>Delete</MenuItem>
            </Menu>
        </Grid>
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
    link: boolean,
}) {
    let post = props.post as Post
    const pointerEvent = props.link ? "auto" : "none"
    const div_opacity = {
        opacity: !props.link ? 1 : post.visited ? 0.6 : 1
    }

    return (
        <div style={div_opacity} key={post.id}>
            <ImageUsernameDate post={post} />
            <TagsSection tags={post.tags} sx={{ mt: 0, mb: 0.4 }} size="small" />
            <a
                href={APP_CONSTANTS.FRONTEND_URL + "/posts/" + post.id}
                className="no-decor-anchor"
                style={{ color: "inherit", pointerEvents: pointerEvent }}
            >
                <PostBody post={post} />
            </a>
            <PostBottomControls post={post} navigate={props.navigate} />
        </div>
    );
}
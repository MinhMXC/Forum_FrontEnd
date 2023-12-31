import {
    Avatar,
    Chip,
    Grid,
    IconButton, Menu, MenuItem,
    Typography
} from "@mui/material";
import default_avatar from "../resources/default_avatar.jpg";
import convertEpochToTimeAgo from "../helper/convertEpochToTimeAgo";
import {CommentOutlined, MoreHoriz, ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined} from "@mui/icons-material";
import Post from "../interfaces/Post";
import parseString from "../helper/parseString";
import Tag from "../interfaces/Tag";
import {useEffect, useState} from "react";
import {NavigateFunction} from "react-router-dom";
import fetchWithHeader from "../helper/fetchWithHeader";

const secondaryTextColour= "#8a8a8a"

function ImageUsernameDate(post: Post) {
    const time = post.updated_at === post.created_at
        ? convertEpochToTimeAgo(+post.created_at)
        : convertEpochToTimeAgo(+post.created_at) + " (edited: " + convertEpochToTimeAgo(+post.updated_at) + ")"

    return (
        <Grid container alignItems="center" spacing={1}>
            <Grid item xs="auto">
                <a href={"http://localhost:3000/users/" + post.user.id}
                   style={{textDecoration: "none", color: "inherit"}}>
                    <Avatar alt={post.user.id === -1 ? "" : post.user.username} src={parseString(post.user.image)} sx={{height: 40, width: 40}}>
                        {post.user.id === -1 ? undefined : <Avatar alt="default" src={default_avatar}/>}
                    </Avatar>
                </a>
            </Grid>
            <Grid item xs="auto">
                <Typography variant="h6">{post.user.username}</Typography>
            </Grid>
            <Grid item xs="auto">
                <Typography variant="body1" color={secondaryTextColour}>{time}</Typography>
            </Grid>
        </Grid>
    );
}

function TagElement(prop: any) {
    const tag = prop.tag as Tag
    return (
        <Chip label={tag.tag_text} variant="filled" size="small" sx={{ bgcolor: tag.colour }}></Chip>
    );
}

function PostTags(prop: any) {
    const tags = prop.tags as Tag[]
    return (
        <Grid container sx={{ mt: 1, mb: 0.4 }}>
            {tags.map(tag => <Grid item xs="auto"><TagElement tag={tag}/></Grid>)}
        </Grid>
    );
}

function PostBody(post: Post) {
    return (
        <>
            <Typography variant="h5" fontWeight="450">{post.title}</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>{post.body}</Typography>
        </>
    );
}

function OwnerOptions(prop: any) {
    const post = prop.post
    const navigate: NavigateFunction = prop.navigate

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl)
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    async function deletePost() {
        await fetchWithHeader(`http://localhost:5000/posts/${post.id}`, "DELETE")
        navigate(0)
    }

    function updatePost() {
        navigate(`/make_post?mode=update&post_id=${post.id}`)
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

function PostBottomControls(prop: any) {
    const post = prop.post
    // userState: -2 => not logged in, -1 => dislike, 0 => none, 1 => like

    let [userState, setUserState] = useState<number>(post.userState)
    let [like, setLike] = useState<boolean>(userState === 1)
    let [dislike, setDislike] = useState<boolean>(userState === -1)

    let [like_count, setLikeCount] = useState(post.posts_likes_count)
    let [dislike_count, setDislikeCount] = useState(post.posts_dislikes_count)

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
            fetchWithHeader(`http://localhost:5000/posts/${post.id}/like`, "POST")
            setLike(false)
            setUserState(0)
            setLikeCount(like_count - 1)
            return
        }

        fetchWithHeader(`http://localhost:5000/posts/${post.id}/like`, "POST")
        if (userState === -1)
            setDislikeCount(dislike_count - 1)
        setLikeCount(like_count + 1)
        setUserState(1)
    }

    function dislikeOnClick() {
        if (userState === -2)
            return

        if (userState === -1) {
            fetchWithHeader(`http://localhost:5000/posts/${post.id}/dislike`, "POST")
            setDislike(false)
            setUserState(0)
            setDislikeCount(dislike_count - 1)
            return
        }

        fetchWithHeader(`http://localhost:5000/posts/${post.id}/dislike`, "POST")
        if (userState === 1)
            setLikeCount(like_count - 1)
        setDislikeCount(dislike_count + 1)
        setUserState(-1)
    }

    return (
        <Grid container alignItems="center" spacing={0.3} sx={{ mt: 1 }} color={secondaryTextColour} fontWeight="450">
            <Grid item xs="auto">
                <IconButton onClick={likeOnClick} sx={{ padding: 0.5 }} color="inherit">
                    {like ? <ThumbUp color="primary" /> : <ThumbUpOutlined />}
                </IconButton>
            </Grid>
            <Grid item xs="auto">
                <Typography color="inherit" fontWeight="inherit">{like_count}</Typography>
            </Grid>
            <Grid item xs="auto">
                <div id="post-like-dislike-separating-div">&nbsp;</div>
            </Grid>
            <Grid item xs="auto">
                <IconButton onClick={dislikeOnClick} sx={{ padding: 0.5, mt: 0.5 }} color="inherit">
                    {dislike ? <ThumbDown color="primary" /> : <ThumbDownOutlined />}
                </IconButton>
            </Grid>
            <Grid item xs="auto">
                <Typography color="inherit" fontWeight="inherit">{dislike_count}</Typography>
            </Grid>
            <Grid item xs="auto">
                <CommentOutlined color="inherit" sx={{ ml: 3, mt: 0.8 }} />
            </Grid>
            <Grid item xs="auto" sx={{ ml: 0.5 }}>
                <Typography color="inherit" fontWeight="inherit">{post.comments_count} Comments</Typography>
            </Grid>
            {post.owner ? <OwnerOptions post={post} navigate={prop.navigate} /> : undefined}
        </Grid>
    );
}

function PostSection(prop: any) {
    let post = prop.post as Post
    const pointerEvent = prop.link === undefined ? "auto" : prop.link ? "auto" : "none"
    return (
        <div style={{ opacity: post.visited ? 0.5 : 1 }}>
            <ImageUsernameDate {...post} />
            <PostTags tags={post.tags}/>
            <a href={ "http://localhost:3000/posts/" + post.id }
               style={{ textDecoration: "none", color: "inherit", pointerEvents: pointerEvent }}>
                <PostBody {...post} />
            </a>
            <PostBottomControls post={post} navigate={prop.navigate} />
        </div>
    );
}

export default PostSection;
import {Avatar, Box, createTheme, Grid, Icon, IconButton, Typography} from "@mui/material";
import default_avatar from "../resources/default_avatar.jpg";
import convertEpochToTimeAgo from "../helper/convertEpochToTimeAgo";
import {CommentOutlined, ThumbDownOutlined, ThumbUpOutlined} from "@mui/icons-material";
import Post from "../interfaces/Post";
import parseString from "../helper/parseString";

const secondaryTextColour= "#8a8a8a"

function ImageUsernameDate(post: Post) {
    return (
        <Grid container alignItems="center" spacing={1.5}>
            <Grid item xs="auto">
                <a href={"http://localhost:3000/users/" + post.user.id}
                   style={{textDecoration: "none", color: "inherit"}}>
                    <Avatar alt={post.user.username} src={parseString(post.user.image)} sx={{height: 36, width: 36}}>
                        <Avatar alt="default" src={default_avatar}/>
                    </Avatar>
                </a>
            </Grid>
            <Grid item xs="auto">
                <Typography sx={{fontWeight: 500}}>{post.user.username}</Typography>
            </Grid>
            <Grid item xs="auto">
                <Typography variant="body2" color={secondaryTextColour}>{convertEpochToTimeAgo(+post.created_at)}</Typography>
            </Grid>
        </Grid>
    );
}

function PostBody(post: Post) {
    return (
        <Box sx={{ mt: 1.5 }}>
            <Typography variant="h5" fontWeight="450">{post.title}</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>{post.body}</Typography>
        </Box>
    );
}

function PostBottomControls(post: Post) {
    return (
        <Grid container alignItems="center" spacing={0.3} sx={{ mt: 1 }} color={secondaryTextColour} fontWeight="450">
            <Grid item xs="auto">
                <IconButton sx={{ padding: 0.5 }} color="inherit">
                    <ThumbUpOutlined />
                </IconButton>
            </Grid>
            <Grid item xs="auto">
                <Typography color="inherit" fontWeight="inherit">{post.like_count}</Typography>
            </Grid>
            <Grid item xs="auto">
                <div id="post-like-dislike-separating-div">&nbsp;</div>
            </Grid>
            <Grid item xs="auto">
                <IconButton sx={{ padding: 0.5, mt: 0.5 }} color="inherit">
                    <ThumbDownOutlined />
                </IconButton>
            </Grid>
            <Grid item xs="auto">
                <Typography color="inherit" fontWeight="inherit">{post.dislike_count}</Typography>
            </Grid>
            <Grid item xs="auto">
                <CommentOutlined color="inherit" sx={{ ml: 5, mt: 0.7 }} />
            </Grid>
            <Grid item xs="auto" sx={{ ml: 0.5 }}>
                <Typography color="inherit" fontWeight="inherit">{post.comments_count} Comments</Typography>
            </Grid>
        </Grid>
    );
}

function PostSection(prop: any) {
    const post = prop.post
    const pointerEvent = prop.link === undefined ? "auto" : prop.link ? "auto" : "none"
    return (
        <div style={{ opacity: post.visited ? 0.5 : 1 }}>
            <ImageUsernameDate {...post} />
            <a href={ "http://localhost:3000/posts/" + post.id }
               style={{ textDecoration: "none", color: "inherit", pointerEvents: pointerEvent }}>
                <PostBody {...post} />
            </a>
            <PostBottomControls {...post} />
        </div>
    );
}

export default PostSection;
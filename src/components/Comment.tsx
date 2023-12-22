import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box,
    Button, createTheme,
    Grid,
    IconButton,
    ThemeProvider,
    Typography
} from "@mui/material";
import {CommentOutlined, ThumbDownOutlined, ThumbUpOutlined} from "@mui/icons-material";
import convertEpochToTimeAgo from "../helper/convertEpochToTimeAgo";
import default_avatar from "../resources/default_avatar.jpg"
import "../App.css"
import Comment from "../interfaces/Comment"
import parseString from "../helper/parseString";

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
                    paddingTop: 5,
                    paddingLeft: 7,
                    paddingBottom: 0
                }
            }
        }
    }
})

function UsernameDate(comment: Comment) {
    return (
        <Grid container spacing={1} alignItems="center">
            <Grid item xs="auto">
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{comment.user.username}</Typography>
            </Grid>
            <Grid item xs="auto">
                <Typography variant="body2" color={secondaryTextColour}>{convertEpochToTimeAgo(+comment.created_at)}</Typography>
            </Grid>
        </Grid>
    );
}

function CommentBottomControls(comment: Comment) {
    return (
        <Grid container alignItems="center" spacing={0.3} sx={{ mb: 1 }} color={secondaryTextColour} fontWeight="450">
            <Grid item xs="auto">
                <IconButton sx={{ padding: 0.5 }} color="inherit">
                    <ThumbUpOutlined sx={{ width: 20 }} />
                </IconButton>
            </Grid>
            <Grid item xs="auto">
                <Typography variant="body2" color="inherit" fontWeight="inherit">{comment.like_count}</Typography>
            </Grid>
            <Grid item xs="auto">
                <div id="comment-like-dislike-separating-div">&nbsp;</div>
            </Grid>
            <Grid item xs="auto">
                <IconButton sx={{ padding: 0.5, mt: 0.5 }} color="inherit">
                    <ThumbDownOutlined sx={{ width: 20 }} />
                </IconButton>
            </Grid>
            <Grid item xs="auto">
                <Typography variant="body2" color="inherit" fontWeight="inherit">{comment.dislike_count}</Typography>
            </Grid>
            <Grid item xs="auto">
                <Button sx={{ textTransform: "none", ml: 1 }}>
                    <Typography variant="body2">Reply</Typography>
                </Button>
            </Grid>
        </Grid>
    );
}

function AvatarColumn(comment: Comment) {
    return (
        <div className="avatar-column-div">
            <a href={"http://localhost:3000/users/" + comment.user.id}
               style={{textDecoration: "none", color: "inherit"}}>
                <Avatar alt={comment.user.username} src={parseString(comment.user.image)} sx={{height: 28, width: 28}}>
                    <Avatar alt="default" src={default_avatar}/>
                </Avatar>
            </a>
            <div className="comment-nest-div"/>
        </div>
    );
}

function CommentE(comment: Comment) {
    return (
        <Grid container key={comment.id}>
            <Grid item xs="auto" sx={{ display: "flex" }}>
                <AvatarColumn {...comment} />
            </Grid>
            <Grid item xs>
                <ThemeProvider theme={themeAccordion}>
                    <Accordion defaultExpanded={true} disableGutters={true} sx={{ boxShadow: "none"}}>
                        <AccordionSummary>
                            <UsernameDate {...comment} />
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>{comment.body}</Typography>
                            <CommentBottomControls {...comment}/>
                            { comment.comments?.map(comment => <Grid item xs="auto"><CommentE {...comment} /></Grid>) }
                        </AccordionDetails>
                    </Accordion>
                </ThemeProvider>
            </Grid>
        </Grid>
    );
}

export default CommentE
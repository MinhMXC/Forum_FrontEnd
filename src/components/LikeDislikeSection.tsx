import React, {useEffect, useState} from "react";
import fetchWithHeader from "../helper/fetchWithHeader";
import {Grid, IconButton, Typography} from "@mui/material";
import {ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined} from "@mui/icons-material";

export default function LikeDislikeSection(props: {
    object: any,
    likeURL: string,
    dislikeURL: string,
    type: string
}) {
    const object = props.object
    const likeURL = props.likeURL
    const dislikeURL = props.dislikeURL

    const [userState, setUserState] = useState<number>(object.userState)
    const [like, setLike] = useState<boolean>(userState === 1)
    const [dislike, setDislike] = useState<boolean>(userState === -1)

    const [like_count, setLikeCount] = useState(props.type === "comment"
                                                ? object.comments_likes_count
                                                : object.posts_likes_count)
    const [dislike_count, setDislikeCount] = useState(props.type === "comment"
                                                ? object.comments_dislikes_count
                                                : object.posts_dislikes_count)

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
            void fetchWithHeader(likeURL, "POST")
            setLike(false)
            setUserState(0)
            setLikeCount(like_count - 1)
            return
        }

        void fetchWithHeader(likeURL, "POST")
        if (userState === -1)
            setDislikeCount(dislike_count - 1)
        setLikeCount(like_count + 1)
        setUserState(1)
    }

    function dislikeOnClick() {
        if (userState === -2)
            return

        if (userState === -1) {
            void fetchWithHeader(dislikeURL, "POST")
            setDislike(false)
            setUserState(0)
            setDislikeCount(dislike_count - 1)
            return
        }

        void fetchWithHeader(dislikeURL, "POST")
        if (userState === 1)
            setLikeCount(like_count - 1)

        setDislikeCount(dislike_count + 1)
        setUserState(-1)
    }

    return (
        <Grid
            container
            alignItems="center"
            spacing={0.3}
            sx={{ width: "fit-content" }}
            color="inherit"
            fontWeight="450"
        >
            <Grid item xs="auto">
                <IconButton
                    onClick={likeOnClick}
                    sx={{ padding: 0.5, width: 30 }}
                    color="inherit"
                >{like ? <ThumbUp color="primary" /> : <ThumbUpOutlined />}</IconButton>
            </Grid>

            <Grid item xs="auto">
                <Typography
                    variant="body2"
                    color="inherit"
                    fontWeight="inherit"
                >{like_count}</Typography>
            </Grid>

            <Grid item xs="auto">
                <div className="like-dislike-separating-div">&nbsp;</div>
            </Grid>

            <Grid item xs="auto">
                <IconButton
                    onClick={dislikeOnClick}
                    sx={{ padding: 0.5, mt: 0.5, width: 30 }}
                    color="inherit"
                >{dislike ? <ThumbDown color="primary" /> : <ThumbDownOutlined />}</IconButton>
            </Grid>

            <Grid item xs="auto">
                <Typography
                    variant="body2"
                    color="inherit"
                    fontWeight="inherit"
                >{dislike_count}</Typography>
            </Grid>
        </Grid>
    );
}
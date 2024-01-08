import React, {useEffect, useState} from 'react';
import CommentE from './Comment'
import Comment from '../interfaces/Comment'
import {Button, ButtonGroup, Grid, TextField, Typography} from "@mui/material";
import {NavigateFunction} from "react-router-dom";
import ErrorText from "./ErrorText";
import fetchWithHeader from "../helper/fetchWithHeader";
import parseError from "../helper/parseError";
import getTextFieldValue from "../helper/getTextFieldValue";

function InputComment(props: {
    post_id: number,
    navigate: NavigateFunction
}) {
    const [error, setError] = useState<string>("")

    async function commentButtonOnClick() {
        const text = getTextFieldValue("post_comment")
        const res = await fetchWithHeader("/comments", "POST",
            ({body: text, post_id: props.post_id} as any))
        if (res.status === "error") {
            setError(parseError(res.message))
            return
        }

        setError("Success")
        props.navigate(0)
    }

    return (
        <div>
            <TextField
                id="post_comment"
                placeholder="Add your thoughts!"
                sx={{ width: "100%" }}
                multiline
            />
            <ErrorText error={error}/>
            <Button
                variant="contained"
                onClick={commentButtonOnClick}
                disableElevation
                sx={{ mt: {xs: 0.5} }}
            >Comment</Button>
        </div>
    );
}

function SortByButtons(props: {
    sortBy: number,
    setSortBy: any
}) {
    const sortBy = props.sortBy
    const setSortBy = props.setSortBy

    function SortByButton(props: {
        id: number,
        text: string
    }) {
        const color = sortBy === props.id ? "primary" : "inherit"
        return (
            <Button color={color} onClick={() => setSortBy(props.id)}>
                {props.text}
            </Button>
        )
    }

    return (
        <div className="sortby-container">
            <Grid container alignItems="center">
                <Grid item xs="auto">
                    <Typography
                        sx={{color: "black", fontSize: {sm: "135%", xs: "110%"}, fontWeight: 500}}
                    >Sort By:</Typography>
                </Grid>
                <Grid item xs={9} sx={{ pl: {xs: 1, sm: 1.5} }}>
                    <ButtonGroup
                        variant="contained"
                        disableElevation
                        color="inherit"
                        sx={{ width: "100%" }}
                    >
                        <SortByButton id={0} text="Likes"></SortByButton>
                        <SortByButton id={1} text="Dislikes"></SortByButton>
                        <SortByButton id={2} text="New"></SortByButton>
                        <SortByButton id={3} text="Old"></SortByButton>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </div>
    )
}

export default function CommentSection(props: {
    post_id: number,
    navigate: NavigateFunction,
    comments: Comment[],
    post_user_id: number
}) {
    const [comments, setComments] = useState<Comment[]>(props.comments)
    const [sortBy, setSortBy] = useState<number>(0)

    useEffect(() => {
        // 0: Likes, 1: Dislikes, 2: New, 3: Old
        switch (sortBy) {
            case 0: {
                setComments([...comments].sort((x, y) => y.comments_likes_count - x.comments_likes_count))
                break
            }
            case 1: {
                setComments([...comments].sort((x, y) => y.comments_dislikes_count - x.comments_dislikes_count))
                break
            }
            case 2: {
                setComments([...comments].sort((x, y) => y.updated_at - x.updated_at))
                break
            }
            case 3: {
                setComments([...comments].sort((x, y) => x.updated_at - y.updated_at))
                break
            }
        }
    }, [sortBy]);

    return (
        <div>
            <SortByButtons sortBy={sortBy} setSortBy={setSortBy} />
            <InputComment post_id={props.post_id} navigate={props.navigate} />
            <div style={{ marginBottom: comments.length === 0 ? undefined : "-10px" }}>
                {comments.map(comment =>
                    <div style={{ marginTop: "10px" }}>
                        <CommentE
                            comment={comment}
                            post_user_id={props.post_user_id}
                            navigate={props.navigate}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
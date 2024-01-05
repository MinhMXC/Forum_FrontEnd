import React, {useEffect, useState} from 'react';
import CommentE from './Comment'
import Comment from '../interfaces/Comment'
import {Button, ButtonGroup, Grid, TextField, Typography} from "@mui/material";
import {NavigateFunction} from "react-router-dom";
import ErrorText from "./ErrorText";
import fetchWithHeader from "../helper/fetchWithHeader";
import parseError from "../helper/parseError";

function commentButtonOnClick(post_id: number, navigate: NavigateFunction, setError: Function) {
    return async () => {
        const text = (document.getElementById("post_comment") as HTMLInputElement).value
        const res = await fetchWithHeader("/comments", "POST",
            ({body: text, post_id: post_id} as any))
        if (res.status === "error") {
            setError(parseError(res.message))
            return
        }

        setError("Success")
        navigate(0)
    }
}

function InputComment(prop: any) {
    let [error, setError] = useState<string>("")
    return (
        <div>
            <TextField id="post_comment" placeholder="Add your thoughts!" sx={{ width: "100%" }} multiline={true} />
            <ErrorText error={error}/>
            <Button variant="contained"
                    onClick={commentButtonOnClick(prop.post_id, prop.navigate, setError)}
                    disableElevation
                    sx={{ mt: {xs: 0.5} }}
            >Comment</Button>
        </div>
    );
}

function SortByButtons(prop: any) {
    const sortBy = prop.sortBy
    const setSortBy = prop.setSortBy

    function SortByButton(prop: any) {
        const id = prop.id
        const color = sortBy === id ? "primary" : "inherit"
        return (
            <Button
                color={color}
                onClick={() => setSortBy(id)}
            >{prop.text}</Button>
        )
    }

    return (
        <div className="sortby-container">
            <Grid container alignItems="center">
                <Grid item xs="auto">
                    <Typography
                        sx={{color: "black", fontSize: {sm: "135%", xs: "110%"}, fontWeight: 500,}}
                    >Sort By:</Typography>
                </Grid>
                <Grid item xs={9} sx={{ pl: {xs: 1, sm: 1.5} }}>
                    <ButtonGroup variant="contained" disableElevation color="inherit" sx={{ width: "100%" }}>
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

interface commentsProp {
    post_id: number,
    navigate: NavigateFunction,
    comments: Comment[],
    post_user_id: number
}

export default function CommentSection(prop: commentsProp) {
    const [comments, setComments] = useState<Comment[]>(prop.comments)
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
            <InputComment post_id={prop.post_id} navigate={prop.navigate} />
                {
                    comments.map(comment =>
                        <div style={{ marginTop: "1.5%" }}><
                            CommentE comment={comment} post_user_id={prop.post_user_id} navigate={prop.navigate} />
                        </div>)
                }
        </div>
    );
}
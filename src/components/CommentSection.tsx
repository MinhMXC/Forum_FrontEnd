import React, {useEffect, useState} from 'react';
import CommentE from './Comment'
import Comment from '../interfaces/Comment'
import {Button, ButtonGroup, Grid, Typography} from "@mui/material";
import {NavigateFunction} from "react-router-dom";
import TextEditor from "./TextEditor";

function SortByButton(props: {
    id: number,
    text: string,
    sortBy: number,
    setSortBy: Function,
}) {
    const color = props.sortBy === props.id ? "primary" : "inherit"
    return (
        <Button color={color} onClick={() => props.setSortBy(props.id)}>
            {props.text}
        </Button>
    )
}

function SortByButtonSection(props: {
    sortBy: number,
    setSortBy: any
}) {
    const sortBy = props.sortBy
    const setSortBy = props.setSortBy

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
                        <SortByButton id={0} text="Likes" sortBy={sortBy} setSortBy={setSortBy} />
                        <SortByButton id={1} text="Dislikes" sortBy={sortBy} setSortBy={setSortBy} />
                        <SortByButton id={2} text="New" sortBy={sortBy} setSortBy={setSortBy} />
                        <SortByButton id={3} text="Old" sortBy={sortBy} setSortBy={setSortBy} />
                    </ButtonGroup>
                </Grid>
            </Grid>
        </div>
    )
}

const MemoCommentE = React.memo(CommentE)
const MemoTextEditor = React.memo(TextEditor)

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
        <>
            <MemoTextEditor
                postURL="/comments"
                method="POST"
                buttonText="Comment"
                fillJSON={(editorValue: string) => {
                    return {body: editorValue, post_id: props.post_id}
                }}
                onSuccessFunc={(_: string, resData: any) => setComments([resData, ...comments])}
                placeholder="Add your thoughts!"
            />

            <div className="post-comment-sort-by-separating-div">&nbsp;</div>

            <SortByButtonSection sortBy={sortBy} setSortBy={setSortBy}/>

            <div style={{marginBottom: comments.length === 0 ? undefined : "-10px"}}>
                {comments.map(comment =>
                    <MemoCommentE
                        key={comment.id}
                        comment={comment}
                        post_user_id={props.post_user_id}
                        navigate={props.navigate}
                        link={true}
                    />
                )}
            </div>
        </>
    );
}
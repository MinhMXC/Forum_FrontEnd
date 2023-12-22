import React from 'react';
import CommentE from './Comment'
import Comment from '../interfaces/Comment'
import {Button, TextField} from "@mui/material";
import postData from "../helper/postData";

const postCommentURL = "http:/localhost:3000/comments"

function InputComment() {
    return (
        <div style={{ marginBottom: "2%" }}>
            <TextField placeholder="Add your thoughts!" sx={{ mb: 1, width: "100%" }} multiline={true} />
            <Button>Comment</Button>
        </div>

    );
}

interface commentsProp {
    comments: Comment[]
}

export default function CommentSection(prop: commentsProp) {
    return (
        <div>
            <InputComment />
            {prop.comments.map(comment => <CommentE {...comment} />)}
        </div>
    );
}
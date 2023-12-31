import React, {useState} from 'react';
import CommentE from './Comment'
import Comment from '../interfaces/Comment'
import {Button, TextField} from "@mui/material";
import {NavigateFunction} from "react-router-dom";
import ErrorText from "./ErrorText";
import fetchWithHeader from "../helper/fetchWithHeader";
import parseError from "../helper/parseError";

function commentButtonOnClick(post_id: number, navigate: NavigateFunction, setError: Function) {
    return async () => {
        const text = (document.getElementById("post_comment") as HTMLInputElement).value
        const res = await fetchWithHeader("http://127.0.0.1:5000/comments", "POST",
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
            >Comment</Button>
        </div>
    );
}

interface commentsProp {
    post_id: number,
    navigate: NavigateFunction,
    comments: Comment[]
}

export default function CommentSection(prop: commentsProp) {
    return (
        <div>
            <InputComment post_id={prop.post_id} navigate={prop.navigate} />
            {prop.comments.map(comment => <div style={{ marginTop: "2%" }}><CommentE comment={comment} navigate={prop.navigate} /></div>)}
        </div>
    );
}
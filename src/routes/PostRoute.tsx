import PostSection from "../components/PostSection";
import React from "react";
import CommentSection from "../components/CommentSection";
import {useLoaderData} from "react-router-dom";

export default function PostRoute(prop: any) {
    const post = (useLoaderData() as any).data
    return (
        <div>
            <div className="main-col-container" style={{ width: prop.width }}>
                <PostSection post={post} link={false} />
            </div>
            <div className="main-col-container" style={{ width: prop.width }}>
                <CommentSection comments={post.comments}/>
            </div>
        </div>
    );
}
import PostSection from "../components/PostSection";
import React from "react";
import CommentSection from "../components/CommentSection";
import {useLoaderData, useNavigate} from "react-router-dom";

export default function PostRoute() {
    const post: any = (useLoaderData() as any).data
    const navigate = useNavigate()
    return (
        <>
            <div className="section-container">
                <PostSection
                    post={post}
                    link={false}
                    navigate={navigate}
                />
            </div>
            <div className="section-container">
                <CommentSection
                    comments={post.comments}
                    post_id={post.id}
                    post_user_id={post.user.id}
                    navigate={navigate}
                />
            </div>
        </>
    );
}
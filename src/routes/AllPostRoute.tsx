import React from "react";
import PostSection from "../components/PostSection";
import Post from "../interfaces/Post";
import {useLoaderData} from "react-router-dom";

export default function AllPostRoute(prop: any) {
    const data: any = useLoaderData()
    return (
        <div>
            {
                data.data.map((post: Post) =>
                    <div key={post.id} className="main-col-container" style={{width: prop.width}}>
                        <PostSection post={post} />
                    </div>
                )
            }
        </div>
    );
}
import React, {useEffect, useState} from "react";
import PostSection from "../components/PostSection";
import Post from "../interfaces/Post";
import {useLoaderData, useNavigate} from "react-router-dom";
import {TextField} from "@mui/material";
import fetchWithHeader from "../helper/fetchWithHeader";

export default function AllPostRoute(prop: any) {
    const data: any = useLoaderData()
    const navigate = useNavigate()

    let [placeholder, setPlaceholder] = useState<string>("")
    useEffect(() => {
        fetchWithHeader("http://localhost:5000/user_simple", "GET")
            .then(json => json.status === "success"
                ? setPlaceholder("Create Post as " + json.data.username)
                : setPlaceholder("Please Login to Post"))
    }, []);

    return (
        <>
            {/*Create Post */}
            <div className="section-container" style={{width: prop.width}}>
                <TextField id="create_post" onClick={() => {navigate("/make_post")}} placeholder={placeholder} sx={{mb: 1, width: "100%", margin: 0}} multiline={true}/>
            </div>
            {
                data.data.map((post: Post) =>
                    <div key={post.id} className="section-container" style={{width: prop.width}}>
                        <PostSection post={post} navigate={navigate} />
                    </div>
                )
            }
        </>
    );
}
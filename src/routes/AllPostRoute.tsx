import React, {useEffect, useState} from "react";
import PostSection from "../components/PostSection";
import Post from "../interfaces/Post";
import {useNavigate, useSearchParams} from "react-router-dom";
import {TextField} from "@mui/material";
import fetchWithHeader from "../helper/fetchWithHeader";
import parseString from "../helper/parseString";
import Tag from "../interfaces/Tag";
import TagsSection from "../components/TagsSection";

function CreatePost(prop: any) {
    return (
        <div className="section-container">
            <TextField
                id="create_post"
                onClick={() => {prop.navigate("/make_post")}}
                placeholder={prop.placeholder}
                sx={{mb: 1, width: "100%", margin: 0}}
                multiline
            />
        </div>
    )
}

export default function AllPostRoute() {
    const navigate = useNavigate()
    let url = ""
    const [searchParams] = useSearchParams()
    const [posts, setPosts] = useState<Post[]>()
    const [placeholder, setPlaceholder] = useState<string>("")
    const [tags, setTags] = useState<Tag[]>([])

    const searchQuery = searchParams.get("search")?.toLowerCase()
    const titleQuery = searchParams.get("title")?.toLowerCase()
    const bodyQuery = searchParams.get("body")?.toLowerCase()
    const tagQuery = searchParams.get("tags")

    if (Boolean(searchQuery)) { //Simple Search
        url = `/posts?advanced=false&search=${parseString(searchQuery)}`
    } else if (Boolean(titleQuery) || Boolean(bodyQuery) || Boolean(tagQuery)) { //Advanced Search
        url = `/posts?advanced=true&title=${parseString(titleQuery)}&body=${parseString(bodyQuery)}&tags=${parseString(tagQuery)}`
    } else {
        url = "/posts"
    }

    useEffect(() => {
        fetchWithHeader(url, "GET")
            .then(res => setPosts(res.data))

        fetchWithHeader("/tags", "GET")
            .then(res => setTags(res.data))

        fetchWithHeader("/user_simple", "GET")
            .then(json => json.status === "success"
                ? setPlaceholder("Create Post as " + json.data.username)
                : setPlaceholder("Please Login to Post"))
    }, [searchParams]);

    return (
        <>
            <div className="section-container">
                <TagsSection tags={tags} size="medium" />
            </div>
            <CreatePost placeholder={placeholder} navigate={navigate} />
            {
                posts?.map((post: Post) =>
                    <div key={post.id} className="section-container">
                        <PostSection post={post} navigate={navigate} link={true} />
                    </div>
                )
            }
        </>
    );
}
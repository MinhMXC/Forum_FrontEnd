import {Autocomplete, Button, Chip, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {NavigateFunction, useLoaderData, useNavigate, useSearchParams} from "react-router-dom";
import ErrorText from "../components/ErrorText";
import Tag from "../interfaces/Tag";
import fetchWithHeader from "../helper/fetchWithHeader";
import Post from "../interfaces/Post";


function TagSelection(prop: any) {
    const tags = (useLoaderData() as any).data as Tag[]
    const updateModeTags = prop.tags as Tag[]
    useEffect(() => {
        prop.setSelected(updateModeTags)
    }, []);

    return (
        <Autocomplete
            multiple
            options={tags}
            onChange={(event, tags) => prop.setSelected(tags)}
            defaultValue={updateModeTags}
            getOptionLabel={(option: Tag) => option.tag_text}
            renderInput={(params) => (
                <TextField {...params} label="Tags" />
            )}
            renderTags={(value, getTagProps) =>
                value.map((tag: Tag, index: number) =>
                    (<Chip variant="filled" label={tag.tag_text} {...getTagProps({ index })} />))
            }
            sx={{ mb: 1 }}
        />
    );
}

function MainTextFields(prop: any) {
    return (
        <>
            <TextField id="create_post_title" label="Title" sx={{mb: 1, width: "100%"}} multiline={true}/>
            <TagSelection setSelected={prop.setSelected}/>
            <TextField id="create_post_body" label="Body" sx={{mb: 1, width: "100%"}} multiline={true}/>
        </>
    )
}

function MainTextFieldsUpdate(prop: any) {
    const post = prop.post

    return (
        <>
            <TextField id="create_post_title" label="Title" defaultValue={post.title} sx={{mb: 1, width: "100%"}} multiline={true}/>
            <TagSelection setSelected={prop.setSelected} tags={post.tags}/>
            <TextField id="create_post_body" label="Body" defaultValue={post.body} sx={{mb: 1, width: "100%"}} multiline={true}/>
        </>
    )
}

function Guidelines() {
    return (
        <>
            <p className="section-title-text">Rules & Guidelines</p>
            <p style={{ marginTop: "0.5%", fontSize: "130%" }}>Nothing is True, Everything is Permitted</p>
        </>
    );
}

function postOnClick(navigate: NavigateFunction, setError: Function, selectedTags: Tag[], mode: string, post_id: string) {
    return async () => {
        const title = (document.getElementById("create_post_title") as HTMLInputElement).value
        const body = (document.getElementById("create_post_body") as HTMLInputElement).value
        const selectedTagsId = selectedTags.map(tag => tag.id)
        const url = mode === "PATCH" ? `http://127.0.0.1:5000/posts/${post_id}` : "http://127.0.0.1:5000/posts"
        const res = await fetchWithHeader(url, mode,
            ({post: {title: title, body: body, tag_ids: selectedTagsId} } as any))
        if (res.status === "error") {
            const errorMessage = mode === "POST"
                                 ? res.message.reduce((x: string, y: string) => x === "" ? y : y + "\n" + x, "")
                                 : res.message
            setError(errorMessage)
            return
        }

        setError("Success")
        navigate(`/posts/${res.data.id}`)
    }
}

export default function MakeUpdatePostRoute(prop: any) {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    let [error, setError] = useState<string>("")
    let [selectedTags, setSelectedTags] = useState<Tag[]>([])

    const operation = searchParams.get("mode") === "update" ? "PATCH" : "POST"
    let post_id = searchParams.get("post_id")
    if (post_id === null)
        post_id = "-1"
    let [post, setPost] = useState<Post | undefined>(undefined)

    useEffect(() => {
        if (post_id === "-1")
            return
        fetchWithHeader(`http://127.0.0.1:5000/posts/${post_id}`, "GET")
            .then(res => setPost(res.data as Post))
    }, []);

    return (
        <>
            <div className="section-container" style={{width: prop.width}}>
                <Guidelines/>
            </div>
            <div className="section-container" style={{width: prop.width}}>
                {
                    post === undefined
                    ? <MainTextFields setSelected={setSelectedTags}/>
                    : <MainTextFieldsUpdate setSelected={setSelectedTags} post={post} />
                }
                <ErrorText error={error} marginTop={0.25} marginBottom={0.25}/>
                <Button variant="contained"
                        onClick={postOnClick(navigate, setError, selectedTags, operation, post_id)}
                        sx={{marginTop: 1}}
                        disableElevation
                >{operation}</Button>
            </div>
        </>
    );
}
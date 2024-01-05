import {Autocomplete, Button, Chip, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useLoaderData, useNavigate, useSearchParams} from "react-router-dom";
import ErrorText from "../components/ErrorText";
import Tag from "../interfaces/Tag";
import fetchWithHeader from "../helper/fetchWithHeader";
import Post from "../interfaces/Post";
import parseError from "../helper/parseError";
import textChipColour from "../helper/textChipColour";


function TagSelection(prop: any) {
    const tags = (useLoaderData() as any).data as Tag[]
    const updateModeTags = prop.tags as Tag[]

    useEffect(() => {
        if (updateModeTags !== undefined) {
            prop.setSelected(updateModeTags)
        }
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
                    (<Chip variant="filled" label={tag.tag_text}
                           sx={{ bgcolor: tag.colour, color: textChipColour(tag.colour) }} {...getTagProps({ index })} />))
            }
        />
    );
}

function MainTextFields(prop: any) {
    return (
        <div className="main-textfields">
            <TextField id="create_post_title" label="Title" multiline={true}/>
            <TagSelection setSelected={prop.setSelected}/>
            <TextField id="create_post_body" label="Body" multiline={true}/>
            <TextField id="create_post_image" label="Image's URL" multiline={true}/>
        </div>
    )
}

function MainTextFieldsUpdate(prop: any) {
    const post = prop.post as Post

    return (
        <div className="main-textfields">
            <TextField id="create_post_title" label="Title" defaultValue={post.title} sx={{mb: 1, width: "100%"}} multiline={true}/>
            <TagSelection setSelected={prop.setSelected} tags={post.tags}/>
            <TextField id="create_post_body" label="Body" defaultValue={post.body} sx={{mb: 1, width: "100%"}} multiline={true}/>
            <TextField id="create_post_image" label="Image's URL" defaultValue={post.image} multiline={true}/>
        </div>
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

export default function MakeUpdatePostRoute(prop: any) {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [error, setError] = useState<string>("")
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])

    const operation = searchParams.get("mode") === "update" ? "PATCH" : "POST"
    let post_id = searchParams.get("post_id")
    if (post_id === null)
        post_id = "-1"
    let [post, setPost] = useState<Post | undefined>(undefined)

    useEffect(() => {
        if (post_id === "-1")
            return
        fetchWithHeader(`/posts/${post_id}`, "GET")
            .then(res => setPost(res.data as Post))
    }, []);

    async function postOnClick() {
        const title = (document.getElementById("create_post_title") as HTMLInputElement).value
        const body = (document.getElementById("create_post_body") as HTMLInputElement).value
        let image: string | null = (document.getElementById("create_post_image") as HTMLInputElement).value
        if (image === "")
            image = null
        const selectedTagsId = selectedTags.map(tag => tag.id)
        const url = operation === "PATCH" ? `/posts/${post_id}` : "/posts"
        const res = await fetchWithHeader(url, operation,
            ({post: {title: title, body: body, tag_ids: selectedTagsId, image: image}} as any))
        if (res.status === "error") {
            setError(parseError(res.message))
            return
        }

        setError("Success")
        navigate(`/posts/${res.data.id}`)
    }

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
                        onClick={postOnClick}
                        sx={{marginTop: 1}}
                        disableElevation
                >{operation}</Button>
            </div>
        </>
    );
}
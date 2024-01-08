import {Autocomplete, Button, Chip, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useLoaderData, useNavigate, useSearchParams} from "react-router-dom";
import ErrorText from "../components/ErrorText";
import Tag from "../interfaces/Tag";
import fetchWithHeader from "../helper/fetchWithHeader";
import Post from "../interfaces/Post";
import parseError from "../helper/parseError";
import textChipColour from "../helper/textChipColour";
import getTextFieldValue from "../helper/getTextFieldValue";


function TagSelection(props: {
    tags?: Tag[]
    setSelected: Function
}) {
    const tags = (useLoaderData() as any).data as Tag[]
    const updateModeTags = props.tags as Tag[]

    useEffect(() => {
        if (updateModeTags !== undefined) {
            props.setSelected(updateModeTags)
        }
    }, []);

    return (
        <Autocomplete
            multiple
            options={tags}
            onChange={(_, tags) => props.setSelected(tags)}
            defaultValue={updateModeTags}
            getOptionLabel={(option: Tag) => option.tag_text}
            renderInput={(params) => (
                <TextField {...params} label="Tags" />
            )}
            renderTags={(value, getTagProps) =>
                value.map((tag: Tag, index: number) =>
                    (<Chip
                        variant="filled"
                        label={tag.tag_text}
                        sx={{ bgcolor: tag.colour, color: textChipColour(tag.colour) }}
                        {...getTagProps({ index })}
                    />))
            }
        />
    );
}

function MainTextFields(props: {
    setSelected: Function
}) {
    return (
        <div className="main-textfields">
            <TextField id="create_post_title" label="Title" multiline />
            <TagSelection setSelected={props.setSelected} />
            <TextField id="create_post_body" label="Body" multiline />
            <TextField id="create_post_image" label="Image's URL" multiline />
        </div>
    )
}

function MainTextFieldsUpdate(props: {
    post: Post,
    setSelected: Function
}) {
    const post = props.post as Post

    return (
        <div className="main-textfields">
            <TextField id="create_post_title" label="Title" defaultValue={post.title} multiline />
            <TagSelection setSelected={props.setSelected} tags={post.tags} />
            <TextField id="create_post_body" label="Body" defaultValue={post.body} multiline />
            <TextField id="create_post_image" label="Image's URL" defaultValue={post.image} multiline />
        </div>
    )
}

function Guidelines() {
    return (
        <div className="section-container">
            <p className="section-title-text">Rules & Guidelines</p>
            <p id="guideline-body">
                Nothing is True, Everything is Permitted
            </p>
        </div>
    );
}

export default function MakeUpdatePostRoute() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [error, setError] = useState<string>("")
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [post, setPost] = useState<Post>()

    let operation = "PATCH"
    let post_id = searchParams.get("post_id")
    if (post_id === null) {
        post_id = "-1"
        operation = "POST"
    }

    useEffect(() => {
        if (post_id === "-1")
            return
        fetchWithHeader(`/posts/${post_id}`, "GET")
            .then(res => setPost(res.data as Post))
    }, []);

    async function postOnClick() {
        const title = getTextFieldValue("create_post_title")
        const body = getTextFieldValue("create_post_body")
        let image: string | null = getTextFieldValue("create_post_image")
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
            <Guidelines/>
            <div className="section-container">
                {
                    post === undefined
                    ? <MainTextFields setSelected={setSelectedTags}/>
                    : <MainTextFieldsUpdate setSelected={setSelectedTags} post={post} />
                }
                <ErrorText error={error} marginTop={0.25} marginBottom={0.25}/>
                <Button
                    disableElevation
                    variant="contained"
                    onClick={postOnClick}
                    sx={{marginTop: 1}}
                >{operation}</Button>
            </div>
        </>
    );
}